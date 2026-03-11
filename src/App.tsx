import React, { useEffect, useState } from "react";
import Routers from "./routes/Routers";
import { AppContext } from "./context/AppContext";
import ToastNotification from "./components/Toaster";
import { ThemeProvider } from "context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { FcmTokenProvider } from "context/FcmTokenContext";
// import NotificationService from "services/Notification/NotificationService";
export const useDarkMode = () => {
  // console.log("useDarkMode");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDarkMode;
};

export default function App() {
  const isDarkMode = useDarkMode();

  useEffect(() => {
    // Add or remove the "dark" class on the <body> element
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Suppress console logs in production
  if (process.env.NODE_ENV === "production") {
    if (console) {
      console.log = function () {};
      console.error = function () {};
      console.warn = function () {};
    }
  }

  // Check and request permission on app load
  useEffect(() => {
    // Initialize notification service on app load
    // NotificationService.initialize();
  }, []);


  

  return (
    <ThemeProvider>
    <FcmTokenProvider>
        <AppContext>
        <LanguageProvider>
          <ToastNotification />
          <Routers />
        </LanguageProvider>
      </AppContext>
    </FcmTokenProvider>
    </ThemeProvider>
  );
}
