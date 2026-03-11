// // PrivateRoute.tsx
// import { Navigate, Outlet } from "react-router-dom";
// import DefaultLayout from "../layouts/DefaultLayout";
// import authManager from "../services/auth/AuthManager";
// import React from "react";

// interface PrivateRouteProps {
//   Layout: any;
// }

// const PrivateRoute = ({ Layout = DefaultLayout }: PrivateRouteProps) => {
//   if (authManager.isLoggedIn()) {
//     return (
//       <>
//         <Layout>
//           <Outlet />
//         </Layout>
//       </>
//     );
//   } else {
//     return <Navigate to="/login" replace={true} />;
//   }
// };

// export default PrivateRoute;

// src/components/ProtectedRoute.tsx

// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import React from "react";
// PrivateRoute.tsx

interface PrivateRouteProps {
  Layout?: React.ComponentType<{ children: React.ReactNode }>;
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ Layout, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return Layout ? (
    <Layout>{children || <Outlet />}</Layout>
  ) : (
    <>{children || <Outlet />}</>
  );
};

export default PrivateRoute;
