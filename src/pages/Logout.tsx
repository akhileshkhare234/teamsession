// import { useEffect } from "react";
import { Navigate } from "react-router-dom";
// import authManager from "../services/auth/AuthManager";

// const Logout = () => {
//   useEffect(() => {
//     authManager.logout();
//   }, []);
//   return <Navigate to="/login" replace={true} />;
// };

// export default Logout;
// LogoutButton.tsx
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase/firebase";

// const Logout: React.FC = () => {
const Logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  return <Navigate to="/login" replace={true} />;
};

// return <button onClick={handleLogout}>Logout</button>;
// };

export default Logout;
