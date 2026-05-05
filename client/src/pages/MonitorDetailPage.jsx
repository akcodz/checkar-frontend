// src/pages/MonitorDetailPage.jsx
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchJobById, updateJob } from "../features/jobs/jobsSlice";
import { fetchLogs } from "../features/jobs/jobsSlice.js";

// Get bar color using semantic palette
const getBarColor = (pct) => {
  if (pct === null) return "bg-bg-elevated";
  if (pct >= 99) return "bg-primary";
  if (pct >= 95) return "bg-primary/90";
  if (pct >= 80) return "bg-status-warning";
  return "bg-status-error";
};

const buildUptimeBar = (logs) => {
  const byDate = new Map();

  logs.forEach((log) => {
    const date = log.timestamp.split("T")[0];
    const entry = byDate.get(date) ?? { up: 0, total: 0 };
    entry.total += 1;
    if (log.isValid) entry.up += 1;
    byDate.set(date, entry);
  });

  return Array.from({ length: 45 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (44 - index));
    const key = date.toISOString().split("T")[0];
    const entry = byDate.get(key);
    return {
      date: key,
      pct: entry ? Math.round((entry.up / entry.total) * 100) : null,
    };
  });
};

const LineChartSvg = ({ data, threshold = 1000 }) => {
  if (!data.length) {
    return (
      <div className="h-65 rounded-card bg-bg-base border border-bg-border" />
    );
  }

  const width = 900;
  const height = 260;
  const padding = 24;
  const values = data.map((point) => point.latency ?? 0);
  const max = Math.max(threshold, ...values, 1);
  const min = 0;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const stepX = innerWidth / Math.max(data.length - 1, 1);

  // Use CSS variables for theme-synced colors
  const gridColor = "var(--color-bg-border)"; // #334155
  const thresholdColor = "var(--color-primary)"; // #fb923c
  const lineColor = "var(--color-primary)"; // #fb923c
  const anomalyColor = "var(--color-status-error)"; // #ef4444

  const points = data
    .map((point, index) => {
      const x = padding + index * stepX;
      const value = point.latency ?? 0;
      const y =
        padding +
        innerHeight -
        ((value - min) / (max - min || 1)) * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const thresholdY =
    padding +
    innerHeight -
    ((threshold - min) / (max - min || 1)) * innerHeight;

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
      <line
        x1={padding}
        x2={width - padding}
        y1={thresholdY}
        y2={thresholdY}
        stroke={thresholdColor}
        strokeDasharray="4 4"
      />
      {/* Data line */}
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth="3"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Anomaly markers */}
      {data.map((point, index) => {
        const x = padding + index * stepX;
        const value = point.latency ?? 0;
        const y =
          padding +
          innerHeight -
          ((value - min) / (max - min || 1)) * innerHeight;
        return point.isAnomaly ? (
          <circle key={index} cx={x} cy={y} r="5" fill={anomalyColor} />
        ) : null;
      })}
    </svg>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    up: "bg-status-success/10 text-status-success border border-status-success/30",
    down: "bg-status-error/10 text-status-error border border-status-error/30",
    pending:
      "bg-status-warning/10 text-status-warning border border-status-warning/30",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-mono uppercase tracking-widest ${styles[status] ?? styles.pending}`}
    >
      {status}
    </span>
  );
};

const MonitorDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeJob = useSelector((state) => state.jobs.activeJob);
  const jobsLoading = useSelector((state) => state.jobs.loading);
  const { logs, loading: logsLoading } = useSelector((state) => state.jobs);
  console.log("logs:", logs);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
      dispatch(fetchLogs(id)); // Uncomment when logs slice is ready
    }
  }, [dispatch, id]);

  const chartData = useMemo(
    () =>
      logs.slice(-60).map((log) => ({
        time: new Date(log.timestamp).toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        latency: log.isValid ? log.latency : null,
        isAnomaly: log.isAnomaly,
        zScore: log.zScore,
      })),
    [logs],
  );

  const validLogs = chartData.filter((item) => item.latency !== null);
  const averageLatency = validLogs.length
    ? Math.round(
        validLogs.reduce((sum, item) => sum + item.latency, 0) /
          validLogs.length,
      )
    : 0;
  const p99Latency = validLogs.length
    ? Math.max(...validLogs.map((item) => item.latency))
    : 0;
  const uptimePct = logs.length
    ? Math.round((logs.filter((log) => log.isValid).length / logs.length) * 100)
    : 0;
  const anomalies = logs.filter((log) => log.isAnomaly);
  const uptimeBar = useMemo(() => buildUptimeBar(logs), [logs]);

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
    );
  }

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header + Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Monitor detail
            </div>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-text-primary">
                {activeJob?.title ?? "Monitor"}
              </h1>
              <StatusPill status={activeJob?.lastStatus ?? "pending"} />
            </div>
            <div className="mt-3 font-mono text-sm text-text-secondary">
              {activeJob?.type ?? "unknown"} ·{" "}
              {activeJob?.url ??
                `${activeJob?.host ?? ""}${activeJob?.port ? `:${activeJob.port}` : ""}`}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                dispatch(
                  updateJob({ id, data: { isActive: !activeJob?.isActive } }),
                );
                toast.success(
                  activeJob?.isActive ? "Monitor paused" : "Monitor resumed",
                );
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

          {/* Right Column Stats */}
          <div className="space-y-4">
            {/* Last Check Card */}
            <div className="rounded-card border border-bg-border bg-bg-base p-5">
              <div className="text-xs uppercase tracking-[0.35em] text-text-muted">
                Last check
              </div>
              <div className="mt-3 font-mono text-4xl font-semibold text-text-primary">
                {activeJob?.lastLatency ?? 0}ms
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-text-secondary">
                Status: {activeJob?.lastStatus ?? "unknown"}
              </div>
            </div>
          </div>
        </div>

        {/* History + Logs Grid */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="mb-4 text-xs uppercase tracking-widest text-text-muted">
              45-day service history
            </div>
            <div className="flex flex-wrap gap-1 justify-start">
              {uptimeBar.map((bar) => (
                <div
                  key={bar.date}
                  title={`${bar.date}: ${bar.pct === null ? "no data" : `${bar.pct}%`}`}
                  className={`h-8 w-2 sm:w-2.5 rounded-sm cursor-pointer transition-colors hover:opacity-80 ${getBarColor(bar.pct)}`}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> 100%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-status-warning" />{" "}
                &gt;95%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-status-error" />{" "}
                &lt;95%
              </span>
            </div>
          </div>

          <div className="rounded-card border border-bg-border bg-bg-base p-4 overflow-hidden">
            <div className="mb-4 text-xs uppercase tracking-widest text-text-muted">
              Recent checks (logs)
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="max-h-60 overflow-y-auto border-t border-bg-border">
                  <table className="min-w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr>
                        {[
                          "Timestamp",
                          "Status",
                          "Response Time",
                          "Node",
                          "Action",
                        ].map((column) => (
                          <th
                            key={column}
                            className="bg-bg-base px-3 py-3 text-left font-mono text-[10px] sm:text-xs uppercase tracking-widest text-text-muted border-b border-bg-border whitespace-nowrap"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {logs.slice(-20).map((log) => (
                        <tr
                          key={log.timestamp}
                          className="border-b border-bg-border hover:bg-bg-elevated transition"
                        >
                          <td className="px-3 py-3 font-mono text-xs sm:text-sm text-text-secondary whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs sm:text-sm whitespace-nowrap">
                            {log.isValid ? (
                              <span className="text-status-success">
                                200 OK
                              </span>
                            ) : (
                              <span className="text-status-error">503 ERR</span>
                            )}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs sm:text-sm text-text-secondary whitespace-nowrap">
                            {log.latency ?? "-"}ms
                          </td>
                          <td className="px-3 py-3 font-mono text-xs sm:text-sm text-text-secondary whitespace-nowrap">
                            {activeJob?.type === "port"
                              ? `${activeJob.host}:${activeJob.port}`
                              : (activeJob?.type ?? "node")}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs sm:text-sm whitespace-nowrap">
                            {log.isAnomaly ? (
                              <span className="rounded-full bg-status-error/10 px-2 py-0.5 text-status-error border border-status-error/30 text-[10px]">
                                z={log.zScore}
                              </span>
                            ) : (
                              <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-text-muted border border-bg-border text-[10px]">
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
          </div>
        </div>

        {/* Summary Stats - Unified Dark */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="text-xs uppercase tracking-widest text-text-muted">
              Uptime
            </div>
            <div className="mt-3 font-mono text-2xl font-medium text-text-primary">
              {uptimePct}%
            </div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="text-xs uppercase tracking-widest text-text-muted">
              Logs
            </div>
            <div className="mt-3 font-mono text-2xl font-medium text-text-primary">
              {logs.length}
            </div>
          </div>
          <div className="rounded-card border border-bg-border bg-bg-base p-4">
            <div className="text-xs uppercase tracking-widest text-text-muted">
              Anomalies
            </div>
            <div className="mt-3 font-mono text-2xl font-medium text-status-error">
              {anomalies.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorDetailPage;
