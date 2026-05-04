// src/pages/MonitorsPage.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { deleteJob, fetchJobs, updateJob } from "../features/jobs/jobsSlice"

const filterOptions = ["all", "api", "server", "ssl", "port", "frontend"]

// Status classes using semantic palette
const statusClasses = {
  up: "bg-status-success/10 text-status-success border border-status-success/30",
  down: "bg-status-error/10 text-status-error border border-status-error/30",
  pending: "bg-status-warning/10 text-status-warning border border-status-warning/30",
}

const truncate = (value, length = 35) => {
  if (!value) return "-"
  return value.length > length ? `${value.slice(0, length)}...` : value
}

const getIntervalLabel = (interval = 0) => {
  if (interval >= 86400) return "daily"
  if (interval >= 3600) return `${Math.round(interval / 3600)}h`
  if (interval >= 60) return `${Math.round(interval / 60)}m`
  return `${interval}s`
}

const buildUptimeBars = () => Array.from({ length: 16 }, (_, index) => index)

const SummaryCard = ({ label, value, sub, accent = "bg-primary" }) => (
  <div className="rounded-card border border-bg-border bg-bg-base p-5">
    <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">{label}</div>
    <div className="mt-3 font-mono text-4xl font-semibold text-text-primary">{value}</div>
    <div className="mt-2 text-xs text-text-muted">{sub}</div>
    {label.toLowerCase().includes("uptime") && (
      <div className="mt-4 flex gap-1">
        {buildUptimeBars().map((bar) => (
          <div
            key={bar}
            className={`h-10 flex-1 rounded-sm transition-colors ${
              bar === 4 ? "bg-status-error" : `${accent}/80 hover:${accent}`
            }`}
          />
        ))}
      </div>
    )}
  </div>
)

const MonitorsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const jobs = useSelector((state) => state.jobs.jobs)
  const pagination = useSelector((state) => state.jobs.pagination)
  const loading = useSelector((state) => state.jobs.loading)

  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuBtnRefs = useRef({})

  const getMenuPosition = () => {
    if (!openMenuId || !menuBtnRefs.current[openMenuId]) return null
    const rect = menuBtnRefs.current[openMenuId].getBoundingClientRect()
    return { top: rect.bottom + 4, left: rect.right - 176 }
  }

  useEffect(() => {
    dispatch(fetchJobs({ page: pagination.page ?? 1, limit: 10 }))
  }, [dispatch, pagination.page])

  const filtered = useMemo(
    () =>
      jobs
        .filter((job) => activeFilter === "all" || job.type === activeFilter)
        .filter(
          (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.url?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    [activeFilter, jobs, searchQuery],
  )

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    await dispatch(deleteJob(deleteConfirmId))
    toast.success("Monitor deleted")
    setDeleteConfirmId(null)
  }

  const handleToggleActive = (job) => {
    dispatch(updateJob({ id: job._id, data: { isActive: !job.isActive } }))
    setOpenMenuId(null)
  }

  const handlePageChange = (newPage) => {
    dispatch(fetchJobs({ page: newPage, limit: 10 }))
  }

  const total = jobs.length
  const up = jobs.filter((job) => job.lastStatus === "up").length
  const active = jobs.filter((job) => job.isActive).length
  const avgLatency = total
    ? Math.round(jobs.reduce((sum, job) => sum + (job.lastLatency || 0), 0) / total)
    : 0

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header + Search + CTA */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">System Monitors</div>
            <h1 className="mt-2 text-3xl font-semibold text-text-primary">Monitor inventory</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Manage and inspect every endpoint currently being observed.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search Input - Unified Dark */}
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search systems..."
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-2 pl-10 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition sm:w-80"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            
            {/* Add Monitor CTA */}
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
          {filterOptions.map((filter) => (
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

        {/* Table Container - Unified Dark */}
        <div className="overflow-x-auto rounded-card border border-bg-border bg-bg-base">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Name", "Type", "URL/Host", "Status", "Latency", "Checks", "Interval", "Actions",
                ].map((column) => (
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
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8} className="border-b border-bg-border px-4 py-4">
                      <div className="h-5 w-full animate-pulse rounded bg-bg-elevated" />
                    </td>
                  </tr>
                ))
              ) : filtered.length ? (
                filtered.map((job) => (
                  <tr 
                    key={job._id} 
                    className="relative transition hover:bg-bg-elevated group"
                  >
                    {/* Name */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm text-text-primary">
                      {job.title}
                    </td>
                    
                    {/* Type Badge */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm">
                      <span className={`rounded-full px-2 py-1 font-mono text-xs uppercase tracking-widest ${
                        job.type === "api" ? "bg-primary/10 text-primary border border-primary/30" :
                        job.type === "server" ? "bg-status-info/10 text-status-info border border-status-info/30" :
                        job.type === "ssl" ? "bg-status-warning/10 text-status-warning border border-status-warning/30" :
                        job.type === "port" ? "bg-status-ai/10 text-status-ai border border-status-ai/30" :
                        job.type === "frontend" ? "bg-primary/10 text-primary border border-primary/30" :
                        "bg-bg-elevated text-text-muted border border-bg-border"
                      }`}>
                        {job.type}
                      </span>
                    </td>
                    
                    {/* URL/Host */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm text-text-secondary">
                      {job.type === "port" ? `${job.host}:${job.port}` : truncate(job.url)}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm">
                      <span className={`rounded px-2 py-1 text-xs font-mono uppercase tracking-widest ${statusClasses[job.lastStatus] ?? statusClasses.pending}`}>
                        {job.lastStatus}
                      </span>
                    </td>
                    
                    {/* Latency */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm font-mono text-text-secondary">
                      {job.lastLatency ?? 0} ms
                    </td>
                    
                    {/* Checks Count */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm font-mono text-text-secondary">
                      {job.stats?.totalChecks ?? 0}
                    </td>
                    
                    {/* Interval */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm font-mono text-text-secondary">
                      {getIntervalLabel(job.interval ?? job.intervalSeconds ?? 0)}
                    </td>
                    
                    {/* Actions Menu */}
                    <td className="border-b border-bg-border px-4 py-3 text-sm">
                      <div className="relative inline-block text-left">
                        <button
                          ref={(el) => { menuBtnRefs.current[job._id] = el }}
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === job._id ? null : job._id)}
                          className="rounded-full border border-bg-border bg-bg-base px-3 py-1 text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 transition"
                          aria-label="Open actions menu"
                        >
                          ⋯
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-muted">
                    No monitors match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Unified Dark */}
        <div className="flex items-center justify-between text-sm text-text-muted">
          <div>
            Page {pagination.page ?? 1} of {pagination.totalPages ?? 1}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, (pagination.page ?? 1) - 1))}
              className="rounded-full border border-bg-border bg-bg-base px-3 py-2 text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(pagination.page ?? 1) <= 1}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(pagination.totalPages ?? 1, (pagination.page ?? 1) + 1))}
              className="rounded-full border border-bg-border bg-bg-base px-3 py-2 text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(pagination.page ?? 1) >= (pagination.totalPages ?? 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Unified Dark */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-card border border-bg-border bg-bg-base p-6 text-text-primary shadow-2xl">
            <h2 className="text-xl font-semibold text-text-primary">Delete this monitor?</h2>
            <p className="mt-2 text-sm text-text-secondary">All logs and history will be permanently removed.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-full border border-bg-border bg-bg-base px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full bg-status-error hover:bg-status-error/90 active:bg-status-error/80 transition px-4 py-2 text-sm text-text-inverse"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions Dropdown Menu - Unified Dark */}
      {openMenuId && getMenuPosition() && createPortal(
        <div
          className="fixed z-9999 w-44 rounded-card border border-bg-border bg-bg-base p-2 shadow-lg shadow-black/40"
          style={{ top: getMenuPosition().top, left: getMenuPosition().left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              navigate(`/dashboard/monitors/${openMenuId}`)
              setOpenMenuId(null)
            }}
            className="block w-full rounded-full px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => {
              navigate(`/dashboard/monitors/${openMenuId}/edit`)
              setOpenMenuId(null)
            }}
            className="block w-full rounded-full px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              const job = jobs.find((j) => j._id === openMenuId)
              if (job) handleToggleActive(job)
            }}
            className="block w-full rounded-full px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition"
          >
            {jobs.find((j) => j._id === openMenuId)?.isActive ? "Pause monitor" : "Resume monitor"}
          </button>
          <hr className="my-2 border-bg-border" />
          <button
            type="button"
            onClick={() => {
              setDeleteConfirmId(openMenuId)
              setOpenMenuId(null)
            }}
            className="block w-full rounded-full px-3 py-2 text-left text-sm text-status-error hover:bg-status-error/10 transition"
          >
            Delete monitor
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}

export default MonitorsPage