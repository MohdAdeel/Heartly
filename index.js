/**
 * @format
 */

import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

if (Platform.OS === "android") {
  const messaging = require("@react-native-firebase/messaging").default;
  const notifee = require("@notifee/react-native").default;
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const hasNotificationPayload = !!remoteMessage?.notification;
    if (!hasNotificationPayload) {
      await notifee.displayNotification({
        title: remoteMessage?.data?.title || "Notification",
        body: remoteMessage?.data?.body || "You have a new update",
        android: {
          channelId: "high-priority",
          smallIcon: "ic_launcher",
          pressAction: { id: "default" },
        },
        data: remoteMessage?.data,
      });
    }
  });
}

AppRegistry.registerComponent(appName, () => App);
