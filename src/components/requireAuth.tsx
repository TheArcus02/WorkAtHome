import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { AuthContextItf } from "../utils/interfaces"

export const requireAuth = () => {
    const { currentUser } = useAuth() as AuthContextItf
    const location = useLocation()

    return (
        currentUser ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace />
  )
}
