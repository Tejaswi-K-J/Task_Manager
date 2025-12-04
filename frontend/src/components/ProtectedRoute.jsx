import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const stored = localStorage.getItem("user");
  const token = stored ? JSON.parse(stored).token : null;

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists → allow access
  return children;
}
