import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Spinner from "../components/ui/Spinner"

const ProtectedRoute = () => {
  const { isAuthenticated, initializing }
    = useSelector(s => s.auth)

  if (initializing) return <Spinner />

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />
}

export default ProtectedRoute