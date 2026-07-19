
// import { Platform } from "react-native";

// export const rtcConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// export async function getIceServers() {
//   try {
//     const res = await fetch("https://global.xirsys.net/_turn/Showa", {
//       method: "PUT",
//       headers: {
//         Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ format: "urls" }),
//     });
//     const data = await res.json();

//     let iceServers = [];
//     if (data.v?.iceServers) {
//       iceServers = data.v.iceServers;
//     } else if (data.v?.urls) {
//       iceServers = data.v.urls.map((url) => ({
//         urls: url,
//         username: data.v.username,
//         credential: data.v.credential,
//       }));
//     }

//     rtcConfig.iceServers = iceServers.length
//       ? iceServers
//       : [{ urls: "stun:stun.l.google.com:19302" }];

//     console.log("[Xirsys] ICE servers ready:", rtcConfig.iceServers);
//   } catch (err) {
//     console.error("[Xirsys] Failed to fetch ICE servers:", err);
//     rtcConfig.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
//   }
// }

// rtcConfig.js


import { Platform } from "react-native";

export const rtcConfig = { 
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  iceTransportPolicy: "all",
  iceCandidatePoolSize: 2,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require"
};

export async function getIceServers() {
  try {
    console.log("[Xirsys] Fetching ICE servers...");

    const res = await fetch("https://global.xirsys.net/_turn/Showa", {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa("essential:95aca53e-7c66-11f0-acf8-4662eff0c0a9"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        format: "urls"
      }),
    });

    if (!res.ok) {
      throw new Error(`Xirsys API returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("[Xirsys] Raw response:", JSON.stringify(data, null, 2));

    let iceServers = [];
    
    // Handle the actual Xirsys response format
    if (data?.v?.iceServers) {
      const server = data.v.iceServers;
      
      // Check if iceServers is an object with urls array (your case)
      if (server.urls && Array.isArray(server.urls)) {
        console.log("[Xirsys] Found ICE server object with URLs:", server.urls.length);
        
        iceServers.push({
          urls: server.urls,
          username: server.username || "",
          credential: server.credential || "",
          credentialType: "password"
        });
        
        console.log("[Xirsys] Added TURN/STUN server:", {
          urls: server.urls,
          username: server.username ? "***" : "missing",
          credential: server.credential ? "***" : "missing"
        });
      }
      // Check if iceServers is an array of server objects
      else if (Array.isArray(server)) {
        console.log("[Xirsys] Found ICE servers array:", server.length);
        server.forEach(s => {
          iceServers.push(s);
        });
      }
    } 
    // Handle alternative format
    else if (data?.v?.urls) {
      const urls = Array.isArray(data.v.urls) ? data.v.urls : [data.v.urls];
      console.log("[Xirsys] Found URLs array:", urls.length);
      
      const turnUrls = urls.filter(u => u.startsWith("turn:") || u.startsWith("turns:"));
      const stunUrls = urls.filter(u => u.startsWith("stun:"));
      
      if (turnUrls.length > 0 && data.v.username && data.v.credential) {
        iceServers.push({
          urls: turnUrls,
          username: data.v.username,
          credential: data.v.credential,
          credentialType: "password"
        });
      }
      
      stunUrls.forEach(url => {
        iceServers.push({ urls: url });
      });
    }

    // Add Google STUN servers as fallback
    iceServers.push(
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    );

    if (!iceServers.length) {
      console.warn("[Xirsys] No ICE servers configured, using Google STUN only");
      iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ];
    }

    // Update the exported config
    rtcConfig.iceServers = iceServers;
    rtcConfig.iceTransportPolicy = "all";
    rtcConfig.iceCandidatePoolSize = 2;
    
    console.log("[Xirsys] Final ICE config:", JSON.stringify({
      serverCount: iceServers.length,
      iceTransportPolicy: rtcConfig.iceTransportPolicy,
      servers: iceServers.map(server => ({
        urls: server.urls,
        hasCredentials: !!(server.username && server.credential)
      }))
    }, null, 2));

    return iceServers;
    
  } catch (err) {
    console.error("[Xirsys] Failed to fetch ICE servers:", err?.message || err);
    
    // Fallback to Google STUN servers
    rtcConfig.iceServers = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" }
    ];
    
    rtcConfig.iceTransportPolicy = "all";
    
    console.warn("[Xirsys] Using Google STUN servers as fallback only");
    return rtcConfig.iceServers;
  }
}
