// src/components/Sidebar.jsx
import { useState } from "react"
import { NavLink, useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RiMenuLine, RiCloseLine } from "@remixicon/react"

const navItems = [
  { label: "Overview", to: "/dashboard" },
  { label: "Monitors", to: "/dashboard/monitors" },
  { label: "Incidents", to: "/dashboard/incidents" },
  { label: "Alerts", to: "/dashboard/alerts" },
  { label: "Settings", to: "/dashboard/settings" },
]

const Sidebar = ({ isOpen, onClose }) => {
  const unreadCount = useSelector((state) => state.alerts.unreadCount ?? 0)
  const navigate = useNavigate()

  // Navigation content (reused for both mobile and desktop)
  const NavContent = ({ isMobile = false }) => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={isMobile ? onClose : undefined}>
          <img src='/logo.png' alt='Checker Logo' className="h-10 w-auto group-hover:opacity-90 transition-opacity" />
        </Link>
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary transition"
            aria-label="Close menu"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-10 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-card border-l-2 px-4 py-3 text-sm transition ${
                isActive
                  ? "border-primary bg-bg-elevated text-text-primary"
                  : "border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              }`
            }
          >
            <span>{item.label}</span>
            {item.label === "Alerts" && unreadCount > 0 && (
              <span className="rounded-btn bg-primary px-2 py-0.5 text-[10px] font-mono text-text-inverse">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* CTA Button */}
      <div className="mt-auto space-y-4">
        <button
          type="button"
          onClick={() => {
            navigate("/dashboard/monitors/new")
            if (isMobile) onClose()
          }}
          className="w-full rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-4 py-3 text-sm font-semibold text-text-inverse shadow-glow-orange/20"
        >
          New Monitor
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar - Always Visible on lg+ */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-40 w-70 min-h-screen shrink-0 border-r border-bg-border bg-bg-base px-5 py-6 text-text-primary flex-col">
        <NavContent />
      </aside>

      {/* Mobile Sidebar - Slide-in Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Sidebar Panel */}
        <aside className="relative w-70 min-h-screen bg-bg-base border-r border-bg-border px-5 py-6 text-text-primary flex flex-col">
          <NavContent isMobile />
        </aside>
      </div>
    </>
  )
}

export default Sidebar