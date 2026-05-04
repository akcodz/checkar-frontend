// src/pages/MonitorDetailPage.jsx
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { fetchJobById, updateJob } from "../features/jobs/jobsSlice"
// import { fetchLogs } from "../features/logs/logsSlice"

// Get bar color using semantic palette
const getBarColor = (pct) => {
  if (pct === null) return "bg-bg-elevated"
  if (pct >= 99) return "bg-primary"
  if (pct >= 95) return "bg-primary/90"
  if (pct >= 80) return "bg-status-warning"
  return "bg-status-error"
}

const buildUptimeBar = (logs) => {
  const byDate = new Map()

  logs.forEach((log) => {
    const date = log.timestamp.split("T")[0]
    const entry = byDate.get(date) ?? { up: 0, total: 0 }
    entry.total += 1
    if (log.isValid) entry.up += 1
    byDate.set(date, entry)
  })

  return Array.from({ length: 45 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (44 - index))
    const key = date.toISOString().split("T")[0]
    const entry = byDate.get(key)
    return { date: key, pct: entry ? Math.round((entry.up / entry.total) * 100) : null }
  })
}

const LineChartSvg = ({ data, threshold = 1000 }) => {
  if (!data.length) {
    return <div className="h-65 rounded-card bg-bg-base border border-bg-border" />
  }

  const width = 900
  const height = 260
  const padding = 24
  const values = data.map((point) => point.latency ?? 0)
  const max = Math.max(threshold, ...values, 1)
  const min = 0
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const stepX = innerWidth / Math.max(data.length - 1, 1)
  
  // Use CSS variables for theme-synced colors
  const gridColor = "var(--color-bg-border)"      // #334155
  const thresholdColor = "var(--color-primary)"    // #fb923c
  const lineColor = "var(--color-primary)"         // #fb923c
  const anomalyColor = "var(--color-status-error)" // #ef4444

  const points = data
    .map((point, index) => {
      const x = padding + index * stepX
      const value = point.latency ?? 0
      const y = padding + innerHeight - ((value - min) / (max - min || 1)) * innerHeight
      return `${x},${y}`
    })
    .join(" ")
    
  const thresholdY = padding + innerHeight - ((threshold - min) / (max - min || 1)) * innerHeight

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-65 w-full">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((row) => (
        <line
          key={row}
          x1={padding}
          x2={width - padding}
          y1={padding + (innerHeight / 4) * row}
          y2={padding + (innerHeight / 4) * row}
          stroke={gridColor}
          strokeDasharray="3 3"
        />
      ))}
      {/* Threshold line */}
      <line x1={padding} x2={width - padding} y1={thresholdY} y2={thresholdY} stroke={thresholdColor} strokeDasharray="4 4" />
      {/* Data line */}
      <polyline fill="none" stroke={lineColor} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      {/* Anomaly markers */}
      {data.map((point, index) => {
        const x = padding + index * stepX
        const value = point.latency ?? 0
        const y = padding + innerHeight - ((value - min) / (max - min || 1)) * innerHeight
        return point.isAnomaly ? <circle key={index} cx={x} cy={y} r="5" fill={anomalyColor} /> : null
      })}
    </svg>
  )
}

const StatusPill = ({ status }) => {
  const styles = {
    up: "bg-status-success/10 text-status-success border border-status-success/30",
    down: "bg-status-error/10 text-status-error border border-status-error/30",
    pending: "bg-status-warning/10 text-status-warning border border-status-warning/30",
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-mono uppercase tracking-widest ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  )
}

const MonitorDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activeJob = useSelector((state) => state.jobs.activeJob)
  const jobsLoading = useSelector((state) => state.jobs.loading)
  const logs = useSelector((state) => state.logs.logs)
  const logsLoading = useSelector((state) => state.logs.loading)

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id))
      // dispatch(fetchLogs(id)) // Uncomment when logs slice is ready
    }
  }, [dispatch, id])

  const chartData = useMemo(
    () =>
      logs.slice(-60).map((log) => ({
        time: new Date(log.timestamp).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
        latency: log.isValid ? log.latency : null,
        isAnomaly: log.isAnomaly,
        zScore: log.zScore,
      })),
    [logs],
  )

  const validLogs = chartData.filter((item) => item.latency !== null)
  const averageLatency = validLogs.length ? Math.round(validLogs.reduce((sum, item) => sum + item.latency, 0) / validLogs.length) : 0
  const p99Latency = validLogs.length ? Math.max(...validLogs.map((item) => item.latency)) : 0
  const uptimePct = logs.length ? Math.round((logs.filter((log) => log.isValid).length / logs.length) * 100) : 0
  const anomalies = logs.filter((log) => log.isAnomaly)
  const uptimeBar = useMemo(() => buildUptimeBar(logs), [logs])

  if (jobsLoading || logsLoading) {
    return (
      <div className="min-h-screen bg-bg-base p-6 text-text-primary">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-16 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_360px]">
            <div className="h-80 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
            <div className="h-80 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header + Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Monitor detail</div>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-text-primary">{activeJob?.title ?? "Monitor"}</h1>
              <StatusPill status={activeJob?.lastStatus ?? "pending"} />
            </div>
            <div className="mt-3 font-mono text-sm text-text-secondary">
              {activeJob?.type ?? "unknown"} · {activeJob?.url ?? `${activeJob?.host ?? ""}${activeJob?.port ? `:${activeJob.port}` : ""}`}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                dispatch(updateJob({ id, data: { isActive: !activeJob?.isActive } }))
                toast.success(activeJob?.isActive ? "Monitor paused" : "Monitor resumed")
              }}
              className="rounded-full border border-bg-border bg-bg-base px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition"
            >
              {activeJob?.isActive ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/dashboard/monitors/${id}/edit`)}
              className="rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-4 py-2 text-sm font-mono text-text-inverse shadow-glow-orange/20"
            >
              Edit monitor
            </button>
          </div>
        </div>

        {/* Main Grid: Chart + Stats */}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_360px]">
          
          {/* Latency Chart - Unified Dark */}
          <div className="rounded-card border border-bg-border bg-bg-base p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-text-muted">Latency (last 24 hours)</div>
                <div className="mt-2 text-xs text-text-secondary">Average {averageLatency}ms · P99 {p99Latency}ms</div>
              </div>
              <div className="text-xs text-text-secondary">1000ms limit</div>
            </div>
            <div className="mt-4">
              <LineChartSvg data={chartData} threshold={1000} />
            </div>
          </div>

          {/* Right Column Stats */}
          <div className="space-y-4">
            
            {/* Uptime Card */}
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-text-muted">Total uptime</div>
              <div className="mt-3 font-mono text-4xl font-semibold text-primary">{uptimePct}%</div>
              <div className="mt-4 flex gap-1">
                {uptimeBar.slice(-16).map((bar) => (
                  <div 
                    key={bar.date} 
                    className={`h-3 flex-1 rounded-sm transition-colors ${getBarColor(bar.pct)}`} 
                    title={`${bar.date}: ${bar.pct === null ? "no data" : `${bar.pct}%`}`} 
                  />
                ))}
              </div>
            </div>

            {/* Last Check Card */}
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-text-muted">Last check</div>
              <div className="mt-3 font-mono text-4xl font-semibold text-text-primary">{activeJob?.lastLatency ?? 0}ms</div>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-text-secondary">Status: {activeJob?.lastStatus ?? "unknown"}</div>
            </div>

            {/* Node Health Card */}
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-text-muted">Node health</div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["us-east-1", "102ms"],
                  ["eu-central-1", "245ms"],
                  ["ap-southeast-1", "412ms"],
                ].map(([region, latency]) => (
                  <div key={region} className="flex items-center justify-between text-text-secondary">
                    <span>{region}</span>
                    <span className={`font-mono ${latency.includes("4") ? "text-status-warning" : "text-primary"}`}>{latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* History + Logs Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          
          {/* 45-Day Service History - Unified Dark */}
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="mb-4 text-xs uppercase tracking-widest text-text-muted">45-day service history</div>
            <div className="flex flex-wrap gap-1">
              {uptimeBar.map((bar) => (
                <div 
                  key={bar.date} 
                  title={`${bar.date}: ${bar.pct === null ? "no data" : `${bar.pct}%`}`} 
                  className={`h-8 w-2.5 rounded-sm cursor-pointer transition-colors hover:opacity-80 ${getBarColor(bar.pct)}`} 
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-text-muted">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> 100%</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-warning" /> &gt;95%</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-error" /> &lt;95%</span>
            </div>
          </div>

          {/* Recent Checks Table - Unified Dark */}
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="mb-4 text-xs uppercase tracking-widest text-text-muted">Recent checks</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Timestamp", "Status", "Response Time", "Node", "Action"].map((column) => (
                      <th 
                        key={column} 
                        className="bg-bg-base px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-text-muted border-b border-bg-border"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(-20).map((log) => (
                    <tr key={log.timestamp} className="border-b border-bg-border hover:bg-bg-elevated transition">
                      <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {log.isValid ? (
                          <span className="text-status-success">200 OK</span>
                        ) : (
                          <span className="text-status-error">503 ERROR</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                        {log.latency ?? "-"}ms
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-text-secondary">
                        {activeJob?.type === "port" ? `${activeJob.host}:${activeJob.port}` : activeJob?.type ?? "node"}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {log.isAnomaly ? (
                          <span className="rounded-full bg-status-error/10 px-2 py-1 text-status-error border border-status-error/30">
                            z={log.zScore}
                          </span>
                        ) : (
                          <span className="rounded-full bg-bg-elevated px-2 py-1 text-text-muted border border-bg-border">
                            Details
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Stats - Unified Dark */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="text-xs uppercase tracking-widest text-text-muted">Uptime</div>
            <div className="mt-3 font-mono text-2xl font-medium text-text-primary">{uptimePct}%</div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="text-xs uppercase tracking-widest text-text-muted">Logs</div>
            <div className="mt-3 font-mono text-2xl font-medium text-text-primary">{logs.length}</div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="text-xs uppercase tracking-widest text-text-muted">Anomalies</div>
            <div className="mt-3 font-mono text-2xl font-medium text-status-error">{anomalies.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitorDetailPage