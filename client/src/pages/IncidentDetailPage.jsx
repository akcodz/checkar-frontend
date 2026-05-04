// src/pages/IncidentDetailPage.jsx
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchIncidentById } from "../features/incidents/incidentsSlice"

// Type & Status badges using semantic palette
const typeLabels = {
  CRITICAL_FAILURE: { label: "Critical Failure", color: "bg-status-error/10 text-status-error border border-status-error/30" },
  PERFORMANCE_ANOMALY: { label: "Performance Anomaly", color: "bg-status-warning/10 text-status-warning border border-status-warning/30" },
}

const statusLabels = {
  active: { label: "Active", color: "bg-status-error/10 text-status-error border border-status-error/30" },
  resolved: { label: "Resolved", color: "bg-status-success/10 text-status-success border border-status-success/30" },
}

const IncidentDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const incident = useSelector((state) => state.incidents.activeIncident)
  const loading = useSelector((state) => state.incidents.loading)

  useEffect(() => {
    if (id) dispatch(fetchIncidentById(id))
  }, [dispatch, id])

  if (loading || !incident) {
    return (
      <div className="min-h-screen bg-bg-base p-6 text-text-primary">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-12 w-60 animate-pulse rounded-btn bg-bg-elevated" />
          <div className="h-80 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-60 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
            <div className="h-60 animate-pulse rounded-card border border-bg-border bg-bg-elevated" />
          </div>
        </div>
      </div>
    )
  }

  const typeInfo = typeLabels[incident.type] ?? { label: incident.type, color: "bg-bg-elevated text-text-muted border border-bg-border" }
  const statusInfo = statusLabels[incident.status] ?? statusLabels.active

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 rounded-btn border border-bg-border bg-bg-base px-3 py-2 font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition"
            >
              ← Back
            </button>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">Incident detail</div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-mono uppercase tracking-widest border ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className={`rounded-full px-3 py-1 text-sm font-mono uppercase tracking-widest border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <div className="mt-3 text-sm text-text-muted">
              Created {new Date(incident.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Raw Logs Metrics - Unified Dark */}
        {incident.rawLogs && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Latency</div>
              <div className="mt-3 font-mono text-3xl font-semibold text-primary">{incident.rawLogs.latency ?? "—"}ms</div>
            </div>
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">HTTP Status</div>
              <div className={`mt-3 font-mono text-3xl font-semibold ${
                incident.rawLogs.status >= 500 ? "text-status-error" :
                incident.rawLogs.status >= 400 ? "text-status-warning" :
                "text-status-success"
              }`}>
                {incident.rawLogs.status ?? "—"}
              </div>
            </div>
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Z-Score</div>
              <div className={`mt-3 font-mono text-3xl font-semibold ${
                Number(incident.rawLogs.zScore) > 3 ? "text-status-error" : "text-text-primary"
              }`}>
                {incident.rawLogs.zScore ?? "—"}
              </div>
            </div>
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-[11px] uppercase tracking-[0.35em] text-text-muted">Message</div>
              <div className="mt-3 text-sm text-text-secondary break-words">{incident.rawLogs.message ?? "—"}</div>
            </div>
          </div>
        )}

        {/* AI Report - Semantic Colors + Unified Dark */}
        {incident.aiReport && (
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.3em] text-status-ai">AI Postmortem Report</div>

            {/* Summary */}
            <div className="rounded-card border border-status-ai/30 bg-status-ai/5 p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-status-ai">Summary</div>
              <p className="text-sm leading-7 text-text-secondary">{incident.aiReport.summary}</p>
            </div>

            {/* Root Cause */}
            <div className="rounded-card border border-primary/30 bg-primary/5 p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Root Cause</div>
              <p className="text-sm leading-7 text-text-secondary">{incident.aiReport.rootCause}</p>
            </div>

            {/* Suggested Fix */}
            <div className="rounded-card border border-status-success/30 bg-status-success/5 p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-status-success">Suggested Fix</div>
              <p className="text-sm leading-7 text-text-secondary">{incident.aiReport.suggestedFix}</p>
            </div>
          </div>
        )}

        {/* Metadata - Unified Dark */}
        <div className="rounded-card border border-bg-border bg-bg-base p-5">
          <div className="mb-4 text-xs uppercase tracking-widest text-text-muted">Metadata</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs text-text-muted">Incident ID</div>
              <div className="mt-1 font-mono text-sm text-text-secondary break-all">{incident._id}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted">Job ID</div>
              <div className="mt-1 font-mono text-sm text-text-secondary break-all">{incident.jobId}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted">Created</div>
              <div className="mt-1 text-sm text-text-secondary">{new Date(incident.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted">Updated</div>
              <div className="mt-1 text-sm text-text-secondary">{new Date(incident.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetailPage