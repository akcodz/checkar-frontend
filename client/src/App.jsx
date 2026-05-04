import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute   from "./routes/ProtectedRoute"
import PublicRoute      from "./routes/PublicRoute"
import { fetchCurrentUser } from "./features/auth/authSlice"
import DashboardLayout  from "./components/layout/DashboardLayout"
import HomePage           from "./pages/HomePage"
import RegisterPage       from "./pages/RegisterPage"
import LoginPage          from "./pages/LoginPage"
import DashboardPage      from "./pages/DashboardPage"
import MonitorsPage       from "./pages/MonitorsPage"
import MonitorDetailPage  from "./pages/MonitorDetailPage"
import AddMonitorPage     from "./pages/AddMonitorPage"
import IncidentsPage      from "./pages/IncidentsPage"
import IncidentDetailPage from "./pages/IncidentDetailPage"
import AlertsPage         from "./pages/AlertsPage"
import SettingsPage       from "./pages/SettingsPage"
import NotFoundPage       from "./pages/NotFoundPage"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <Routes>

      {/* ── PUBLIC ───────────────────────────── */}
      <Route path="/" element={<HomePage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      </Route>

      {/* ── PROTECTED + DASHBOARD LAYOUT ─────── */}
      <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardLayout />}>

        {/* /dashboard → main overview */}
        <Route index element={<DashboardPage />} />

        {/* /dashboard/monitors → table list */}
        <Route path="monitors" element={<MonitorsPage />} />

        {/* /dashboard/monitors/new BEFORE /dashboard/monitors/:id — order matters! */}
        <Route path="monitors/new" element={<AddMonitorPage />} />

        {/* /dashboard/monitors/:id → detail + charts */}
        <Route path="monitors/:id" element={<MonitorDetailPage />} />

        {/* /dashboard/monitors/:id/edit → edit monitor */}
        <Route path="monitors/:id/edit" element={<AddMonitorPage />} />

        {/* /dashboard/incidents */}
        <Route path="incidents" element={<IncidentsPage />} />

        {/* /dashboard/incidents/:id → incident detail */}
        <Route path="incidents/:id" element={<IncidentDetailPage />} />

        {/* /dashboard/alerts */}
        <Route path="alerts" element={<AlertsPage />} />

        {/* /dashboard/settings */}
        <Route path="settings" element={<SettingsPage />} />

      </Route>
      </Route>

      <Route path="/monitors" element={<Navigate to="/dashboard/monitors" replace />} />
      <Route path="/monitors/new" element={<Navigate to="/dashboard/monitors/new" replace />} />
      <Route path="/monitors/:id" element={<Navigate to="/dashboard/monitors/:id" replace />} />

      {/* ── FALLBACK ─────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App