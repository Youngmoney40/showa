

// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default class Signaling {
//   constructor(roomName, onMessage) {
//     this.roomName = roomName;
//     this.onMessage = onMessage;
//     this.ws = null;
//     this.queue = [];
//     this.isOpen = false;
//     this.reconnectAttempts = 0;
//     this.maxReconnectAttempts = 3;
//   }

//   async connect() {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
      
//       const SIGNALING_SERVER = "ws://api.showapp.ng";
      
  
//       const url = `${SIGNALING_SERVER}/ws/livestream/${this.roomName}/?token=${encodeURIComponent(token || "")}`;
//       console.log("WS URL:", url);
//       this.ws = new WebSocket(url);

//       this.ws.onopen = () => {
//         console.log("✅✅✅✅✅ Connected to signaling server");
//         this.isOpen = true;
//         this.reconnectAttempts = 0;
        
      
//         this.queue.forEach((msg) => {
//           try {
//             this.ws.send(JSON.stringify(msg));
//           } catch (e) {
//             console.warn("Error sending queued message:", e);
//           }
//         });
//         this.queue = [];
//       };

//       this.ws.onmessage = (e) => {
//         try {
//           const msg = JSON.parse(e.data);
//           console.log("Signaling msg:", msg);

//           switch (msg.type) {
//             case "new-comment":
//               console.log("New comment on stream", msg.streamId);
//               break;
//             case "new-like":
//               console.log("New like on stream", msg.streamId);
//               break;
//             case "viewer-count":
//               console.log("Viewer count update:", msg.count, "for stream", msg.streamId);
//               break;
//             case "broadcaster-info":
//               console.log(" Broadcaster info received");
//               break;
//             case "error":
//               console.error("❌ Server error:", msg.message);
//               break;
//             default:
//               break;
//           }

//           if (this.onMessage) {
//             this.onMessage(msg);
//           }
//         } catch (err) {
//           console.warn("Error parsing signaling msg:", err);
//         }
//       };

//       this.ws.onclose = (e) => {
//         console.log("❌ Signaling connection closed", e.code, e.reason || "No reason");
//         this.isOpen = false;
        
//         if (this.reconnectAttempts < this.maxReconnectAttempts) {
//           this.reconnectAttempts++;
//           console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
//           setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
//         }
//       };

//       this.ws.onerror = (err) => {
//         console.warn("WebSocket error:", err);
//       };

//     } catch (error) {
//       console.error("Failed to connect to signaling server:", error);
//     }
//   }

//   send(msg) {
//     if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
//       try {
//         this.ws.send(JSON.stringify(msg));
//         console.log("📤 Sent message:", msg.type);
//       } catch (e) {
//         console.warn("Error sending message:", e);
//         this.queue.push(msg);
//       }
//     } else {
//       console.log("⏳ Queuing message (connection not ready):", msg.type);
//       this.queue.push(msg);
//     }
//   }

//   close() {
//     console.log("Closing signaling connection...");
//     this.maxReconnectAttempts = 0; // Prevent reconnection
//     if (this.ws) {
//       try {
//         this.ws.close();
//       } catch (e) {
//         console.warn("Error closing websocket:", e);
//       }
//     }
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
    this.isClosed = false; // Add flag to prevent reconnect after intentional close
  }

  async connect() {
    // Prevent connection if intentionally closed
    if (this.isClosed) {
      console.log("[Signaling] Connection prevented - signaling is closed");
      return;
    }

    try {
   
      if (this.ws) {
        try {
          this.ws.onopen = null;
          this.ws.onmessage = null;
          this.ws.onclose = null;
          this.ws.onerror = null;
          this.ws.close();
        } catch (e) {
          console.warn("[Signaling] Error closing existing ws:", e);
        }
        this.ws = null;
      }

      const token = await AsyncStorage.getItem("userToken");
      
      
      const SIGNALING_SERVER = "wss://api.showapp.ng"; 
      
      const url = `${SIGNALING_SERVER}/ws/livestream/${this.roomName}/?token=${encodeURIComponent(token || "")}`;
      console.log("[Signaling] Connecting to:", url);
      
      this.ws = new WebSocket(url);

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.error("[Signaling] Connection timeout");
          this.ws.close();
        }
      }, 10000);

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("[Signaling] ✅ Connected to signaling server");
        this.isOpen = true;
        this.reconnectAttempts = 0;
        
        // Send any queued messages
        if (this.queue.length > 0) {
          console.log(`[Signaling] Sending ${this.queue.length} queued messages`);
          const messagesToSend = [...this.queue];
          this.queue = [];
          messagesToSend.forEach((msg) => {
            this.send(msg);
          });
        }
      };

      this.ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          console.log("[Signaling] 📥 Received:", msg.type);

          if (this.onMessage) {
            this.onMessage(msg);
          }
        } catch (err) {
          console.warn("[Signaling] Error parsing message:", err);
        }
      };

      this.ws.onclose = (e) => {
        clearTimeout(connectionTimeout);
        console.log(`[Signaling] Connection closed - Code: ${e.code}, Reason: ${e.reason || "No reason"}`);
        this.isOpen = false;
        
        // Only reconnect if not intentionally closed and haven't exceeded attempts
        if (!this.isClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = 2000 * this.reconnectAttempts;
          console.log(`[Signaling] Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(), delay);
        } else if (this.isClosed) {
          console.log("[Signaling] Not reconnecting - intentionally closed");
        } else {
          console.log("[Signaling] Max reconnection attempts reached");
        }
      };

      this.ws.onerror = (err) => {
        clearTimeout(connectionTimeout);
        console.error("[Signaling] WebSocket error:", err.message || "Unknown error");
      };

    } catch (error) {
      console.error("[Signaling] Failed to connect:", error);
      
      // Retry connection if not intentionally closed
      if (!this.isClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = 2000 * this.reconnectAttempts;
        console.log(`[Signaling] Retrying connection in ${delay}ms`);
        setTimeout(() => this.connect(), delay);
      }
    }
  }

  send(msg) {
    if (this.isOpen && this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const messageStr = JSON.stringify(msg);
        this.ws.send(messageStr);
        console.log(`[Signaling] 📤 Sent: ${msg.type}`);
        return true;
      } catch (e) {
        console.warn("[Signaling] Error sending message:", e);
        this.queue.push(msg);
        return false;
      }
    } else {
      console.log(`[Signaling] ⏳ Queued: ${msg.type} (WS not ready)`);
      this.queue.push(msg);
      return false;
    }
  }

  close() {
    console.log("[Signaling] Closing connection...");
    this.isClosed = true; // Prevent reconnection
    this.maxReconnectAttempts = 0;
    
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
        
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close(1000, "Stream ended");
        }
      } catch (e) {
        console.warn("[Signaling] Error closing websocket:", e);
      }
      this.ws = null;
    }
    
    this.isOpen = false;
    this.queue = [];
    console.log("[Signaling] Connection closed");
  }
}


