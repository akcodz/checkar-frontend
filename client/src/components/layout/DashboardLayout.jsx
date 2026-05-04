// src/layouts/DashboardLayout.jsx
import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* TopBar with toggle handler */}
      <TopBar onMenuToggle={() => setSidebarOpen(true)} />
      
      {/* Main Content */}
      <main className="lg:ml-70 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout