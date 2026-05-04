import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Spinner from "../components/ui/Spinner"

const PublicRoute = () => {
  const { isAuthenticated, initializing }
    = useSelector(s => s.auth)

  if (initializing) return <Spinner />

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />
}

export default PublicRoute