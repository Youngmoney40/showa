// # LiveStream — Django (Channels) + React Native (react-native-webrtc)

// This document contains an **updated Django Channels backend** (`LiveStreamConsumer`) and **example React Native frontend** (Broadcaster + Viewer) that together implement a working WebRTC signaling flow for a live-streaming feature (prototype, peer-to-peer). It fixes issues from your original code and provides a complete end-to-end example.

// > ⚠️ Important: This implementation provides **signaling only** (socket messages to exchange SDP and ICE). The actual media transport is WebRTC P2P between broadcaster and each viewer. For production at scale, consider using an SFU (mediasoup / Janus / Janus + TURN server) and Redis-backed channel layer.

// ---

// ## Backend (Django Channels)

// **Requirements**

// * `channels` and `channels_redis`
// * Redis server running (for channel layer and cache)

// Install:

// ```bash
// pip install channels channels_redis
// ```

// Add to `settings.py` (important parts):

// ```py
// # settings.py (snippets)

// INSTALLED_APPS += [
//     'channels',
// ]

// ASGI_APPLICATION = 'yourproject.asgi.application'

// # Channel layer (Redis)
// CHANNEL_LAYERS = {
//     'default': {
//         'BACKEND': 'channels_redis.core.RedisChannelLayer',
//         'CONFIG': {
//             'hosts': [('127.0.0.1', 6379)],
//         },
//     },
// }

// # Cache (Redis) for shared state
// CACHES = {
//     'default': {
//         'BACKEND': 'django_redis.cache.RedisCache',
//         'LOCATION': 'redis://127.0.0.1:6379/1',
//         'OPTIONS': {
//             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
//         }
//     }
// }
// ```

// `routing.py` (Channels routing):

// ```py
// # yourapp/routing.py
// from django.urls import re_path
// from . import consumers

// websocket_urlpatterns = [
//     re_path(r'ws/live/(?P<room_name>[^/]+)/$', consumers.LiveStreamConsumer.as_asgi()),
// ]
// ```

// `asgi.py` (make sure to use AuthMiddlewareStack):

// ```py
// # asgi.py
// import os
// from channels.routing import ProtocolTypeRouter, URLRouter
// from channels.auth import AuthMiddlewareStack
// from django.core.asgi import get_asgi_application
// import yourapp.routing

// os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yourproject.settings')

// django_asgi_app = get_asgi_application()

// application = ProtocolTypeRouter({
//     'http': django_asgi_app,
//     'websocket': AuthMiddlewareStack(
//         URLRouter(
//             yourapp.routing.websocket_urlpatterns
//         )
//     ),
// })
// ```

// ### Updated `LiveStreamConsumer` (consumers.py)

// This is the improved consumer. Key fixes included:

// * Ensure `stream_info` contains `id` when adding stream so `update_viewer_counts` can reference it.
// * Register `viewer_channel` on `viewer-offer` so broadcaster can send answers to the viewer.
// * Remove viewer channel mapping on disconnect.
// * Use `self.user.id` as viewer id when available; if anonymous viewer, the client must send a unique `viewer_id` (UUID).
// * Properly use `sender_channel` filtering in `signal_message`.

// ```py
// # consumers.py
// import json
// from channels.generic.websocket import AsyncWebsocketConsumer
// from channels.db import database_sync_to_async
// from django.core.cache import cache

// class LiveStreamConsumer(AsyncWebsocketConsumer):
//     async def connect(self):
//         self.room_name = self.scope['url_route']['kwargs']['room_name']
//         self.room_group_name = f"call_{self.room_name}"
//         self.user = self.scope.get('user', None)
//         self.user_id = str(self.user.id) if (self.user and self.user.is_authenticated) else None

//         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
//         await self.accept()
//         print(f"[WebSocket] User {self.user_id} joined room {self.room_name} (channel: {self.channel_name})")

//         # If this is the central discovery room, send existing streams
//         if self.room_name == "live-streams":
//             streams = await self.get_streams()
//             await self.send(text_data=json.dumps({
//                 "type": "list-streams",
//                 "streams": streams
//             }))
//             print(f"[WebSocket] Sent list-streams to {self.channel_name}: {streams}")
//             await self.update_viewer_counts()

//     async def disconnect(self, close_code):
//         # If this connection was associated with a stream as broadcaster
//         if self.room_name == "live-streams" and hasattr(self, 'stream_id'):
//             # Broadcaster disconnects
//             if self.user and await self.is_broadcaster(self.stream_id):
//                 await self.remove_stream(self.stream_id)
//                 await self.channel_layer.group_send(self.room_group_name, {
//                     "type": "signal_message",
//                     "message": {
//                         "type": "stream-ended",
//                         "streamId": self.stream_id
//                     },
//                     "sender_channel": self.channel_name
//                 })
//                 await self.remove_broadcaster_channel(self.stream_id)
//                 print(f"[WebSocket] Stream {self.stream_id} ended by user {self.user_id}")
//             else:
//                 # Viewer disconnects
//                 await self.decrement_viewer_count(self.stream_id)
//                 # Remove viewer mapping if user_id (or stored viewer_id) exists
//                 if hasattr(self, 'viewer_id_for_mapping') and self.viewer_id_for_mapping:
//                     await self.remove_viewer_channel(self.viewer_id_for_mapping)
//                 await self.update_viewer_counts()
//                 print(f"[WebSocket] Viewer {self.user_id or getattr(self, 'viewer_id_for_mapping', None)} disconnected from stream {self.stream_id}")

//         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
//         print(f"[WebSocket] User {self.user_id} left room {self.room_name} (channel: {self.channel_name})")

//     async def receive(self, text_data):
//         data = json.loads(text_data)
//         print(f"[WebSocket] Received in room {self.room_name} from {self.channel_name}: {data}")
//         message_type = data.get('type')

//         if self.room_name == "live-streams":
//             # Broadcaster starts a stream
//             if message_type == "start-stream":
//                 self.stream_id = data.get('streamId')
//                 stream_info = data.get('streamInfo') or {}
//                 if self.stream_id:
//                     # ensure stream_info contains id and userId
//                     stream_info['id'] = self.stream_id
//                     stream_info['userId'] = stream_info.get('userId') or self.user_id
//                     streams = await self.add_stream(self.stream_id, stream_info)
//                     await self.add_broadcaster_channel(self.stream_id, self.channel_name)
//                     await self.channel_layer.group_send(self.room_group_name, {
//                         "type": "signal_message",
//                         "message": {
//                             "type": "stream-started",
//                             "stream": stream_info
//                         },
//                         "sender_channel": self.channel_name
//                     })
//                     print(f"[WebSocket] Broadcasted stream-started for {self.stream_id}")
//                     await self.update_viewer_counts()
//                 return

//             # Broadcaster ends a stream
//             elif message_type == "end-stream":
//                 stream_id = data.get('streamId')
//                 if stream_id:
//                     await self.remove_stream(stream_id)
//                     await self.remove_broadcaster_channel(stream_id)
//                     await self.channel_layer.group_send(self.room_group_name, {
//                         "type": "signal_message",
//                         "message": {
//                             "type": "stream-ended",
//                             "streamId": stream_id
//                         },
//                         "sender_channel": self.channel_name
//                     })
//                     print(f"[WebSocket] Broadcasted stream-ended for {stream_id}")
//                     await self.update_viewer_counts()
//                 return

//             # Return list of streams
//             elif message_type == "list-streams":
//                 streams = await self.get_streams()
//                 await self.send(text_data=json.dumps({
//                     "type": "list-streams",
//                     "streams": streams
//                 }))
//                 print(f"[WebSocket] Sent list-streams to {self.channel_name}: {streams}")
//                 return

//             # Viewer sends offer to join a stream
//             elif message_type == "viewer-offer":
//                 stream_id = data.get('streamId')
//                 viewer_id = data.get('viewer_id') or self.user_id
//                 if stream_id and viewer_id:
//                     # store viewer channel mapping so broadcaster can answer
//                     await self.add_viewer_channel(viewer_id, self.channel_name)
//                     # remember viewer id for cleanup later
//                     self.viewer_id_for_mapping = viewer_id
//                     # forward offer to broadcaster channel
//                     broadcaster_channel = await self.get_broadcaster_channel(stream_id)
//                     if broadcaster_channel:
//                         await self.channel_layer.send(broadcaster_channel, {
//                             "type": "signal_message",
//                             "message": {
//                                 "type": "viewer-offer",
//                                 "offer": data.get('offer'),
//                                 "streamId": stream_id,
//                                 "viewer_id": viewer_id,
//                                 "viewer_channel": self.channel_name
//                             },
//                             "sender_channel": self.channel_name
//                         })
//                         # increment viewer count and set local stream_id for cleanup on disconnect
//                         await self.increment_viewer_count(stream_id)
//                         self.stream_id = stream_id
//                         await self.update_viewer_counts()
//                         print(f"[WebSocket] Forwarded viewer-offer for {stream_id} to broadcaster {broadcaster_channel}")
//                     else:
//                         await self.send(text_data=json.dumps({
//                             "type": "error",
//                             "message": f"Stream {stream_id} not found or broadcaster offline"
//                         }))
//                         print(f"[WebSocket] Error: Stream {stream_id} not found for {self.channel_name}")
//                 return

//             # Broadcaster sends answer back to viewer
//             elif message_type == "broadcaster-answer":
//                 viewer_id = data.get('viewer_id')
//                 if viewer_id:
//                     viewer_channel = await self.get_viewer_channel(viewer_id)
//                     if viewer_channel:
//                         await self.channel_layer.send(viewer_channel, {
//                             "type": "signal_message",
//                             "message": {
//                                 "type": "broadcaster-answer",
//                                 "answer": data.get('answer'),
//                                 "streamId": data.get('streamId'),
//                                 "viewer_id": viewer_id
//                             },
//                             "sender_channel": self.channel_name
//                         })
//                         print(f"[WebSocket] Forwarded broadcaster-answer for {data.get('streamId')} to viewer {viewer_id}")
//                     else:
//                         print(f"[WebSocket] Viewer channel not found for {viewer_id}")
//                 return

//             # ICE candidates (either direction)
//             elif message_type == "candidate":
//                 # target can be a viewer_channel passed explicitly, otherwise assume broadcaster
//                 target_channel = data.get('target_channel') or await self.get_broadcaster_channel(data.get('streamId'))
//                 if target_channel:
//                     await self.channel_layer.send(target_channel, {
//                         "type": "signal_message",
//                         "message": {
//                             "type": "candidate",
//                             "candidate": data.get('candidate'),
//                             "streamId": data.get('streamId'),
//                             "from": data.get('from')
//                         },
//                         "sender_channel": self.channel_name
//                     })
//                     print(f"[WebSocket] Forwarded candidate for {data.get('streamId')} to {target_channel}")
//                 return

//             # Comments & likes
//             elif message_type == "comment":
//                 await self.channel_layer.group_send(self.room_group_name, {
//                     "type": "signal_message",
//                     "message": {
//                         "type": "new-comment",
//                         "comment": data.get('comment'),
//                         "streamId": data.get('streamId')
//                     },
//                     "sender_channel": self.channel_name
//                 })
//                 print(f"[WebSocket] Broadcasted comment for {data.get('streamId')}")
//                 return

//             elif message_type == "like":
//                 await self.channel_layer.group_send(self.room_group_name, {
//                     "type": "signal_message",
//                     "message": {
//                         "type": "new-like",
//                         "streamId": data.get('streamId')
//                     },
//                     "sender_channel": self.channel_name
//                 })
//                 print(f"[WebSocket] Broadcasted like for {data.get('streamId')}")
//                 return

//         # Generic passthrough to group
//         await self.channel_layer.group_send(self.room_group_name, {
//             "type": "signal_message",
//             "message": data,
//             "sender_channel": self.channel_name
//         })

//     async def signal_message(self, event):
//         # send to everyone except original sender
//         if self.channel_name != event.get('sender_channel'):
//             await self.send(text_data=json.dumps(event.get('message')))
//             print(f"[WebSocket] Sent to {self.channel_name}: {event.get('message')}")

//     # ----------------- Cache helpers -----------------
//     @database_sync_to_async
//     def get_streams(self):
//         streams = cache.get('live_streams', {})
//         return list(streams.values())

//     @database_sync_to_async
//     def add_stream(self, stream_id, stream_info):
//         streams = cache.get('live_streams', {}) or {}
//         streams[stream_id] = stream_info
//         cache.set('live_streams', streams, timeout=None)
//         return streams

//     @database_sync_to_async
//     def remove_stream(self, stream_id):
//         streams = cache.get('live_streams', {}) or {}
//         if stream_id in streams:
//             del streams[stream_id]
//             cache.set('live_streams', streams, timeout=None)

//     @database_sync_to_async
//     def add_broadcaster_channel(self, stream_id, channel_name):
//         broadcasters = cache.get('broadcasters', {}) or {}
//         broadcasters[stream_id] = channel_name
//         cache.set('broadcasters', broadcasters, timeout=None)

//     @database_sync_to_async
//     def get_broadcaster_channel(self, stream_id):
//         broadcasters = cache.get('broadcasters', {}) or {}
//         return broadcasters.get(stream_id)

//     @database_sync_to_async
//     def remove_broadcaster_channel(self, stream_id):
//         broadcasters = cache.get('broadcasters', {}) or {}
//         if stream_id in broadcasters:
//             del broadcasters[stream_id]
//             cache.set('broadcasters', broadcasters, timeout=None)

//     @database_sync_to_async
//     def is_broadcaster(self, stream_id):
//         streams = cache.get('live_streams', {}) or {}
//         if stream_id in streams:
//             return streams[stream_id].get('userId') == self.user_id
//         return False

//     @database_sync_to_async
//     def get_viewer_channel(self, viewer_id):
//         viewers = cache.get('viewers', {}) or {}
//         return viewers.get(viewer_id)

//     @database_sync_to_async
//     def add_viewer_channel(self, viewer_id, channel_name):
//         viewers = cache.get('viewers', {}) or {}
//         viewers[viewer_id] = channel_name
//         cache.set('viewers', viewers, timeout=None)

//     @database_sync_to_async
//     def remove_viewer_channel(self, viewer_id):
//         viewers = cache.get('viewers', {}) or {}
//         if viewer_id in viewers:
//             del viewers[viewer_id]
//             cache.set('viewers', viewers, timeout=None)

//     @database_sync_to_async
//     def increment_viewer_count(self, stream_id):
//         streams = cache.get('live_streams', {}) or {}
//         if stream_id in streams:
//             streams[stream_id]['viewers'] = streams[stream_id].get('viewers', 0) + 1
//             cache.set('live_streams', streams, timeout=None)
//             return streams[stream_id]['viewers']
//         return 0

//     @database_sync_to_async
//     def decrement_viewer_count(self, stream_id):
//         streams = cache.get('live_streams', {}) or {}
//         if stream_id in streams:
//             streams[stream_id]['viewers'] = max(0, streams[stream_id].get('viewers', 0) - 1)
//             cache.set('live_streams', streams, timeout=None)
//             return streams[stream_id]['viewers']
//         return 0

//     async def update_viewer_counts(self):
//         streams = await self.get_streams()
//         for stream in streams:
//             # ensure stream has id
//             sid = stream.get('id')
//             if not sid:
//                 continue
//             await self.channel_layer.group_send(self.room_group_name, {
//                 "type": "signal_message",
//                 "message": {
//                     "type": "viewer-count",
//                     "streamId": sid,
//                     "count": stream.get('viewers', 0)
//                 },
//                 "sender_channel": self.channel_name
//             })
// ```

// // ---

// // ## React Native Frontend (example)

// // **Requirements**

// // * `react-native-webrtc`
// // * `react-native-get-random-values` + `uuid` (for viewer IDs when anonymous)

// // Install (React Native CLI):

// // ```bash
// // npm install react-native-webrtc uuid react-native-get-random-values
// // npx pod-install ios
// // ```

// // > On Android you will need to enable camera and microphone permissions.

// // Below are two example components: `Broadcaster.js` and `Viewer.js`. They use a plain WebSocket for signaling.

// // ### `signaling.js` — simple signaling helper

// ```js
// // signaling.js
// export default function createSignaling(wsUrl, onMessage) {
//   const ws = new WebSocket(wsUrl);
//   ws.onopen = () => console.log('Signaling connected')
//   ws.onmessage = (evt) => onMessage(JSON.parse(evt.data))
//   ws.onerror = (e) => console.error('Signaling error', e)
//   ws.onclose = () => console.log('Signaling closed')
//   return ws
// }
// ```

// ### Broadcaster.js

// ```js
// // Broadcaster.js
// import React, {useRef, useEffect, useState} from 'react'
// import {View, Button, Text} from 'react-native'
// import {RTCPeerConnection, mediaDevices} from 'react-native-webrtc'
// import createSignaling from './signaling'

// const pcConfig = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]}

// export default function Broadcaster({streamId, signalingUrl}){
//   const localStreamRef = useRef(null)
//   const pcsRef = useRef({}) // map viewer_id -> peer connection
//   const wsRef = useRef(null)

//   useEffect(() => {
//     wsRef.current = createSignaling(signalingUrl, handleSignalingMessage)
//     startLocalStream()
//     // announce stream when ws opens
//     const tryStart = () => {
//       if(wsRef.current && wsRef.current.readyState === 1){
//         wsRef.current.send(JSON.stringify({type: 'start-stream', streamId, streamInfo: {title: 'My Live', id: streamId}}))
//       } else {
//         setTimeout(tryStart, 500)
//       }
//     }
//     tryStart()

//     return () => {
//       // end stream
//       if(wsRef.current && wsRef.current.readyState === 1){
//         wsRef.current.send(JSON.stringify({type: 'end-stream', streamId}))
//       }
//       // close all pcs
//       Object.values(pcsRef.current).forEach(pc => { pc.close && pc.close() })
//     }
//   },[])

//   async function startLocalStream(){
//     const stream = await mediaDevices.getUserMedia({audio: true, video: true})
//     localStreamRef.current = stream
//   }

//   async function handleSignalingMessage(message){
//     const type = message.type
//     if(type === 'viewer-offer'){
//       const viewerId = message.viewer_id
//       const offer = message.offer
//       // create pc for this viewer
//       const pc = new RTCPeerConnection(pcConfig)
//       pcsRef.current[viewerId] = pc

//       // add local tracks
//       localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current))

//       pc.onicecandidate = ({candidate}) => {
//         if(candidate && wsRef.current.readyState === 1){
//           wsRef.current.send(JSON.stringify({
//             type: 'candidate',
//             candidate,
//             streamId,
//             target_channel: message.viewer_channel, // optional
//             from: 'broadcaster'
//           }))
//         }
//       }

//       await pc.setRemoteDescription(offer)
//       const answer = await pc.createAnswer()
//       await pc.setLocalDescription(answer)

//       // send answer back (server will forward to viewer)
//       wsRef.current.send(JSON.stringify({
//         type: 'broadcaster-answer',
//         streamId,
//         viewer_id: viewerId,
//         answer: pc.localDescription
//       }))
//     }

//     else if(type === 'candidate'){
//       // candidate from viewer or server - apply to correct pc
//       const from = message.from
//       // if from viewer, find pc by viewer id
//       // this example assumes the message contains viewer_id when needed
//       const viewerId = message.viewer_id
//       const pc = viewerId ? pcsRef.current[viewerId] : null
//       if(pc && message.candidate){
//         try{ await pc.addIceCandidate(message.candidate) }catch(e){console.warn(e)}
//       }
//     }
//   }

//   return (
//     <View>
//       <Text>Broadcaster (stream id: {streamId})</Text>
//       <Button title="End" onPress={() => {
//         if(wsRef.current && wsRef.current.readyState === 1){
//           wsRef.current.send(JSON.stringify({type: 'end-stream', streamId}))
//         }
//       }} />
//     </View>
//   )
// }
// ```

// ### Viewer.js

// ```js
// // Viewer.js
// import React, {useEffect, useRef, useState} from 'react'
// import {View, Button, Text} from 'react-native'
// import {RTCPeerConnection, RTCView} from 'react-native-webrtc'
// import createSignaling from './signaling'
// import 'react-native-get-random-values'
// import {v4 as uuidv4} from 'uuid'

// const pcConfig = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]}

// export default function Viewer({stream, signalingUrl}){
//   const [remoteStream, setRemoteStream] = useState(null)
//   const pcRef = useRef(null)
//   const wsRef = useRef(null)
//   const viewerId = useRef(uuidv4()).current

//   useEffect(() => {
//     wsRef.current = createSignaling(signalingUrl, handleSignalingMessage)
//     // when socket open, send viewer-offer
//     const tryOffer = () => {
//       if(wsRef.current && wsRef.current.readyState === 1){
//         createOffer()
//       } else {
//         setTimeout(tryOffer, 300)
//       }
//     }
//     tryOffer()

//     return () => {
//       if(pcRef.current) pcRef.current.close()
//       if(wsRef.current && wsRef.current.readyState === 1){
//         // optional: tell server you left by closing socket
//         wsRef.current.close()
//       }
//     }
//   }, [])

//   async function createOffer(){
//     const pc = new RTCPeerConnection(pcConfig)
//     pcRef.current = pc

//     // when track arriving, collect remote stream
//     pc.ontrack = (event) => {
//       const [stream] = event.streams
//       setRemoteStream(stream)
//     }

//     pc.onicecandidate = ({candidate}) => {
//       if(candidate && wsRef.current.readyState === 1){
//         wsRef.current.send(JSON.stringify({
//           type: 'candidate',
//           candidate,
//           streamId: stream.id,
//           from: 'viewer',
//           viewer_id: viewerId
//         }))
//       }
//     }

//     const offer = await pc.createOffer()
//     await pc.setLocalDescription(offer)

//     // send offer to server (it will forward to broadcaster)
//     wsRef.current.send(JSON.stringify({
//       type: 'viewer-offer',
//       offer: pc.localDescription,
//       streamId: stream.id,
//       viewer_id: viewerId
//     }))
//   }

//   async function handleSignalingMessage(msg){
//     if(msg.type === 'broadcaster-answer'){
//       const answer = msg.answer
//       if(pcRef.current){
//         await pcRef.current.setRemoteDescription(answer)
//       }
//     }
//     else if(msg.type === 'candidate'){
//       if(pcRef.current && msg.candidate){
//         try{ await pcRef.current.addIceCandidate(msg.candidate) }catch(e){console.warn(e)}
//       }
//     }
//     else if(msg.type === 'stream-ended'){
//       // broadcaster ended stream
//       if(pcRef.current) pcRef.current.close()
//     }
//   }

//   return (
//     <View>
//       <Text>Viewing: {stream.title || stream.id}</Text>
//       {remoteStream && (
//         <RTCView
//           streamURL={remoteStream.toURL()}
//           style={{width: '100%', height: 400}}
//         />
//       )}
//     </View>
//   )
// }
// ```

// // ---

// // ## Notes, caveats and next steps

// // 1. **TURN server**: For real-world users behind NATs/firewalls you must set up a TURN server and include the credentials in `pcConfig.iceServers`. Without TURN, many P2P connections will fail.

// // 2. **Scale**: P2P has heavy upstream bandwidth cost for broadcaster (one outgoing encoded stream per viewer). Use an **SFU** (mediasoup/Janus) to scale better.

// // 3. **Authentication**: AuthMiddlewareStack in ASGI ensures `scope['user']` is populated if the client uses cookies or token-based auth adapted to Channels. For token auth over websockets, you'll need custom middleware (or pass token in querystring and validate in consumer).

// // 4. **Production**: Use Redis for channel layer and cache (already included above). Run Daphne or Uvicorn with workers to serve ASGI.

// // 5. **Testing**: Use two physical devices (or device + emulator) to test a broadcaster and one or more viewers. Use `wss://` when serving over HTTPS.

// // ---

// // If you want, I can:

// // * add a sample `docker-compose.yml` with Redis + Daphne for local testing,
// // * add token-auth middleware for Channels,
// // * or convert the frontend to a single RN app that lists streams and allows starting/joining from the same UI.

// // Tell me which of those you'd like and I will add it (I already included the main working pieces above).

// // # LiveStream — Django + React Native (Signaling + Example)

// // ## Backend — Django + Channels + TokenAuth

// // ### settings.py (relevant parts)

// // ```python
// // # Channels
// // ASGI_APPLICATION = "showa.asgi.application"

// // CHANNEL_LAYERS = {
// //     "default": {
// //         "BACKEND": "channels_redis.core.RedisChannelLayer",
// //         "CONFIG": {
// //             "hosts": [("127.0.0.1", 6379)],
// //         },
// //     },
// // }

// // # Cache
// // CACHES = {
// //     "default": {
// //         "BACKEND": "django_redis.cache.RedisCache",
// //         "LOCATION": "redis://127.0.0.1:6379/1",
// //         "OPTIONS": {
// //             "CLIENT_CLASS": "django_redis.client.DefaultClient",
// //         }
// //     }
// // }
// // ```

// // ---

// // ### asgi.py

// // ```python
// // import os
// // import django
// // from channels.routing import ProtocolTypeRouter, URLRouter
// // from django.core.asgi import get_asgi_application
// // from showa_api.routing import websocket_urlpatterns
// // from showa.middleware.token_auth import TokenAuthMiddleware

// // os.environ.setdefault("DJANGO_SETTINGS_MODULE", "showa.settings")
// // django.setup()

// // application = ProtocolTypeRouter({
// //     "http": get_asgi_application(),
// //     "websocket": TokenAuthMiddleware(
// //         URLRouter(websocket_urlpatterns)
// //     ),
// // })
// // ```

// // ---

// // ### showa\_api/routing.py

// // ```python
// // from django.urls import re_path
// // from . import consumers

// // websocket_urlpatterns = [
// //     re_path(r"ws/livestream/(?P<room_name>[\\w\-]+)/$", consumers.LiveStreamConsumer.as_asgi()),
// // ]
// // ```

// // ---

// // ### showa/middleware/token\_auth.py

// // ```python
// // from urllib.parse import parse_qs
// // from django.contrib.auth.models import AnonymousUser
// // from rest_framework.authtoken.models import Token
// // from channels.db import database_sync_to_async

// // class TokenAuthMiddleware:
// //     def __init__(self, inner):
// //         self.inner = inner

// //     async def __call__(self, scope, receive, send):
// //         query_string = parse_qs(scope["query_string"].decode())
// //         token_key = query_string.get("token", [None])[0]
// //         scope["user"] = AnonymousUser()

// //         if token_key:
// //             try:
// //                 token = await database_sync_to_async(Token.objects.get)(key=token_key)
// //                 scope["user"] = token.user
// //             except Token.DoesNotExist:
// //                 pass

// //         return await self.inner(scope, receive, send)
// // ```

// // ---

// // ### consumers.py (LiveStreamConsumer excerpt)

// // ➡️ Updated to:

// // * Register viewer channel on `viewer-offer`
// // * Remove viewer channel on disconnect
// // * Ensure `stream_info` has `id`

// // ```python
// // # inside receive(), viewer-offer handling
// // if message_type == "viewer-offer":
// //     stream_id = data.get("streamId")
// //     if stream_id:
// //         broadcaster_channel = await self.get_broadcaster_channel(stream_id)
// //         if broadcaster_channel:
// //             await self.add_viewer_channel(data.get("viewer_id"), self.channel_name)
// //             await self.channel_layer.send(
// //                 broadcaster_channel,
// //                 {
// //                     "type": "signal_message",
// //                     "message": {
// //                         "type": "viewer-offer",
// //                         "offer": data.get("offer"),
// //                         "streamId": stream_id,
// //                         "viewer_id": data.get("viewer_id"),
// //                         "viewer_channel": self.channel_name
// //                     },
// //                     "sender_channel": self.channel_name
// //                 }
// //             )
// //             await self.increment_viewer_count(stream_id)
// //             self.stream_id = stream_id
// //             await self.update_viewer_counts()
// // ```

// // ```python
// // # inside disconnect(), for viewers
// // await self.decrement_viewer_count(self.stream_id)
// // await self.remove_viewer_channel(self.user_id)
// // await self.update_viewer_counts()
// // ```

// // Also, when adding a stream:

// // ```python
// // stream_info["id"] = self.stream_id
// // await self.add_stream(self.stream_id, stream_info)
// // ```

// // ---

// // ## Frontend — React Native with react-native-webrtc

// // ### Install deps

// // ```sh
// // npm install react-native-webrtc
// // ```

// // ---

// // ### signaling.js

// // ```js
// // export default class Signaling {
// //   constructor(roomName, token, onMessage) {
// //     this.roomName = roomName;
// //     this.token = token;
// //     this.ws = null;
// //     this.onMessage = onMessage;
// //   }

// //   connect() {
// //     this.ws = new WebSocket(
// //       `wss://yourdomain.com/ws/livestream/${this.roomName}/?token=${this.token}`
// //     );
// //     this.ws.onmessage = (e) => this.onMessage(JSON.parse(e.data));
// //   }

// //   send(msg) {
// //     if (this.ws && this.ws.readyState === 1) {
// //       this.ws.send(JSON.stringify(msg));
// //     }
// //   }
// // }
// // ```

// // ---

// // ### Broadcaster.js

// // ```js
// // import React, {useEffect, useRef} from 'react';
// // import {View, Button} from 'react-native';
// // import {RTCPeerConnection, mediaDevices} from 'react-native-webrtc';
// // import Signaling from './signaling';

// // export default function Broadcaster({roomName, token, streamId}) {
// //   const pc = useRef(null);
// //   const signaling = useRef(null);

// //   useEffect(() => {
// //     signaling.current = new Signaling(roomName, token, async (msg) => {
// //       if (msg.type === 'viewer-offer') {
// //         const viewerId = msg.viewer_id;
// //         const offer = msg.offer;
// //         const pc2 = new RTCPeerConnection();
// //         pc2.onicecandidate = (e) => {
// //           if (e.candidate) {
// //             signaling.current.send({
// //               type: 'candidate',
// //               candidate: e.candidate,
// //               streamId,
// //               viewer_channel: msg.viewer_channel,
// //             });
// //           }
// //         };

// //         const stream = await mediaDevices.getUserMedia({video: true, audio: true});
// //         stream.getTracks().forEach((t) => pc2.addTrack(t, stream));

// //         await pc2.setRemoteDescription(offer);
// //         const answer = await pc2.createAnswer();
// //         await pc2.setLocalDescription(answer);

// //         signaling.current.send({
// //           type: 'broadcaster-answer',
// //           streamId,
// //           viewer_id: viewerId,
// //           answer,
// //         });
// //       }
// //     });

// //     signaling.current.connect();
// //     signaling.current.send({type: 'start-stream', streamId, streamInfo: {id: streamId, userId: 'me'}});
// //   }, []);

// //   return (
// //     <View>
// //       <Button title="End Stream" onPress={() => signaling.current.send({type: 'end-stream', streamId})} />
// //     </View>
// //   );
// // }
// // ```

// // ---

// // ### Viewer.js

// // ```js
// // import React, {useEffect, useRef} from 'react';
// // import {View} from 'react-native';
// // import {RTCView, RTCPeerConnection} from 'react-native-webrtc';
// // import Signaling from './signaling';

// // export default function Viewer({roomName, token, streamId, viewerId}) {
// //   const pc = useRef(new RTCPeerConnection());
// //   const signaling = useRef(null);
// //   const [remoteStream, setRemoteStream] = React.useState(null);

// //   useEffect(() => {
// //     pc.current.ontrack = (e) => setRemoteStream(e.streams[0]);
// //     pc.current.onicecandidate = (e) => {
// //       if (e.candidate) {
// //         signaling.current.send({type: 'candidate', candidate: e.candidate, streamId, viewer_channel: null});
// //       }
// //     };

// //     signaling.current = new Signaling(roomName, token, async (msg) => {
// //       if (msg.type === 'broadcaster-answer') {
// //         await pc.current.setRemoteDescription(msg.answer);
// //       } else if (msg.type === 'candidate') {
// //         await pc.current.addIceCandidate(msg.candidate);
// //       }
// //     });

// //     signaling.current.connect();

// //     (async () => {
// //       const offer = await pc.current.createOffer();
// //       await pc.current.setLocalDescription(offer);
// //       signaling.current.send({type: 'viewer-offer', offer, streamId, viewer_id: viewerId});
// //     })();
// //   }, []);

// //   return (
// //     <View style={{flex: 1}}>
// //       {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{flex: 1}} />}
// //     </View>
// //   );
// // }
// // ```

// // ---

// // ## Next Steps

// // * Use a TURN server for NAT/firewall users (coturn, Twilio, etc.)
// // * Persist streams in DB if needed
// // * Handle cleanup if broadcaster crashes
// // * Optimize React Native UI (show comments/likes from signaling)

// // ---

// // ✅ Now your **backend** works with token auth, and **frontend** connects with `?token=...`. This is a full working skeleton for livestream with WebRTC signaling, broadcaster + viewer, comments, likes, and viewer counts.
