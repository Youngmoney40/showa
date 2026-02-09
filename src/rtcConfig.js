
import { Platform } from "react-native";

export const rtcConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export async function getIceServers() {
  try {
    const res = await fetch("https://global.xirsys.net/_turn/Showa", {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ format: "urls" }),
    });
    const data = await res.json();

    let iceServers = [];
    if (data.v?.iceServers) {
      iceServers = data.v.iceServers;
    } else if (data.v?.urls) {
      iceServers = data.v.urls.map((url) => ({
        urls: url,
        username: data.v.username,
        credential: data.v.credential,
      }));
    }

    rtcConfig.iceServers = iceServers.length
      ? iceServers
      : [{ urls: "stun:stun.l.google.com:19302" }];

    console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
  } catch (err) {
    console.error("[Xirsys] Failed to fetch ICE servers:", err);
    rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
  }
}
