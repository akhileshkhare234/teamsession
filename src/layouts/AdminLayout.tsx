/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { decodeToken } from "utility/JwtUtility";
import TeamSessionIcon from "../assets/drawer_icon.png";
// import LanguageSelector from "../components/LanguageSelector/LanguageSelector";
// import authManager from "services/auth/AuthManager";
import PillButton from "components/button/Pills";

import { signOut } from "firebase/auth";
import { auth } from "../components/firebase/firebase";
import { useTheme } from "../context/ThemeContext";
// Add theme toggle icon:
import {
  faBox,
  faFile,
  faMoon,
  faSackDollar,
  faSun,
  faMoneyBill,
  faMoneyBill1,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPowerOff, faUsers } from "@fortawesome/free-solid-svg-icons";
import AuthManager from "services/auth/AuthManager";
import httpClient from "services/network/httpClient";
import { useFcmToken } from "context/FcmTokenContext";

const AdminLayouts = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { fcmToken } = useFcmToken();
  console.log("FCM Token in AdminLayout:", fcmToken);

  const [user, setUser] = useState<any>("");
  console.log("AdminLayout Rendered", user);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
const [showNotification, setShowNotification] = useState<boolean>(false);
const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    setShowNotification(true);
     // trigger app refresh on ONLINE
    setRefreshKey(prev => prev + 1);
  };
  const handleOffline = () => {
    setIsOnline(false);
    setShowNotification(true);
     // trigger app refresh on OFFLINE
    setRefreshKey(prev => prev + 1);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);

useEffect(() => {
  if (showNotification && isOnline) {
    //  Auto-hide only for ONLINE
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [showNotification, isOnline]);
  

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AuthManager.getToken();

      // If no token exists, redirect to login
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const decodedUser = token ? decodeToken(token) : "";

        // Check if token is valid
        if (!decodedUser || !decodedUser.sub) {
          // Token is invalid
          AuthManager.clearToken();
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        }

        setUser(decodedUser);
        if (decodedUser?.sub) {
          localStorage.setItem("userName", decodedUser.email);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        AuthManager.clearToken();
        localStorage.clear();
        navigate("/login", { replace: true });
      }

      setLoading(false);
    };

    checkAuthentication();
  }, [navigate]);

  const store = localStorage.getItem("userName");
  // Show loading or redirect if not authenticated
  if (loading) return <div>Loading...</div>;
  console.log(store);
  // const fcmId = Number(fcmToken);
  const handleLogout = async () => {
    try {
      // const jwtToken = await AuthManager.getToken();
      await httpClient.delete(`/admin-tokens/delete/${fcmToken}`, 
    )
        .then((response: any) => {
          console.log("Token deleted successfully:", response);
        })
        .catch((error) => {
          console.error("Error deleting token:", error);
        });

      await signOut(auth);

      // localStorage.removeItem("accessToken");
      console.log("Logout Call");
      // Redirect to login page
      navigate("/login", { replace: true });
      
      // authManager.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    return navigate("/login", { replace: true });
    // authManager.logout();
  };

  const navLinks = [
    {
      url: "/admin/dashboard",
      label: t("button.Home"),
      icon: faHome,
    },
    {
      url: "/admin/employees",
      label: t("common.employees"),
      icon: faUsers,
    },
    {
      url: "/admin/catagory",
      label: "Categories",
      icon: faBox,
    },
    {
      url: "/admin/expenditure",
      label: "Expenditure",
      icon: faSackDollar,
    },
    {
      url: "/admin/emails",
      label: "Report Recipient",
      icon: faFile,
    },
    {
      url: "/admin/advancepayment",
      label: "Advance Payments",
      icon: faMoneyBill,
    },
    {
      url: "/admin/paymentConfig",
      label: "Payment Configuration",
      icon: faMoneyBill1,
    },
  ];

  return (
    
    <div  key={refreshKey} // refersh page Offline/Online
     className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F9F9F9] dark:bg-gray-800 dark:text-white shadow-md ">
        <div className=" font-bold text-lg  flex flex-row items-center  py-2 pr-14 ml-1 p-0.5 mb-8">
          <img
            src={TeamSessionIcon}
            alt="Team Session Icon"
            className="w-9 h-9 "
          />
          <span className="text-gray-800 dark:text-white ml-2">
            {" "}
            Team Session
          </span>
        </div>
        <nav>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li
                key={link.url}
                className={`flex items-center dark:hover:bg-[#444444] space-x-3 p-2 ${
                  location.pathname === link.url
                    ? "dark:bg-[#444444] bg-gray-100 border-l-2 border-black"
                    : ""
                }`}
              >
                <Link
                  to={link.url}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <FontAwesomeIcon icon={link.icon} className="" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1  flex flex-col  items-center bg-white dark:bg-gray-900 dark:text-white">
        <header className="w-full flex mt-1 justify-end items-center bg-white dark:bg-gray-900">
       {showNotification && (
  <div className="flex justify-center mt-2">
    <p
      className={`inline-flex items-center px-3 py-2 rounded-md text-lg font-semibold ${
        isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isOnline ? "Back online" : "You are offline"}
      <button
        onClick={() => setShowNotification(false)}
        className={`ml-3 font-bold ${
          isOnline ? "text-green-700 hover:text-green-900" : "text-red-700 hover:text-red-900"
        }`}
      >
        ✕
      </button>
    </p>
  </div>
)}
          <div className="flex items-center space-x-4 mr-10 text-base">
            {/* <LanguageSelector /> */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
            </button>
            <span className="text-[14px] font-normal">{store} </span>{" "}
            <button onClick={() => setShowLogoutConfirm(true)}>
              <FontAwesomeIcon icon={faPowerOff} className="w-4 h-4" />
            </button>
          </div>
        </header>
        <div className="flex flex-col w-full px-10 overflow-hidden dark:bg-gray-900 dark:text-white">
          {!loading ? <Outlet /> : <div>Loading...</div>}
        </div>
         
      </main>
      {showLogoutConfirm && (
        <div className="fixed inset-0  flex items-center justify-center bg-gray-400 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-green-500 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-lg font-semibold dark:text-white py-2">
              Are you sure you want to {t("logout")}?
            </h2>
            <div className="mt-4 flex justify-center space-x-6">
              <PillButton
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600"
              >
                {t("Logout")}
              </PillButton>
              <PillButton
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-3xl hover:bg-gray-400 hover:text-gray-900"
              >
                Cancel
              </PillButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
export default AdminLayouts;

