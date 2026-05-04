// src/pages/SettingsPage.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  clearUser,
  logoutUser,
  updateUserProfile,
} from "../features/auth/authSlice";

const schema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
});

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "" },
  });

  useEffect(() => {
    const firstName = user?.name?.firstName ?? user?.firstName ?? "";
    const lastName = user?.name?.lastName ?? user?.lastName ?? "";
    reset({ firstName, lastName });
  }, [reset, user]);

  const initials = [user?.name?.firstName?.[0], user?.name?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(clearUser());
      toast.success("Signed out successfully");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-bg-base p-6 text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <div className="mb-4 text-xs font-mono uppercase tracking-widest text-text-muted">
            Settings
          </div>
          <h1 className="text-3xl font-semibold text-text-primary">
            Profile and preferences
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Update your profile, notification preferences, and session controls.
          </p>
        </div>

        {/* Profile Card - Unified Dark */}
        <div className="rounded-card border border-bg-border bg-bg-base p-6">
          {/* Avatar + Info Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-text-muted">
                Personal information
              </div>
              <div className="mt-2 text-sm text-text-secondary">
                Manage your public profile and account identity.
              </div>
            </div>
            <div
              className="flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-semibold text-primary
  h-8 w-8 text-xs p-2
  sm:h-12 sm:w-12 sm:text-sm p-0
  md:h-14 md:w-14 md:text-base
  lg:h-16 lg:w-16 lg:text-xl
"
            >
              {initials || "AD"}
            </div>
          </div>

          {/* User Display Name + Email */}
          <div className="text-sm font-mono text-text-primary">
            {user?.name?.firstName || "Admin"} {user?.name?.lastName || "User"}
          </div>
          <div className="mt-1 text-xs text-text-muted">{user?.email}</div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-text-muted">
                  First name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full rounded-card border border-bg-border bg-bg-base px-3 py-2 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-status-error">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-text-muted">
                  Last name
                </label>
                <input
                  {...register("lastName")}
                  className="w-full rounded-card border border-bg-border bg-bg-base px-3 py-2 text-sm text-text-primary placeholder-text-muted/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-status-error">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <div className="mb-2 text-xs font-mono uppercase tracking-widest text-text-muted">
                Email address (read-only)
              </div>
              <input
                value={user?.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-card border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-text-muted opacity-70 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-btn bg-primary hover:bg-primary-hover active:bg-primary-active transition px-4 py-2 text-sm font-mono text-text-inverse shadow-glow-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-btn border border-bg-border bg-bg-base px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-bg-elevated transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Danger Zone - Unified Dark */}
          <div className="mt-8 space-y-6 border-t border-bg-border pt-6">
            <div className="rounded-card border border-status-error/30 bg-status-error/5 p-4">
              <div className="mb-4 text-xs font-mono uppercase tracking-widest text-status-error">
                Danger zone
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-text-primary">
                    Sign out of this session
                  </div>
                  <div className="text-xs text-text-muted">
                    This clears your server session and returns you to the
                    homepage.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-btn border border-status-error/50 bg-status-error/10 px-4 py-2 text-sm text-status-error hover:bg-status-error/20 transition"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
