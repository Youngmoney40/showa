import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RTCPeerConnection, mediaDevices, RTCView } from "react-native-webrtc";
import Icon from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import InCallManager from "react-native-incall-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Signaling from "./signaling";
import { rtcConfig, getIceServers } from "./rtcConfig";
import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";

const { width, height } = Dimensions.get("window");

export default function Broadcaster({ route, navigation }) {
  const { roomName, streamId } = route.params;

  // Refs
  const signaling = useRef(null);
  const localStream = useRef(null);
  const peerConnections = useRef({});
  const likeAnimation = useRef(new Animated.Value(0)).current;
  const [localStreamState, setLocalStreamState] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [broadcasterData, setBroadcasterData] = useState({ name: "", profileImage: "" });




const sendBroadcasterLiveData = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    await fetch(`${API_ROUTE}/live-streams/start/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify({
        stream_id: streamId,
        title: "My Live Stream",
      }),
    });
    console.log("[Broadcaster] Live data sent to backend");
  } catch (err) {
    console.warn("[Broadcaster] Failed to send live data", err);
  }
};

//  const endStream = () => {
//     signaling.current?.send({ type: "end-stream", streamId });
//     InCallManager.stop();
//     navigation.goBack();
//   };


const endStream = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(`${API_ROUTE}/live-streams/end/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        stream_id: streamId, 
      }),
    });

    
      navigation.goBack()
      
      
    

    if (!response.ok) {
      const errorData = await response.json();
      //console.warn("[Broadcaster] Backend error:", errorData);
      return;
    }

    InCallManager.stop();
    navigation.goBack();

   // console.log("[Broadcaster] Live stream ended and deleted successfully.");
  } catch (err) {
    //console.warn("[Broadcaster] Failed to end live stream:", err);
  }
};




  // Fetch broadcaster data from AsyncStorage
  useEffect(() => {
  const fetchBroadcasterData = async () => {
    console.log("Fetching broadcaster ddata...");
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const broadcaster = {
          name: parsedData.name || "Broadcaster",
          profileImage: parsedData.profile_picture || "",
        };
        console.log('broadcastereee', userData);
        setBroadcasterData(broadcaster);

        // Send broadcaster info to signaling for viewers
        signaling.current?.send({
          type: "broadcaster-info",
          streamId,
          broadcaster,
        });

        // ✅ Send broadcaster live info to backend
        await sendBroadcasterLiveData(broadcaster);
      }
    } catch (err) {
      console.warn("Error fetching broadcaster data:", err);
    }
  };

  fetchBroadcasterData();
}, []);


  // Heart animation function
  const createHeartAnimation = () => {
    const heartId = Date.now().toString();
    const heartPositions = [
      { x: width * 0.3, y: height },
      { x: width * 0.5, y: height },
      { x: width * 0.7, y: height },
      { x: width * 0.4, y: height },
      { x: width * 0.6, y: height },
    ];

    const newHearts = heartPositions.map((position, index) => ({
      id: `${heartId}-${index}`,
      position,
      scale: new Animated.Value(0),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    newHearts.forEach((heart, index) => {
      const randomX = (Math.random() - 0.5) * 100;
      const randomDelay = index * 100;

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(heart.scale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(heart.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(heart.translateY, {
              toValue: -height * 0.7,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(heart.translateX, {
              toValue: randomX,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(heart.opacity, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setHearts((prev) => prev.filter((h) => h.id !== heart.id));
        });
      }, randomDelay);
    });
  };

  // Like counter animation
  const animateLikeCounter = () => {
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Callback for signaling messages
  const onSignalingMessage = async (msg) => {
    if (!msg || !msg.type) return;

    if (msg.type === "viewer-count") {
      setViewerCount(msg.count);
    } else if (msg.type === "comment") {
      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: msg.text,
          viewerId: msg.viewer_id,
          viewerName: msg.viewerName || "Anonymous",
          viewerProfileImage: msg.viewerProfileImage || "",
          timestamp: new Date(),
        },
      ]);
    } else if (msg.type === "like") {
      setLikes((prev) => prev + 1);
      animateLikeCounter();
      createHeartAnimation();
    }

    if (msg.type === "viewer-offer") {
      const viewerId = msg.viewer_id;
      let pc = peerConnections.current[viewerId];
      if (!pc) {
        pc = new RTCPeerConnection(rtcConfig);
        peerConnections.current[viewerId] = pc;

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            signaling.current.send({
              type: "candidate",
              candidate: e.candidate,
              streamId,
              viewer_id: viewerId,
            });
          }
        };

        if (localStream.current) {
          localStream.current.getTracks().forEach((t) => pc.addTrack(t, localStream.current));
        }
      }

      if (!pc.remoteDescription) {
        await pc.setRemoteDescription(msg.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        signaling.current.send({
          type: "broadcaster-answer",
          streamId,
          viewer_id: viewerId,
          answer,
        });
      }
    } else if (msg.type === "candidate" && msg.viewer_id) {
      const pc = peerConnections.current[msg.viewer_id];
      if (pc && msg.candidate) {
        try {
          await pc.addIceCandidate(msg.candidate);
        } catch (err) {
          console.warn("[Broadcaster] addIceCandidate error", err);
        }
      }
    }
  };

  // Initialize media and signaling
  useEffect(() => {
    let mounted = true;

    (async () => {
      await getIceServers();

      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: "user",
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStream.current = stream;
        setLocalStreamState(stream);

        InCallManager.start();
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setAudioMode("COMMUNICATION");
        InCallManager.setKeepScreenOn(true);
      } catch (err) {
        //console.warn("[Broadcaster] getUserMedia failed", err);
      }

      signaling.current = new Signaling(roomName, onSignalingMessage);
      await signaling.current.connect();

      signaling.current.send({
        type: "start-stream",
        streamId,
        streamInfo: { id: streamId },
      });
    })();

    return () => {
      mounted = false;
      signaling.current?.send({ type: "end-stream", streamId });
      signaling.current?.close();
      localStream.current?.getTracks().forEach((t) => t.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
      InCallManager.stop();
      InCallManager.setKeepScreenOn(false);
    };
  }, []);

  // Control functions
  const toggleMute = () => {
    if (localStream.current) {
      const newMuted = !isMuted;
      localStream.current.getAudioTracks().forEach((t) => (t.enabled = !newMuted));
      setIsMuted(newMuted);
    }
  };

  const switchCamera = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((t) => t._switchCamera && t._switchCamera());
      setIsFrontCamera(!isFrontCamera);
    }
  };

  const toggleSpeaker = () => {
    const newSpeakerState = !speakerOn;
    InCallManager.setSpeakerphoneOn(newSpeakerState);
    InCallManager.setForceSpeakerphoneOn(newSpeakerState);
    setSpeakerOn(newSpeakerState);
  };

 

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      {/* Video Stream */}
      {localStreamState ? (
        <RTCView
          streamURL={localStreamState.toURL()}
          style={styles.videoStream}
          objectFit="cover"
          mirror={isFrontCamera}
        />
      ) : (
        <View style={[styles.videoStream, styles.placeholder]}>
          <IconMaterial name="live-tv" size={60} color="#666" />
          <Text style={styles.placeholderText}>Starting stream...</Text>
        </View>
      )}

      {/* Floating Hearts Animation */}
      {hearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={[
            styles.heartContainer,
            {
              left: heart.position.x - 25,
              top: heart.position.y - 25,
              transform: [
                { scale: heart.scale },
                { translateY: heart.translateY },
                { translateX: heart.translateX },
              ],
              opacity: heart.opacity,
            },
          ]}
        >
          <Icon name="heart" size={50} color="#ff375f" />
        </Animated.View>
      ))}

      {/* Tap to show/hide controls */}
      <TouchableOpacity style={styles.tapArea} onPress={toggleControls} activeOpacity={1} />

      {/* Header Section */}
      {showControls && (
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={endStream}>
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.streamInfo}>
              {/* <View style={styles.broadcasterInfo}>
                {broadcasterData.profileImage ? (
                  <Image
                    source={{ uri: `${API_ROUTE_IMAGE}${broadcasterData.profileImage}` || broadcasterData.profileImage }}
                    style={styles.broadcasterImage}
                  />
                ) : (
                  <View style={styles.broadcasterImagePlaceholder}>
                    <Text style={styles.broadcasterInitial}>
                      {broadcasterData.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.broadcasterName}>{broadcasterData.name}</Text>
              </View> */}
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>You are LIVE</Text>
              </View>
              <Text style={styles.streamStats}>
                {viewerCount} viewers • {likes} likes
              </Text>
            </View>

            <View style={styles.space} />
          </View>
        </SafeAreaView>
      )}

      {/* Live Stats Floating Card */}
      {showControls && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="people" size={16} color="#fff" />
            <Text style={styles.statText}>{viewerCount}</Text>
          </View>
          <Animated.View
            style={[
              styles.statItem,
              {
                transform: [
                  {
                    scale: likeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="heart" size={16} color="#ff375f" />
            <Text style={[styles.statText, styles.likeCount]}>{likes}</Text>
          </Animated.View>
          <View style={styles.statItem}>
            <Icon name="chatbubble" size={16} color="#fff" />
            <Text style={styles.statText}>{comments.length}</Text>
          </View>
        </View>
      )}

      {/* Comments Sidebar */}
      {showControls && (
        <View style={styles.commentsContainer}>
          <FlatList
            data={comments.slice(-10)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentBubble}>
                <View style={styles.commentHeader}>
                  {item.viewerProfileImage ? (
                    <Image
                      source={{ uri: item.viewerProfileImage }}
                      style={styles.viewerImage}
                    />
                  ) : (
                    <View style={styles.viewerImagePlaceholder}>
                      <Text style={styles.viewerInitial}>
                        {item.viewerName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.viewerName}>{item.viewerName}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
              </View>
            )}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContent}
            showsVerticalScrollIndicator={false}
            inverted
          />
        </View>
      )}

      {/* Controls Bar */}
      {showControls && (
        <View style={styles.controlsBar}>
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endButton]}
            onPress={endStream}
          >
            <Icon name="close" size={24} color="#fff" />
            <Text style={styles.endButtonText}>End Stream</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton]} onPress={switchCamera}>
            <Icon name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, speakerOn && styles.controlButtonActive]}
            onPress={toggleSpeaker}
          >
            <Icon
              name={speakerOn ? "volume-high" : "volume-mute"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoStream: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  placeholderText: {
    color: "#666",
    marginTop: 10,
    fontSize: 16,
  },
  heartContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 1000,
    shadowColor: "#ff375f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  tapArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
   
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  streamInfo: {
    flex: 1,
    marginLeft: 15,
  },
  broadcasterInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  broadcasterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  broadcasterImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  broadcasterInitial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  broadcasterName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,0,0,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginRight: 6,
  },
  liveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  streamStats: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  space: {
    width: 40,
  },
  statsCard: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 30,
    padding: 12,
    zIndex: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  likeCount: {
    color: "#ff375f",
  },
  commentsContainer: {
    position: "absolute",
    left: 20,
    top: 100,
    bottom: 120,
    width: 280,
    borderRadius: 15,
    padding: 15,
    zIndex: 10,
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    paddingBottom: 10,
  },
  commentBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  viewerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  viewerImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  viewerInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewerName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  commentText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
  },
  commentTime: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    marginTop: 4,
  },
  controlsBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 50,
    padding: 15,
    zIndex: 10,
  },
  controlButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  controlButtonActive: {
    backgroundColor: "rgba(255,55,95,0.3)",
  },
  endButton: {
    backgroundColor: "#ff375f",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  endButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});







