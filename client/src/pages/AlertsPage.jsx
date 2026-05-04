// src/pages/AlertsPage.jsx
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAlerts, markAlertRead } from "../features/alerts/alertsSlice"

const LIMIT = 10

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Type badge styles using semantic palette
const typeStyles = {
  CRITICAL: { label: "CRITICAL", bg: "bg-status-error/10 text-status-error border border-status-error/30" },
  WARNING: { label: "WARNING", bg: "bg-status-warning/10 text-status-warning border border-status-warning/30" },
  PERFORMANCE_ANOMALY: { label: "ANOMALY", bg: "bg-status-ai/10 text-status-ai border border-status-ai/30" },
  INFO: { label: "INFO", bg: "bg-status-info/10 text-status-info border border-status-info/30" },
}

const AlertsPage = () => {
  const dispatch = useDispatch()
  const alerts = useSelector((state) => state.alerts.alerts)
  const loading = useSelector((state) => state.alerts.loading)
  const unreadCount = useSelector((state) => state.alerts.unreadCount)

  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchAlerts())
  }, [dispatch])

  const filtered = useMemo(() => {
    return alerts
      .filter((a) => activeFilter === "all" || a.type === activeFilter)
      .filter((a) =>
        (a.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.message || "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
  }, [alerts, activeFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT))
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, searchQuery])

  const typeKeys = [...new Set(alerts.map((a) => a.type))]

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Notifications</div>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">Alert Feed</h1>
            <p className="mt-2 text-sm text-text-secondary">All system notifications and alerts in one place.</p>
          </div>
          {unreadCount > 0 && (
            <div className="rounded-full bg-status-error/10 border border-status-error/30 px-4 py-2 text-sm font-mono text-status-error">
              {unreadCount} unread
            </div>
          )}
        </div>

        {/* Summary Cards - Unified Dark */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Total</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-text-primary">{alerts.length}</div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Unread</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-status-error">{unreadCount}</div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Read</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-status-success">{alerts.length - unreadCount}</div>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`rounded-btn px-3 py-2 text-xs font-mono uppercase tracking-widest transition ${
                activeFilter === "all"
                  ? "bg-primary text-text-inverse"
                  : "border border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40 hover:bg-bg-elevated"
              }`}
            >
              All
            </button>
            {typeKeys.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveFilter(type)}
                className={`rounded-btn px-3 py-2 text-xs font-mono uppercase tracking-widest transition ${
                  activeFilter === type
                    ? "bg-primary text-text-inverse"
                    : "border border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40 hover:bg-bg-elevated"
                }`}
              >
                {type?.replace(/_/g, " ") || type}
              </button>
            ))}
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-2 pl-10 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Alerts List - Scrollable Cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
            ))}
          </div>
        ) : paginated.length ? (
          <div className="space-y-3">
           {paginated.map((alert) => {
  const meta = typeStyles[alert.type] ?? { label: alert.type, bg: "bg-bg-elevated text-text-muted border border-bg-border" }

  return (
    <div
      key={alert._id}
      className={`rounded-card border p-4 transition ${
        alert.isRead 
          ? "border-bg-border bg-bg-base" 
          : "border-primary/40 bg-primary/5"
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-xs font-mono uppercase tracking-widest ${meta.bg}`}>
              {meta.label}
            </span>
            {!alert.isRead && (
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-text-primary break-words">{alert.title}</h3>
          
          {/* Auto-expanding container with hidden scrollbar */}
          <div className="max-h-48 overflow-y-auto hide-scrollbar">
            <p className="text-sm text-text-secondary leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>
        
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-xs text-text-muted whitespace-nowrap">{timeAgo(alert.timestamp)}</span>
          {!alert.isRead && (
            <button
              type="button"
              onClick={() => dispatch(markAlertRead(alert._id))}
              className="rounded-full border border-bg-border bg-bg-base px-3 py-1 text-xs text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition whitespace-nowrap"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  )
})}
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-card border border-bg-border bg-bg-base text-sm text-text-muted">
            No alerts found.
          </div>
        )}

        {/* Pagination - Unified Dark */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="rounded-full border border-bg-border bg-bg-base px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <div className="font-mono text-sm text-text-muted">
              {currentPage} / {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-full border border-bg-border bg-bg-base px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsPage