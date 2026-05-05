// src/components/TopBar.jsx
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { clearUser, logoutUser } from "../../features/auth/authSlice"
import { fetchAlerts } from "../../features/alerts/alertsSlice"
import toast from "react-hot-toast"
import { RiMenuLine, RiNotificationLine, RiLogoutBoxLine, RiSettings4Line } from "@remixicon/react"

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const TopBar = ({ onMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const user = useSelector((state) => state.auth.user)
  const alerts = useSelector((state) => state.alerts.alerts)
  const unreadCount = useSelector((state) => state.alerts.unreadCount)
  
  const notificationsRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    dispatch(fetchAlerts())
  }, [dispatch])

  // User info formatting
  const firstName = user?.name?.firstName ?? user?.firstName ?? ""
  const lastName = user?.name?.lastName ?? user?.lastName ?? ""
  const fallbackName = user?.email ? user.email.split("@")[0] : "User"
  const fullName = `${firstName} ${lastName}`.trim() || fallbackName
  const initials = (firstName?.[0] ?? "") + (lastName?.[0] ?? "") || fallbackName.slice(0, 2).toUpperCase()
  const avatarUrl = user?.avatar || user?.picture || user?.photo || user?.image || ""

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
    } catch {
      // Ignore network/API failures
    } finally {
      dispatch(clearUser())
      setShowUserMenu(false)
      toast.success("Signed out successfully")
      navigate("/login", { replace: true })
    }
  }

  // Dynamic page title based on route
  const titleMap = {
    "/dashboard": "Overview",
    "/dashboard/monitors": "Monitors",
    "/dashboard/incidents": "Incidents",
    "/dashboard/alerts": "Alerts",
    "/dashboard/settings": "Settings",
  }
  const activeTitle =
    titleMap[location.pathname] ??
    (location.pathname.startsWith("/dashboard/monitors") ? "Monitors" : "Dashboard")

  return (
    <header className="flex items-center justify-between gap-4 border-b border-bg-border bg-bg-base px-4 py-3 lg:px-6 text-text-primary">
      
      {/* Left Section: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        
        {/* Mobile Menu Toggle - Visible only on mobile */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-card border border-bg-border bg-bg-base text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
          aria-label="Open menu"
        >
          <RiMenuLine className="w-5 h-5" />
        </button>
        
        {/* Page Title */}
        <div className="text-lg font-semibold text-text-primary truncate lg:text-xl">
          {activeTitle}
        </div>
      </div>

      {/* Right Section: Notifications + User Menu */}
      <div className="flex items-center gap-2 text-text-secondary">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev)
              setShowUserMenu(false)
            }}
            className="relative rounded-card border border-bg-border bg-bg-base p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <RiNotificationLine className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-btn bg-primary text-[10px] font-bold text-text-inverse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 z-50 mt-2 w-64 rounded-card border border-bg-border bg-bg-base p-3 shadow-lg sm:w-80">
              <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">
                Notifications {unreadCount > 0 && `(${unreadCount} new)`}
              </p>
              <div className="max-h-80 space-y-2 overflow-y-auto hide-scrollbar">
                {alerts.length ? (
                  alerts.slice(0, 5).map((item) => (
                    <div 
                      key={item._id} 
                      className={`rounded-card border p-2 transition ${
                        item.isRead 
                          ? "border-bg-border bg-bg-base" 
                          : "border-primary/40 bg-primary/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                        {!item.isRead && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">{item.message}</p>
                      <p className="mt-1 text-[11px] text-text-muted">{timeAgo(item.timestamp)}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-text-muted">No notifications yet</p>
                )}
              </div>
              {alerts.length > 5 && (
                <button
                  type="button"
                  onClick={() => { 
                    navigate("/dashboard/alerts")
                    setShowNotifications(false) 
                  }}
                  className="mt-2 w-full rounded-btn py-2 text-center text-xs font-mono uppercase tracking-widest text-primary hover:bg-bg-elevated transition"
                >
                  View all alerts
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setShowUserMenu((prev) => !prev)
              setShowNotifications(false)
            }}
            className="h-9 w-9 overflow-hidden rounded-full border border-bg-border bg-bg-base flex items-center justify-center text-text-primary hover:bg-bg-elevated transition"
            aria-label="Open user menu"
            aria-expanded={showUserMenu}
          >
            {avatarUrl ? (
              <img alt="Profile" src={avatarUrl} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-semibold">
                {initials.toUpperCase()}
              </span>
            )}
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-card border border-bg-border bg-bg-base p-3 shadow-lg">
              <p className="truncate text-sm font-medium text-text-primary">{fullName}</p>
              <p className="truncate text-xs text-text-muted">{user?.email || "No email"}</p>
              
              <div className="mt-3 border-t border-bg-border pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/dashboard/settings")
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-2 rounded-btn px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
                >
                  <RiSettings4Line className="w-4 h-4" />
                  Profile settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-btn px-3 py-2 text-left text-sm text-status-error hover:bg-status-error/10 transition"
                >
                  <RiLogoutBoxLine className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar