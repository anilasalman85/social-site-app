import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);

  // If no token → redirect to login
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
