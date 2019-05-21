import PushNotification from "react-native-push-notification";

export default class NotificationService {
  private lastId: number;

  constructor(onRegister: Function, onNotification: Function) {
    this.configure(onRegister, onNotification);

    this.lastId = 0;
  }

  configure(onRegister: any, onNotification: any, gcm = "") {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: onRegister, //this._onRegister.bind(this),

      // (required) Called when a remote or local notification is opened or received
      onNotification: onNotification, //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: gcm,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  }

  localNotif() {
    this.lastId++;
    PushNotification.localNotification({
      /* iOS only properties */
      alertAction: "view", // (optional) default: view
      category: null, // (optional) default: null
      userInfo: null, // (optional) default: null (object containing additional notification data)

      /* iOS and Android properties */
      title: "Local Notification", // (optional)
      message: "My Notification Message", // (required)
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: "10", // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      actions: '["Yes", "No"]' // (Android only) See the doc for notification actions to know more
    });
  }

  checkPermission(cbk: any) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({ id: "" + this.lastId });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
