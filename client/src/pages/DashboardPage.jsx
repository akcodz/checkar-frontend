// src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchJobs } from "../features/jobs/jobsSlice"

// Type badge styles using semantic palette
const typeStyles = {
  api: "bg-primary/10 text-primary border border-primary/30",
  server: "bg-status-info/10 text-status-info border border-status-info/30",
  ssl: "bg-status-warning/10 text-status-warning border border-status-warning/30",
  port: "bg-status-ai/10 text-status-ai border border-status-ai/30",
  frontend: "bg-primary/10 text-primary border border-primary/30",
  cron: "bg-bg-elevated text-text-muted border border-bg-border",
}

const buildSparklineData = (job) => {
  const base = job?.stats?.meanLatency ?? job?.lastLatency ?? 100
  return [-12, -8, -4, 0, 6, 3, 9].map((offset) => ({ value: Math.max(0, base + offset) }))
}

const Sparkline = ({ data, color = "primary" }) => {
  if (!data.length) return null

  const width = 180
  const height = 42
  const values = data.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = width / Math.max(data.length - 1, 1)
  
  // Map semantic color name to CSS variable hex for SVG stroke
  const strokeColors = {
    primary: "var(--color-primary)",
    success: "var(--color-status-success)",
    error: "var(--color-status-error)",
    warning: "var(--color-status-warning)",
    ai: "var(--color-status-ai)",
  }
  const stroke = strokeColors[color] || strokeColors.primary

  const points = data
    .map((point, index) => {
      const x = index * stepX
      const y = height - ((point.value - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-full overflow-visible">
      <polyline 
        fill="none" 
        stroke={stroke} 
        strokeWidth="2.5" 
        points={points} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  )
}

const SkeletonCard = () => (
  <div className="h-55 animate-pulse rounded-card border border-bg-border bg-bg-base p-4">
    <div className="mb-4 h-4 w-24 rounded bg-bg-elevated" />
    <div className="mb-3 h-8 w-20 rounded bg-bg-elevated" />
    <div className="h-24 rounded-lg bg-bg-elevated" />
  </div>
)

const AlertBanner = ({ jobs }) => {
  const downJobs = jobs.filter((job) => job.lastStatus === "down")

  if (!downJobs.length) {
    return (
      <div className="rounded-card border border-bg-border bg-bg-base p-4 text-text-primary">
        <div className="font-mono text-xs uppercase tracking-widest text-status-success">System status</div>
        <div className="mt-1 text-sm text-text-secondary">All monitors are currently healthy.</div>
      </div>
    )
  }

  const critical = downJobs[0]

  return (
    <div className="rounded-card border border-status-error/40 bg-bg-base px-5 py-4 shadow-lg shadow-status-error/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-text-primary">Critical incident detected</div>
          <div className="mt-1 text-xs text-status-error/90">
            {critical.title} is currently unreachable. Latency spiked before timeout.
          </div>
        </div>
        <button className="rounded-full border border-status-error/50 bg-bg-elevated px-4 py-2 text-xs font-mono uppercase tracking-widest text-status-error hover:bg-bg-surface transition">
          View logs
        </button>
      </div>
    </div>
  )
}

const MonitorCard = ({ job, onClick }) => {
  const uptime = job.lastStatus === "down" ? 0 : job.lastStatus === "pending" ? 50 : 100
  const sparklineColor = job.lastStatus === "down" ? "error" : job.lastStatus === "pending" ? "warning" : "primary"
  const sparklineData = useMemo(() => buildSparklineData(job), [job])

  const statusConfig = {
    up: { dot: "bg-status-success", ping: "bg-status-success/70" },
    down: { dot: "bg-status-error", ping: "bg-status-error/70" },
    pending: { dot: "bg-status-warning", ping: "bg-status-warning/70" },
  }
  const { dot, ping } = statusConfig[job.lastStatus] || statusConfig.pending

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-card border border-bg-border bg-bg-base p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-bg-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`relative flex h-3 w-3 rounded-full ${dot}`}>
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping}`} />
            </span>
            <div className="text-sm font-medium text-text-primary">{job.title}</div>
          </div>
          <div className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-mono ${typeStyles[job.type] ?? "bg-bg-elevated text-text-muted border border-bg-border"}`}>
            {job.type}
          </div>
        </div>
        <div className="text-right font-mono text-xs text-text-muted">
          <div>{uptime}% uptime</div>
          <div className="mt-1">{job.lastLatency ?? 0} ms</div>
        </div>
      </div>

      <div className="mt-4 h-10">
        <Sparkline data={sparklineData} color={sparklineColor} />
      </div>
    </button>
  )
}

const DashboardPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const jobs = useSelector((state) => state.jobs.jobs)
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.jobs.loading)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const displayName = useMemo(() => {
    if (typeof user?.name === "string") return user.name
    const parts = [user?.name?.firstName, user?.name?.lastName].filter(Boolean)
    return parts.length ? parts.join(" ") : ""
  }, [user])

  useEffect(() => {
    dispatch(fetchJobs({ page: 1, limit: 20 }))
  }, [dispatch])

  // Filter by search query + active filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesFilter = activeFilter === "all" || job.type === activeFilter
      const matchesSearch = searchQuery === "" || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.url?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [jobs, activeFilter, searchQuery])
  
  const total = jobs.length
  const up = jobs.filter((job) => job.lastStatus === "up").length
  const down = jobs.filter((job) => job.lastStatus === "down").length
  const avgUptime = total ? Math.round((up / total) * 100) : 0
  const avgLatency = total ? Math.round(jobs.reduce((sum, job) => sum + (job.lastLatency || 0), 0) / total) : 0

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Alert Banner - Unified Dark */}
        <AlertBanner jobs={jobs} />

        {/* Stats Grid - Unified Dark Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total monitors", total, `${jobs.filter((job) => job.isActive).length} active`],
            ["Uptime (24h)", `${avgUptime}%`, `${up} healthy`],
            ["Active incidents", down, down ? `${down} require attention` : "No incidents"],
            ["Avg latency", `${avgLatency}ms`, "Across all checks"],
          ].map(([label, value, sub]) => (
            <div key={label} className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">{label}</div>
              <div className="mt-4 font-mono text-4xl font-semibold text-text-primary">{value}</div>
              <div className="mt-2 text-xs text-text-muted">{sub}</div>
            </div>
          ))}
        </div>

        {/* Header + Search + CTA */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Overview</div>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">
              Welcome back{displayName ? `, ${displayName}` : ""}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Monitor infrastructure health, response times, and active incidents in real time.
            </p>
          </div>
          
          {/* Search Bar - Unified Dark */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search monitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-card border border-bg-border bg-bg-base px-4 py-2 pl-10 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            
            <button
              type="button"
              onClick={() => navigate("/dashboard/monitors/new")}
              className="rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-4 py-2 text-sm font-mono text-text-inverse shadow-glow-orange/20"
            >
              Add monitor
            </button>
          </div>
        </div>

        {/* Filter Tabs - Unified Dark */}
        <div className="flex flex-wrap gap-2 border-b border-bg-border pb-4">
          {["all", "api", "server", "ssl", "port", "frontend"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-btn px-3 py-2 text-xs font-mono uppercase tracking-widest transition ${
                activeFilter === filter
                  ? "bg-primary text-text-inverse"
                  : "border border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40 hover:bg-bg-elevated"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Monitor Cards Grid - Unified Dark */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <MonitorCard 
                key={job._id} 
                job={job} 
                onClick={() => navigate(`/dashboard/monitors/${job._id}`)} 
              />
            ))}

            {/* Add Monitor Placeholder - Unified Dark */}
            <button
              type="button"
              onClick={() => navigate("/dashboard/monitors/new")}
              className="flex min-h-55 items-center justify-center rounded-card border border-dashed border-bg-border bg-bg-base p-4 text-center text-text-muted hover:border-primary/50 hover:text-primary hover:bg-bg-elevated transition group"
            >
              <div className="flex flex-col items-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-bg-border text-xl text-primary group-hover:scale-110 transition-transform">
                  +
                </div>
                <div className="text-xs uppercase tracking-widest">Add monitor</div>
              </div>
            </button>
          </div>
        )}

        {/* Charts Section - Unified Dark */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Uptime Chart */}
          <div className="rounded-card border border-bg-border bg-bg-base p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-text-muted">System uptime</div>
                <div className="mt-3 font-mono text-3xl font-semibold text-primary">99.998%</div>
              </div>
              <div className="text-right text-xs text-text-muted">last 30d</div>
            </div>
            <div className="mt-5 grid gap-1" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}>
              {Array.from({ length: 20 }).map((_, index) => (
                <div 
                  key={index} 
                  className={`h-10 rounded-sm transition-colors ${
                    index === 5 ? "bg-status-error" : "bg-primary/80 hover:bg-primary"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Latency Sparkline */}
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-text-muted">Avg latency</div>
            <div className="mt-3 font-mono text-4xl font-semibold text-text-primary">{avgLatency}ms</div>
            <div className="mt-5">
              <Sparkline data={buildSparklineData({ stats: { meanLatency: avgLatency } })} color="primary" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage