import { useEffect } from "react";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useCall } from "./CallContext";

export default function CallOverlayController() {
  const { incomingCall } = useCall();
  const navigation = useNavigation();

  // Protect against undefined state
  const top = useNavigationState((state) => {
    if (!state || !state.routes || state.routes.length === 0) {
      return null;
    }
    return state.routes[state.routes.length - 1]?.name ?? null;
  });

  useEffect(() => {
    if (incomingCall && top && top !== "CallOverlay") {
      navigation.navigate("CallOverlay");
    } else if (!incomingCall && top === "CallOverlay") {
      navigation.goBack();
    }
  }, [incomingCall, top, navigation]);

  return null;
}
