// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// export default class Signaling {
//   constructor(roomName, onMessage) {
//     this.roomName = roomName;
//     this.onMessage = onMessage;
//     this.ws = null;
//     this.queue = [];
//     this.isOpen = false;
//   }

//   async connect() {
//     const token = await AsyncStorage.getItem("userToken");

    
//     const SIGNALING_SERVER = Platform.OS === 'android' ? "wss://api.showapp.ng" : "wss://api.showapp.ng";
//     const url = `${SIGNALING_SERVER}/ws/livestream/${this.roomName}/?token=${token || ""}`;
//     console.log("WS URL:", url);

//     // this.ws = new WebSocket(url);
//     this.ws = new WebSocket(`${SIGNALING_SERVER}/ws/livestream/${this.roomName}/`);

//     this.ws.onopen = () => {
//       console.log("Connected to signaling server");
//       // Send authentication message
//       this.send({ type: "authenticate", token: token });
//       this.isOpen = true;

//     // this.ws.onopen = () => {
//     //   console.log("Connected to signaling server");
//     //   this.isOpen = true;
//     //   this.queue.forEach((msg) => this.ws.send(JSON.stringify(msg)));
//     //   this.queue = [];
//     };

    

//     this.ws.onmessage = (e) => {
//       try {
//         const msg = JSON.parse(e.data);
//         console.log("Signaling msg:", msg);

//         switch (msg.type) {
//           case "new-comment":
//             console.log("New comment:", msg.comment, "on stream", msg.streamId);
//             break;
//           case "new-like":
//             console.log("New like on stream", msg.streamId);
//             break;
//           case "viewer-count":
//             console.log("Viewer count update:", msg.count, "for stream", msg.streamId);
//             break;
//           case "broadcaster-info":
//             console.log("Broadcaster info:", msg.broadcaster);
//             break;
//           default:
//             break;
//         }

//         this.onMessage && this.onMessage(msg);
//       } catch (err) {
//         console.warn("Error parsing signaling msg:", err);
//       }
//     };

//     this.ws.onclose = (e) => {
//       console.log("❌ Signaling connection closed", e?.code, e?.reason);
//       this.isOpen = false;
//     };

//     this.ws.onerror = (err) => {
//       console.warn("WebSocket error", err);
//       this.isOpen = false;
//     };
//   }

//   send(msg) {
//     if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
//       this.ws.send(JSON.stringify(msg));
//     } else {
//       console.log("Queuing message");
//       this.queue.push(msg);
//     }
//   }

//   close() {
//     try {
//       this.ws && this.ws.close();
//     } catch {}
//     this.isOpen = false;
//   }
// }

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Signaling {
  constructor(roomName, onMessage) {
    this.roomName = roomName;
    this.onMessage = onMessage;
    this.ws = null;
    this.queue = [];
    this.isOpen = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
  }

  async connect() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      
      const SIGNALING_SERVER = "wss://api.showapp.ng";
      
  
      const url = `${SIGNALING_SERVER}/ws/livestream/${this.roomName}/?token=${encodeURIComponent(token || "")}`;
      console.log("WS URL:", url);
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("✅✅✅✅✅ Connected to signaling server");
        this.isOpen = true;
        this.reconnectAttempts = 0;
        
      
        this.queue.forEach((msg) => {
          try {
            this.ws.send(JSON.stringify(msg));
          } catch (e) {
            console.warn("Error sending queued message:", e);
          }
        });
        this.queue = [];
      };

      this.ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          console.log("Signaling msg:", msg);

          switch (msg.type) {
            case "new-comment":
              console.log("New comment on stream", msg.streamId);
              break;
            case "new-like":
              console.log("New like on stream", msg.streamId);
              break;
            case "viewer-count":
              console.log("Viewer count update:", msg.count, "for stream", msg.streamId);
              break;
            case "broadcaster-info":
              console.log(" Broadcaster info received");
              break;
            case "error":
              console.error("❌ Server error:", msg.message);
              break;
            default:
              break;
          }

          if (this.onMessage) {
            this.onMessage(msg);
          }
        } catch (err) {
          console.warn("Error parsing signaling msg:", err);
        }
      };

      this.ws.onclose = (e) => {
        console.log("❌ Signaling connection closed", e.code, e.reason || "No reason");
        this.isOpen = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
        }
      };

      this.ws.onerror = (err) => {
        console.warn("WebSocket error:", err);
      };

    } catch (error) {
      console.error("Failed to connect to signaling server:", error);
    }
  }

  send(msg) {
    if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(msg));
        console.log("📤 Sent message:", msg.type);
      } catch (e) {
        console.warn("Error sending message:", e);
        this.queue.push(msg);
      }
    } else {
      console.log("⏳ Queuing message (connection not ready):", msg.type);
      this.queue.push(msg);
    }
  }

  close() {
    console.log("Closing signaling connection...");
    this.maxReconnectAttempts = 0; // Prevent reconnection
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        console.warn("Error closing websocket:", e);
      }
    }
    this.isOpen = false;
  }
}


