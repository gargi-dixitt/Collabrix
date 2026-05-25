import { Navigate } from "react-router-dom";\nexport default function ProtectedRoute({ children, authenticated }) { return authenticated ? children : <Navigate to="/login" />; }
