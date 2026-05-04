// src/pages/IncidentsPage.jsx
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchIncidents } from "../features/incidents/incidentsSlice"

// Type badge styles using semantic palette
const typeStyles = {
  CRITICAL_FAILURE: "bg-status-error/10 text-status-error border border-status-error/30",
  PERFORMANCE_ANOMALY: "bg-status-warning/10 text-status-warning border border-status-warning/30",
}

// Status badge styles using semantic palette
const statusStyles = {
  active: "bg-status-error/10 text-status-error border border-status-error/30",
  resolved: "bg-status-success/10 text-status-success border border-status-success/30",
}

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const IncidentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const incidents = useSelector((state) => state.incidents.incidents)
  const loading = useSelector((state) => state.incidents.loading)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    dispatch(fetchIncidents())
  }, [dispatch])

  const filtered = useMemo(() => {
    let list = incidents
    if (activeTab !== "all") {
      list = list.filter((i) => i.status === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (i) =>
          (i.type || "").toLowerCase().includes(q) ||
          (i.rawLogs?.message || "").toLowerCase().includes(q) ||
          (i.aiReport?.summary || "").toLowerCase().includes(q),
      )
    }
    return list
  }, [incidents, activeTab, searchQuery])

  const activeCount = incidents.filter((i) => i.status === "active").length
  const resolvedCount = incidents.filter((i) => i.status === "resolved").length

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header + Search + Tabs */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Incidents</div>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">Incident response</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Track outages, anomalies, and AI-generated postmortems.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input - Unified Dark */}
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents..."
                className="w-64 rounded-card border border-bg-border bg-bg-base px-4 py-2 pl-10 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            
            {/* Status Tabs - Unified Dark */}
            <div className="flex rounded-btn border border-bg-border bg-bg-base p-1">
              {[
                { key: "all", label: `All (${incidents.length})` },
                { key: "active", label: `Active (${activeCount})` },
                { key: "resolved", label: `Resolved (${resolvedCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-btn px-4 py-2 text-sm font-mono transition ${
                    activeTab === tab.key
                      ? "bg-primary text-text-inverse"
                      : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards - Unified Dark */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Total incidents</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-text-primary">{incidents.length}</div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Active</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-status-error">{activeCount}</div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Resolved</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-status-success">{resolvedCount}</div>
          </div>
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="space-y-4">
            {filtered.map((incident) => (
              <button
                key={incident._id}
                type="button"
                onClick={() => navigate(`/dashboard/incidents/${incident._id}`)}
                className="w-full rounded-card border border-bg-border bg-bg-base p-5 text-left transition hover:border-primary/50 hover:-translate-y-0.5 hover:bg-bg-elevated"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {/* Type + Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-mono uppercase tracking-widest ${typeStyles[incident.type] ?? typeStyles.PERFORMANCE_ANOMALY}`}>
                        {incident.type?.replace(/_/g, " ") || "incident"}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs font-mono uppercase tracking-widest ${statusStyles[incident.status] ?? statusStyles.active}`}>
                        {incident.status}
                      </span>
                    </div>

                    {/* AI Summary */}
                    {incident.aiReport?.summary && (
                      <p className="mt-3 text-sm text-text-secondary line-clamp-2">{incident.aiReport.summary}</p>
                    )}

                    {/* Metadata Row */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      {incident.rawLogs?.status && (
                        <span className="font-mono">HTTP {incident.rawLogs.status}</span>
                      )}
                      {incident.rawLogs?.latency && (
                        <span className="font-mono">{incident.rawLogs.latency}ms</span>
                      )}
                      {incident.rawLogs?.zScore && (
                        <span className="font-mono">z-score: {incident.rawLogs.zScore}</span>
                      )}
                      <span>•</span>
                      <span>{timeAgo(incident.createdAt)}</span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="shrink-0 text-right text-xs text-text-muted">
                    <div>{new Date(incident.createdAt).toLocaleDateString()}</div>
                    <div className="mt-1">{new Date(incident.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : activeTab === "active" ? (
          /* Empty State - All Systems Operational */
          <div className="flex min-h-60 flex-col items-center justify-center rounded-card border border-bg-border bg-bg-base text-center">
            <div className="text-4xl text-status-success">✓</div>
            <div className="mt-4 text-lg font-medium text-text-primary">No active incidents. All systems operational.</div>
          </div>
        ) : (
          /* Empty State - No Results */
          <div className="rounded-card border border-bg-border bg-bg-base p-6 text-sm text-text-muted text-center">
            No incidents match your filters.
          </div>
        )}
      </div>
    </div>
  )
}

export default IncidentsPage