/* eslint-disable  no-undef,no-restricted-globals*/

// importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js",
);
console.log("p1 =>");
// Initialize Firebase app with your config
const firebaseConfig = {
  apiKey: "AIzaSyCNh1OGZVYjQ03RxnSjKKgV0yjwecW3ZvU",
  authDomain: "eztext-22195.firebaseapp.com",
  projectId: "eztext-22195",
  storageBucket: "eztext-22195.firebasestorage.app",
  messagingSenderId: "923114386263",
  appId: "1:923114386263:web:09e216ce788f8c55d50412",
};

firebase.initializeApp(firebaseConfig);

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/firebase-logo.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
