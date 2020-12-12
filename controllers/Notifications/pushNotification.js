import PushNotification from "react-native-push-notification";

export const callNotification = (channelName, storeName) => {
	PushNotification.localNotification({
  /* Android Only Properties */
  vibrate: true, // (optional) default: true
  vibration: 20000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  tag: `${channelName}`, // (optional) add tag to message
  ongoing: true, // (optional) set whether this is an "ongoing" notification
  //invokeApp: false,
  timeoutAfter: 15000,
  priority: "high", // (optional) set notification priority, default: high
  messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
  soundName: "ringtone.mp3",
  actions: ["Accept", "Decline"], // (Android only) See the doc for notification actions to know more
 
  /* iOS and Android properties */
  id: 786,
  title: "Incoming Video call", // (optional)
  message: `Incoming Video Call from ${storeName}`, // (required)
});
}

export const missedNotification = () => {
	PushNotification.localNotification({
  /* Android Only Properties */
  vibrate: true, // (optional) default: true
  vibration: 1000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  priority: "high", // (optional) set notification priority, default: high
  messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
 
  /* iOS and Android properties */
  title: "Missed Video call", // (optional)
  message: "You Missed a Video Call", // (required)
});
}

export const ongoingCall = (channelName) => {
	PushNotification.localNotification({
  priority: "high", 
  messageId: "google:message_id",
  ongoing: true,
  
  //actions: ["Leave Call"],
 
  title: "Ongoing Video Call", 
  message: `Ongoing Video Call on Channel ${channelName}`,
});
}