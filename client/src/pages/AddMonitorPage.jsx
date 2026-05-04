// src/pages/AddMonitorPage.jsx
import { useEffect, useMemo, useState } from "react"
import * as jobsApi from "../api/jobs"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { addJob, updateJob as updateJobThunk } from "../features/jobs/jobsSlice"

const tabOptions = [
  { key: "api", label: "API" },
  { key: "server", label: "Server" },
  { key: "ssl", label: "SSL" },
  { key: "port", label: "Port" },
  { key: "frontend", label: "Frontend" },
]

const intervalOptions = [30, 60, 300, 600]
const frontendIntervals = [300, 600]
const timeoutOptions = [5000, 10000, 15000, 30000]
const commonPorts = [80, 443, 3306, 5432, 6379, 27017]

const isHttpsUrl = (value) => typeof value === "string" && value.startsWith("https://")
const isPlainHost = (value) => typeof value === "string" && value.length > 1 && !/^https?:\/\//i.test(value.trim())

const parseJsonObject = (value) => {
  if (value === undefined || value === null) return undefined
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = JSON.parse(trimmed)
  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("Invalid JSON")
  }
  return parsed
}

const jsonStringSchema = z
  .string()
  .optional()
  .refine((value) => {
    if (!value || !value.trim()) return true
    try {
      parseJsonObject(value)
      return true
    } catch {
      return false
    }
  }, "Invalid JSON")

const buildSchema = (tab) => {
  switch (tab) {
    case "server":
      return z.object({
        type: z.literal("server"),
        title: z.string().trim().min(2, "Title is required").max(50, "Max 50 characters"),
        interval: z.number().int().positive(),
        url: z.string().trim().refine(isHttpsUrl, "URL must start with https://"),
        expectations: z.object({
          status: z.coerce.number().int().min(100).max(599).default(200),
          timeout: z.coerce.number().int().positive().default(10000),
        }),
      })
    case "ssl":
      return z.object({
        type: z.literal("ssl"),
        title: z.string().trim().min(2, "Title is required").max(50, "Max 50 characters"),
        interval: z.literal(86400),
        url: z.string().trim().refine(isHttpsUrl, "URL must start with https://"),
      })
    case "port":
      return z.object({
        type: z.literal("port"),
        title: z.string().trim().min(2, "Title is required").max(50, "Max 50 characters"),
        interval: z.number().int().positive(),
        host: z.string().trim().refine(isPlainHost, "Enter a domain or IP, not a URL"),
        port: z.coerce.number().int().min(1, "Port must be between 1 and 65535").max(65535, "Port must be between 1 and 65535"),
      })
    case "frontend":
      return z.object({
        type: z.literal("frontend"),
        title: z.string().trim().min(2, "Title is required").max(50, "Max 50 characters"),
        interval: z.union([z.literal(300), z.literal(600)]),
        url: z.string().trim().refine(isHttpsUrl, "URL must start with https://"),
        expectations: z.object({
          status: z.coerce.number().int().min(100).max(599).default(200),
          timeout: z.coerce.number().int().refine((value) => timeoutOptions.includes(value), "Invalid timeout"),
          selector: z.string().trim().optional().or(z.literal("")),
          contentMatch: z.string().trim().optional().or(z.literal("")),
          checkConsole: z.coerce.boolean().default(false),
          headless: z.literal(true),
        }),
      })
    case "api":
    default:
      return z.object({
        type: z.literal("api"),
        title: z.string().trim().min(2, "Title is required").max(50, "Max 50 characters"),
        interval: z.number().int().positive(),
        url: z.string().trim().refine(isHttpsUrl, "URL must start with https://"),
        expectations: z.object({
          status: z.coerce.number().int().min(100).max(599).default(200),
          timeout: z.coerce.number().int().positive().default(5000),
          body: jsonStringSchema,
        }),
      })
  }
}

const buildDefaults = (tab) => {
  switch (tab) {
    case "server":
      return { type: "server", title: "", interval: 60, url: "", expectations: { status: 200, timeout: 10000 } }
    case "ssl":
      return { type: "ssl", title: "", interval: 86400, url: "" }
    case "port":
      return { type: "port", title: "", interval: 60, host: "", port: 443 }
    case "frontend":
      return {
        type: "frontend",
        title: "",
        interval: 300,
        url: "",
        expectations: {
          status: 200,
          timeout: 15000,
          selector: "",
          contentMatch: "",
          checkConsole: false,
          headless: true,
        },
      }
    case "api":
    default:
      return { type: "api", title: "", interval: 60, url: "", expectations: { status: 200, timeout: 5000, body: "" } }
  }
}

const fieldError = (errors, path) => {
  const parts = path.split(".")
  let current = errors
  for (const part of parts) {
    current = current?.[part]
  }
  return current?.message
}

const TextField = ({ label, error, children }) => (
  <div>
    <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-text-muted">{label}</label>
    {children}
    {error ? <p className="mt-1 text-xs text-status-error">{error}</p> : null}
  </div>
)

const AddMonitorPage = () => {
  const { id: editId } = useParams()
  const isEditMode = Boolean(editId)
  const [activeTab, setActiveTab] = useState("api")
  const [jsonBlurError, setJsonBlurError] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const schema = useMemo(() => buildSchema(activeTab), [activeTab])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    shouldUnregister: true,
    defaultValues: buildDefaults(activeTab),
  })

  const intervalValue = watch("interval")
  const bodyValue = watch("expectations.body") ?? ""
  const urlValue = watch("url") ?? ""
  const isValidHttps = isHttpsUrl(urlValue)

  // Fetch existing job data when in edit mode
  useEffect(() => {
    if (!isEditMode || !editId) return
    setEditLoading(true)
    jobsApi
      .getJobById(editId)
      .then((res) => {
        const job = res?.data ?? res
        if (!job) return
        const type = job.type || "api"
        setActiveTab(type)
        const defaults = buildDefaults(type)
        const formValues = { ...defaults, ...job }
        if (type === "api" && job.expectations?.body && typeof job.expectations.body === "object") {
          formValues.expectations = { ...formValues.expectations, body: JSON.stringify(job.expectations.body, null, 2) }
        }
        // Defer reset so schema useMemo updates with new activeTab first
        setTimeout(() => {
          reset(formValues)
          setValue("interval", job.interval, { shouldValidate: true, shouldDirty: false })
        }, 0)
      })
      .catch(() => toast.error("Failed to load monitor data"))
      .finally(() => setEditLoading(false))
  }, [editId, isEditMode])

  useEffect(() => {
    if (isEditMode) return // Don't reset form on tab change in edit mode after initial load
    reset(buildDefaults(activeTab))
    setJsonBlurError("")
    clearErrors()
    if (activeTab === "ssl") {
      setValue("interval", 86400, { shouldValidate: true, shouldDirty: false })
    }
    if (activeTab === "frontend") {
      setValue("expectations.headless", true, { shouldValidate: true, shouldDirty: false })
    }
  }, [activeTab, clearErrors, reset, isEditMode])

  const applyInterval = (interval) => {
    setValue("interval", interval, { shouldValidate: true, shouldDirty: true })
  }

  const onJsonBlur = () => {
    if (!bodyValue?.trim()) {
      setJsonBlurError("")
      clearErrors("expectations.body")
      return
    }

    try {
      parseJsonObject(bodyValue)
      setJsonBlurError("")
      clearErrors("expectations.body")
    } catch {
      setJsonBlurError("Invalid JSON")
      setError("expectations.body", { type: "validate", message: "Invalid JSON" })
    }
  }

  const buildPayload = (values) => {
    switch (values.type) {
      case "server":
        return {
          title: values.title.trim(),
          type: "server",
          url: values.url.trim(),
          interval: Number(values.interval),
          expectations: {
            status: Number(values.expectations.status),
            timeout: Number(values.expectations.timeout || 10000),
          },
        }
      case "ssl":
        return {
          title: values.title.trim(),
          type: "ssl",
          url: values.url.trim(),
          interval: 86400,
        }
      case "port":
        return {
          title: values.title.trim(),
          type: "port",
          host: values.host.trim(),
          port: Number(values.port),
          interval: Number(values.interval),
        }
      case "frontend": {
        const selector = values.expectations.selector?.trim()
        const contentMatch = values.expectations.contentMatch?.trim()
        return {
          title: values.title.trim(),
          type: "frontend",
          url: values.url.trim(),
          interval: Number(values.interval),
          expectations: {
            status: Number(values.expectations.status),
            timeout: Number(values.expectations.timeout),
            selector: selector || undefined,
            contentMatch: contentMatch || undefined,
            checkConsole: Boolean(values.expectations.checkConsole),
            headless: true,
          },
        }
      }
      case "api":
      default: {
        const parsedBody = values.expectations.body?.trim() ? parseJsonObject(values.expectations.body) : undefined
        return {
          title: values.title.trim(),
          type: "api",
          url: values.url.trim(),
          interval: Number(values.interval),
          expectations: {
            status: Number(values.expectations.status),
            timeout: Number(values.expectations.timeout || 5000),
            ...(parsedBody ? { body: parsedBody } : {}),
          },
        }
      }
    }
  }

  const onSubmit = async (values) => {
    try {
      const payload = buildPayload(values)
      if (isEditMode) {
        const updatedRes = await jobsApi.updateJob(editId, payload)
        const updatedJob = updatedRes?.data ?? updatedRes
        dispatch(updateJobThunk.fulfilled(updatedJob, "", { id: editId,  payload }))
        navigate("/dashboard/monitors")
        toast.success("Monitor updated")
      } else {
        const createdJobResponse = await jobsApi.createJob(payload)
        const createdJob = createdJobResponse?.data ?? createdJobResponse
        dispatch(addJob(createdJob))
        navigate("/dashboard/monitors")
        toast.success("Monitor created")
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unknown error"
      toast.error(`Failed to ${isEditMode ? "update" : "create"} monitor: ${message}`)
    }
  }

  const renderTabs = () => (
    <div className="flex flex-wrap gap-2">
      {tabOptions.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key)}
          className={`rounded-btn border px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
            activeTab === tab.key
              ? "bg-primary text-text-inverse border-primary"
              : "border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40 hover:bg-bg-elevated"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )

  const renderSharedFields = () => (
    <>
      <TextField label="Title" error={fieldError(errors, "title")}>
        <input
          {...register("title")}
          type="text"
          placeholder="Production API"
          className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
        />
      </TextField>

      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-text-muted">Interval</label>
        {activeTab === "ssl" ? (
          <div className="rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-secondary">
            86400 seconds (daily)
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {(activeTab === "frontend" ? frontendIntervals : intervalOptions).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => applyInterval(value)}
                className={`rounded-card border px-3 py-3 font-mono text-sm transition ${
                  Number(intervalValue) === value
                    ? "bg-primary text-text-inverse border-primary"
                    : "border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40"
                }`}
              >
                {value}s
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )

  const renderUrlField = () => (
    <TextField label="URL" error={fieldError(errors, "url")}>
      <div className="relative">
        <input
          {...register("url")}
          type="url"
          placeholder="https://example.com"
          className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 pr-10 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
        />
        {isValidHttps ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm text-status-success">✓</span>
        ) : null}
      </div>
    </TextField>
  )

  const renderTabBody = () => {
    switch (activeTab) {
      case "server":
        return (
          <div className="space-y-5">
            {renderUrlField()}
            <TextField label="Expected status" error={fieldError(errors, "expectations.status")}>
              <input
                {...register("expectations.status", { valueAsNumber: true })}
                type="number"
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>
          </div>
        )
      case "ssl":
        return <div className="space-y-5">{renderUrlField()}</div>
      case "port":
        return (
          <div className="space-y-5">
            <TextField label="Host" error={fieldError(errors, "host")}>
              <input
                {...register("host")}
                type="text"
                placeholder="api.example.com"
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>

            <TextField label="Port" error={fieldError(errors, "port")}>
              <div className="space-y-3">
                <input
                  {...register("port", { valueAsNumber: true })}
                  type="number"
                  placeholder="443"
                  className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
                />
                <div className="flex flex-wrap gap-2">
                  {commonPorts.map((port) => (
                    <button
                      key={port}
                      type="button"
                      onClick={() => setValue("port", port, { shouldValidate: true, shouldDirty: true })}
                      className="rounded-card border border-bg-border bg-bg-base px-3 py-2 font-mono text-xs text-text-muted hover:text-text-secondary hover:border-primary/40 transition"
                    >
                      {port}
                    </button>
                  ))}
                </div>
              </div>
            </TextField>
          </div>
        )
      case "frontend":
        return (
          <div className="space-y-5">
            {renderUrlField()}
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-text-muted">Interval</label>
              <div className="grid grid-cols-2 gap-2">
                {frontendIntervals.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyInterval(value)}
                    className={`rounded-card border px-3 py-3 font-mono text-sm transition ${
                      Number(intervalValue) === value
                        ? "bg-primary text-text-inverse border-primary"
                        : "border-bg-border bg-bg-base text-text-muted hover:text-text-secondary hover:border-primary/40"
                    }`}
                  >
                    {value}s
                  </button>
                ))}
              </div>
            </div>

            <TextField label="Expected status" error={fieldError(errors, "expectations.status")}>
              <input
                {...register("expectations.status", { valueAsNumber: true })}
                type="number"
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>

            <TextField label="Timeout (ms)" error={fieldError(errors, "expectations.timeout")}>
              <select
                {...register("expectations.timeout", { valueAsNumber: true })}
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              >
                {timeoutOptions.map((timeout) => (
                  <option key={timeout} value={timeout} className="bg-bg-base text-text-primary">
                    {timeout}ms
                  </option>
                ))}
              </select>
            </TextField>

            <TextField label="Selector" error={fieldError(errors, "expectations.selector")}>
              <input
                {...register("expectations.selector")}
                type="text"
                placeholder="#root"
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>

            <TextField label="Content match" error={fieldError(errors, "expectations.contentMatch")}>
              <input
                {...register("expectations.contentMatch")}
                type="text"
                placeholder="Welcome back"
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>

            <div className="flex items-center justify-between rounded-card border border-bg-border bg-bg-base px-4 py-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-text-muted">Check console</div>
                <div className="mt-1 font-mono text-xs text-text-muted">Capture browser console errors while checking the page.</div>
              </div>
              <input {...register("expectations.checkConsole")} type="checkbox" className="h-4 w-4 accent-primary" />
            </div>

            <div className="flex items-center justify-between rounded-card border border-bg-border bg-bg-base px-4 py-3 opacity-80">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-text-muted">Headless</div>
                <div className="mt-1 font-mono text-xs text-text-muted">Always enabled for frontend checks.</div>
              </div>
              <div className="rounded-card border border-bg-border px-3 py-2 font-mono text-xs text-text-secondary">true</div>
              <input type="hidden" {...register("expectations.headless")} value="true" />
            </div>
          </div>
        )
      case "api":
      default:
        return (
          <div className="space-y-5">
            {renderUrlField()}
            <TextField label="Expected status" error={fieldError(errors, "expectations.status")}>
              <input
                {...register("expectations.status", { valueAsNumber: true })}
                type="number"
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>

            <TextField label="Expected body (JSON)" error={jsonBlurError || fieldError(errors, "expectations.body")}>
              <textarea
                {...register("expectations.body")}
                onBlur={onJsonBlur}
                rows={6}
                placeholder='{"ok": true}'
                className="w-full rounded-card border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-primary placeholder-text-muted/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
              />
            </TextField>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="flex min-h-screen">
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-btn border border-bg-border bg-bg-base px-3 py-2 font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-semibold text-text-primary">{isEditMode ? "Edit monitor" : "Create monitor"}</h1>
              </div>
            </div>

            <div className="rounded-card border border-bg-border bg-bg-base p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" {...register("type")} value={activeTab} />
                {renderTabs()}
                {renderSharedFields()}
                {renderTabBody()}

                <div className="flex gap-3">
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 rounded-btn border border-bg-border bg-bg-base px-4 py-3 font-mono text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || editLoading}
                    className="flex-1 rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-4 py-3 font-mono text-sm text-text-inverse shadow-glow-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update monitor" : "Create monitor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddMonitorPage