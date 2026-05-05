// src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs } from "../features/jobs/jobsSlice";

// Type badge styles using semantic palette
const typeStyles = {
  api: "bg-primary/10 text-primary border border-primary/30",
  server: "bg-status-info/10 text-status-info border border-status-info/30",
  ssl: "bg-status-warning/10 text-status-warning border border-status-warning/30",
  port: "bg-status-ai/10 text-status-ai border border-status-ai/30",
  frontend: "bg-primary/10 text-primary border border-primary/30",
  cron: "bg-bg-elevated text-text-muted border border-bg-border",
};

const buildSparklineData = (job) => {
  const base = job?.stats?.meanLatency ?? job?.lastLatency ?? 100;
  return [-12, -8, -4, 0, 6, 3, 9].map((offset) => ({
    value: Math.max(0, base + offset),
  }));
};

const Sparkline = ({ data, color = "primary" }) => {
  if (!data.length) return null;

  const width = 180;
  const height = 42;
  const values = data.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / Math.max(data.length - 1, 1);

  // Map semantic color name to CSS variable hex for SVG stroke
  const strokeColors = {
    primary: "var(--color-primary)",
    success: "var(--color-status-success)",
    error: "var(--color-status-error)",
    warning: "var(--color-status-warning)",
    ai: "var(--color-status-ai)",
  };
  const stroke = strokeColors[color] || strokeColors.primary;

  const points = data
    .map((point, index) => {
      const x = index * stepX;
      const y = height - ((point.value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-full overflow-visible"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SkeletonCard = () => (
  <div className="h-55 animate-pulse rounded-card border border-bg-border bg-bg-base p-4">
    <div className="mb-4 h-4 w-24 rounded bg-bg-elevated" />
    <div className="mb-3 h-8 w-20 rounded bg-bg-elevated" />
    <div className="h-24 rounded-lg bg-bg-elevated" />
  </div>
);

const AlertBanner = ({ jobs }) => {
  const downJobs = jobs.filter((job) => job.lastStatus === "down");

  if (!downJobs.length) {
    return (
      <div className="rounded-card border border-bg-border bg-bg-base p-4 text-text-primary">
        <div className="font-mono text-xs uppercase tracking-widest text-status-success">
          System status
        </div>
        <div className="mt-1 text-sm text-text-secondary">
          All monitors are currently healthy.
        </div>
      </div>
    );
  }

  const critical = downJobs[0];

  return (
    <div className="rounded-card border border-status-error/40 bg-bg-base px-5 py-4 shadow-lg shadow-status-error/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-text-primary">
            Critical incident detected
          </div>
          <div className="mt-1 text-xs text-status-error/90">
            {critical.title} is currently unreachable. Latency spiked before
            timeout.
          </div>
        </div>
      </div>
    </div>
  );
};

const MonitorCard = ({ job, onClick }) => {
  const uptime =
    job.lastStatus === "down" ? 0 : job.lastStatus === "pending" ? 50 : 100;
  const sparklineColor =
    job.lastStatus === "down"
      ? "error"
      : job.lastStatus === "pending"
        ? "warning"
        : "primary";
  const sparklineData = useMemo(() => buildSparklineData(job), [job]);

  const statusConfig = {
    up: { dot: "bg-status-success", ping: "bg-status-success/70" },
    down: { dot: "bg-status-error", ping: "bg-status-error/70" },
    pending: { dot: "bg-status-warning", ping: "bg-status-warning/70" },
  };
  const { dot, ping } = statusConfig[job.lastStatus] || statusConfig.pending;

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
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping}`}
              />
            </span>
            <div className="text-sm font-medium text-text-primary">
              {job.title}
            </div>
          </div>
          <div
            className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-mono ${typeStyles[job.type] ?? "bg-bg-elevated text-text-muted border border-bg-border"}`}
          >
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
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector((state) => state.jobs.jobs);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.jobs.loading);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = useMemo(() => {
    if (typeof user?.name === "string") return user.name;
    const parts = [user?.name?.firstName, user?.name?.lastName].filter(Boolean);
    return parts.length ? parts.join(" ") : "";
  }, [user]);

  useEffect(() => {
    dispatch(fetchJobs({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Filter by search query + active filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesFilter = activeFilter === "all" || job.type === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.url?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [jobs, activeFilter, searchQuery]);

  const total = jobs.length;
  const up = jobs.filter((job) => job.lastStatus === "up").length;
  const down = jobs.filter((job) => job.lastStatus === "down").length;
  const avgUptime = total ? Math.round((up / total) * 100) : 0;
  const avgLatency = total
    ? Math.round(
        jobs.reduce((sum, job) => sum + (job.lastLatency || 0), 0) / total,
      )
    : 0;

  return (
    <div className="min-h-screen bg-bg-base p-4 sm:p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Alert Banner - Unified Dark */}
        <AlertBanner jobs={jobs} />

        {/* Stats Grid - Responsive Column Mapping */}
        {/* Stats Grid - Optimized for Mobile height */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            [
              "Total monitors",
              total,
              `${jobs.filter((job) => job.isActive).length} active`,
            ],
            ["Uptime (24h)", `${avgUptime}%`, `${up} healthy`],
            ["Service Down", down, down ? `${down} help` : "No incidents"],
            ["Avg latency", `${avgLatency}ms`, "Global avg"],
          ].map(([label, value, sub]) => (
            <div
              key={label}
              className="rounded-card border border-bg-border bg-bg-base p-3 sm:p-5"
            >
              <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.35em] text-text-muted truncate">
                {label}
              </div>
              <div className="mt-1 sm:mt-4 font-mono text-xl sm:text-4xl font-semibold text-text-primary">
                {value}
              </div>
              <div className="mt-1 text-[9px] sm:text-xs text-text-muted truncate">
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Header + Search + CTA - Vertical stack on mobile */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-[10px] uppercase tracking-[0.3em] text-text-muted">
              Overview
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-text-primary">
              Welcome back{displayName ? `, ${displayName}` : ""}
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Monitor infrastructure health, response times, and active
              incidents in real time.
            </p>
          </div>

          {/* Search and Action - Full width on small screens */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search monitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-card border border-bg-border bg-bg-base px-4 py-2.5 pl-10 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/monitors/new")}
              className="w-full sm:w-auto rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-5 py-2.5 text-sm font-mono text-text-inverse shadow-glow-orange/20"
            >
              Add monitor
            </button>
          </div>
        </div>

        {/* Filter Tabs - Horizontal scroll on mobile */}
        <div className="flex items-center gap-2 border-b border-bg-border pb-4 overflow-x-auto no-scrollbar scroll-smooth">
          {["all", "api", "server", "ssl", "port", "frontend"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-btn px-4 py-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest transition ${
                activeFilter === filter
                  ? "bg-primary text-text-inverse"
                  : "border border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40 hover:bg-bg-elevated"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col h-full max-h-[80vh] space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
            <div>
              <h2 className="text-2xl font-bold text-text-main">Monitors</h2>
              <p className="text-sm text-text-muted">
                Manage and track your active jobs
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/monitors/new")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              <span className="text-lg">+</span>
              <span>Add Monitor</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
                {filteredJobs.map((job) => (
                  <MonitorCard
                    key={job._id}
                    job={job}
                    onClick={() => navigate(`/dashboard/monitors/${job._id}`)}
                  />
                ))}

                {filteredJobs.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-bg-border bg-bg-base py-12 text-center">
                    <div className="mb-3 text-4xl text-text-muted/30">🔍</div>
                    <p className="text-text-muted">
                      No monitors found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
