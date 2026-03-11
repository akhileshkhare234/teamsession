/* eslint-disable react-hooks/exhaustive-deps */
import { messaging } from "components/firebase/firebase";
import { getToken, onMessage } from "firebase/messaging";
import React, { useEffect, useRef } from "react";
import httpClient from "services/network/httpClient";
import TeamSessionIcon from "../assets/drawer_icon.png";
import { useFcmToken } from "context/FcmTokenContext";



const NotificationSetup = () => {
  const { setFcmToken } = useFcmToken();
  const registeredTokenRef = useRef<string | null>(null);

  useEffect(() => {
        console.log("NotificationSetup component mounted");
        const enableNotifications = async () => {
            try {
                // Assuming you have a function to request notification permission
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    console.log("Notification permission granted");
                    
                    const token = await getToken(messaging, {
                        vapidKey: "BLxBaWkK2OSKzzFh52dnly__iet-q-nZr9La2Lu2Cir0hyWZmssff2T1ZTV3LJH2tC18jMwrml-fCzJu3SFz4FI", // Replace with your VAPID key
                        
                    });
                    if (token) {
                        console.log("FCM Token:", token);
                        // setFcmToken(token);

                        // Only register if not already registered
                        if (registeredTokenRef.current !== token) {
                          registeredTokenRef.current = token;
                          httpClient.post("/admin-tokens", {
                            token: token,
                          }).then((response:any) => {
                              if(response.success){
                                console.log("Token registered successfully:", response);
                                setFcmToken(response.value.id);
                              } else {
                                  console.error("Failed to register token:", response);
                              }
                          }).catch((error) => {
                              console.error("Error registering token:", error);
                          });
                        }
                    }
                } else {
                    console.log("Notification permission denied");
                }
            } catch (error) {
                console.error("Error requesting notification permission:", error);
            }
        }

        function showNotification(title:string, body:string) {
            const notification = new Notification(title, {
                body: body,
                icon: TeamSessionIcon,
            });
            notification.onclick = () => {
                window.focus();
            };
            notification.onclose = () => {
                console.log("Notification closed");
            };
        }

        enableNotifications();

        onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message:", payload);
      // alert(`${payload.notification?.title}: ${payload.notification?.body}`);
      showNotification(payload.notification?.title || "Notification", payload.notification?.body || "You have a new notification");
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Notification Setup</h1>
      <p className="text-gray-600">This page is under construction.</p>
      <p className="text-gray-600">Please check back later for updates.</p>
    </div>
  );
}

export default NotificationSetup;
