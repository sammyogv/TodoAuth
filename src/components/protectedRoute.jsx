import { Navigate } from "react-router";
import { auth } from "../utilities/firebase";

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;
  return user ? children : <Navigate to="/login" replace />;
}
