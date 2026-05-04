// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center rounded-card border border-bg-border bg-bg-base p-8 text-center">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-text-muted">404</div>
          <h1 className="mt-4 text-3xl font-semibold text-text-primary">Page not found</h1>
          <p className="mt-3 text-sm text-text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-8 rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-4 py-2 text-sm font-mono text-text-inverse shadow-glow-orange/20"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage