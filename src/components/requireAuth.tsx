import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { AuthContextItf } from "../utils/interfaces"
import { Loader } from "./Loader"

export const RequireAuth = () => {
    const { currentUser, loading } = useAuth() as AuthContextItf
    const location = useLocation()
    return (
      !loading ? (
        currentUser ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace />
      ) : (
        <Loader />
      )
  )
}
