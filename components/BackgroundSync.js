import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncContacts } from "./SyncContact";
import { AppState } from "react-native";

let currentAppState = AppState.currentState;

export const startBackgroundContactSync = async () => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) return;

  try {
    const lastSyncTime = await AsyncStorage.getItem("lastContactSyncTime");
    const now = Date.now();

    // Run only if last sync > 24 hours or missing
    if (!lastSyncTime || now - parseInt(lastSyncTime) > 24 * 60 * 60 * 1000) {
      console.log("🔄 Running background contact sync...");

      const result = await syncContacts(token);

      if (result.success) {
        
        const storedData = {
          lastSync: new Date().toISOString(),
          total: result.totalContacts,
          synced: result.syncedContacts,
        };

        await AsyncStorage.setItem("lastContactSyncTime", now.toString());
        await AsyncStorage.setItem("contactSyncSummary", JSON.stringify(storedData));

        console.log(`✅ Contacts synced (${result.syncedContacts} found)`);
      } else {
        
      }
    } else {
     
    }
  } catch (err) {
    
  }
};

// Optional: auto-run sync when app returns to foreground
export const setupContactSyncListener = () => {
  AppState.addEventListener("change", (nextAppState) => {
    if (currentAppState.match(/inactive|background/) && nextAppState === "active") {
      startBackgroundContactSync();
    }
    currentAppState = nextAppState;
  });
};
