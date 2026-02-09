import { useEffect, useRef, useState } from "react";
import { useCall } from "./CallContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CallSignalListener() {
  const { showIncomingCall } = useCall();
  const wsRef = useRef(null);

  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = await AsyncStorage.getItem("userData");
        if (uid) {
          const parsed = JSON.parse(uid);
          //console.log("parsed userData:", parsed);

          // If your object looks like { id: "123", name: "John" }
          const id = parsed.id || parsed.userId || parsed; 
          //console.log("current_user_id", id);

          setUserId(id);
        }
      } catch (err) {
        //console.log("Error loading userData:", err);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) return; 

    const url = `wss://showa.essential.com.ng/ws/call/${userId}/`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "offer") {
          showIncomingCall(msg); 
        }
      } catch {}
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [userId, showIncomingCall]);

  return null;
}
