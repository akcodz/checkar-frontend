import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
	RiMailLine,
	RiLockLine,
	RiEyeLine,
	RiEyeOffLine,
	RiGoogleFill,
	RiAlertLine
} from '@remixicon/react'
import { validateLoginForm, hasErrors, getFirstError } from '../utils/formValidation'
import { googleLogin, loginUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [errors, setErrors] = useState({})
	const navigate = useNavigate()
	const dispatch = useDispatch()
	// Consolidated form state - matches validation utility expectations
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate using utility
		const validationErrors = validateLoginForm(formData);

		if (hasErrors(validationErrors)) {
			setErrors(validationErrors);

			const firstError = getFirstError(validationErrors);

			if (firstError) {
				toast.error(firstError);
			}

			return;
		}

		try {

			const user = await dispatch(
				loginUser({
					email: formData.email,
					password: formData.password,
				})
			).unwrap();

			const displayName =
				user?.name?.firstName ||
				user?.firstName ||
				user?.email ||
				"there";

			toast.success(`Welcome back, ${displayName}!`);

		
				navigate("/dashboard");
			

		} catch (error) {
			toast.error(
				typeof error === "string"
					? error
					: error?.message || "Login failed. Please check your credentials."
			);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))

		// Clear error for this field as user types
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: null }))
		}
	}

	// const handleSocialLogin = async () => {
	// 	try {
	// 		await dispatch(googleLogin()).unwrap();

	// 	} catch (error) {
	// 		console.error("Google login failed:", error);
	// 	}
	// };

	return (
		<div className="min-h-screen bg-bg-base flex">

			{/* Left Side - Brand Visual (Hidden on Mobile) */}
			<div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-bg-surface">
				{/* Animated Gradient Background */}
				<div className="absolute inset-0 bg-linear-to-br from-primary/10 via-bg-base to-bg-base" />

				{/* Decorative Glow Orbs */}
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
				<div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-status-ai/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />

				{/* Brand Content */}
				<div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
					{/* Logo */}
					<div className="flex items-center gap-3 mb-8">
						<svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 11.3l6.75 3.884 6.75-3.885M8 34.58v-7.755L1.25 22.94m27 0-6.75 3.885v7.754" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M1.655 15.408l13.095 7.546 13.095-7.546M14.75 38V22.939" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" />
						</svg>
						<span className="text-2xl font-semibold text-text-primary">Checker</span>
					</div>

					{/* Hero Message - PPT Aligned */}
					<h1 className="text-3xl lg:text-4xl font-semibold text-text-primary leading-tight mb-4">
						Monitor smarter. <br />
						<span className="text-primary">Debug faster.</span>
					</h1>

					<p className="text-text-muted text-base leading-relaxed mb-8 max-w-md">
						Real-time monitoring for APIs, servers, and frontend apps — with AI-powered incident summaries that cut debugging time by 60%.
					</p>

					{/* Feature Badges */}
					<div className="flex flex-wrap gap-3">
						<span className="inline-flex items-center gap-2 text-xs text-text-muted bg-bg-surface/60 border border-bg-border rounded-full px-3 py-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-status-success" />
							99.99% Uptime Tracking
						</span>
						<span className="inline-flex items-center gap-2 text-xs text-text-muted bg-bg-surface/60 border border-bg-border rounded-full px-3 py-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-status-ai" />
							AI Incident Insights
						</span>
						<span className="inline-flex items-center gap-2 text-xs text-text-muted bg-bg-surface/60 border border-bg-border rounded-full px-3 py-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-primary" />
							Zero Alert Fatigue
						</span>
					</div>
				</div>

				{/* Bottom Decorative Brand Mark */}
				<div className="absolute bottom-8 left-0 right-0 text-center">
					<span className="text-text-muted/40 mono text-xs">
						Built for Hackathon 2026 • MERN + Redis + BullMQ + Gemini AI
					</span>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12">

				{/* Mobile Logo */}
				<div className="md:hidden flex items-center gap-2 mb-8">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8 11.3l6.75 3.884 6.75-3.885M8 34.58v-7.755L1.25 22.94m27 0-6.75 3.885v7.754" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M1.655 15.408l13.095 7.546 13.095-7.546M14.75 38V22.939" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" />
					</svg>
					<span className="text-xl font-semibold text-text-primary">Checker</span>
				</div>

				<form onSubmit={handleSubmit} className="md:w-96 w-full max-w-sm flex flex-col">

					{/* Header */}
					<div className="text-center mb-8">
						<h2 className="text-2xl font-semibold text-text-primary">Welcome back</h2>
						<p className="text-text-muted text-sm mt-2">Sign in to access your monitoring dashboard</p>
					</div>

					{/* Social Login - Google Only */}
					{/* <button
						type="button"
						onClick={() => handleSocialLogin('Google')}
						className="flex items-center justify-center gap-3 h-12 rounded-card border border-bg-border bg-bg-surface/60 hover:bg-bg-elevated transition-colors group"
					>
						<RiGoogleFill className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
						<span className="text-sm text-text-secondary">Sign in with Google</span>
					</button> */}

					{/* Divider */}
					{/* <div className="flex items-center gap-4 w-full my-6">
						<div className="flex-1 h-px bg-bg-border" />
						<span className="text-xs text-text-muted whitespace-nowrap">or sign in with email</span>
						<div className="flex-1 h-px bg-bg-border" />
					</div> */}

					{/* Email Input with Error Display */}
					<div className={`relative flex items-center w-full bg-bg-surface/60 border rounded-card h-12 px-4 gap-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all ${errors.email ? 'border-status-error' : 'border-bg-border'}`}>
						<RiMailLine className="w-5 h-5 text-text-muted shrink-0" />
						<input
							type="email"
							name="email"
							placeholder="you@company.com"
							value={formData.email}
							onChange={handleChange}
							className="bg-transparent text-text-primary placeholder-text-muted/60 outline-none text-sm w-full"
							required
							autoComplete="email"
						/>
					</div>
					{errors.email && (
						<p className="text-status-error text-xs mt-1 ml-1 flex items-center gap-1">
							<RiAlertLine className="w-3 h-3" /> {errors.email}
						</p>
					)}

					{/* Password Input with Error Display */}
					<div className={`relative flex items-center w-full bg-bg-surface/60 border rounded-card h-12 px-4 gap-3 mt-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all ${errors.password ? 'border-status-error' : 'border-bg-border'}`}>
						<RiLockLine className="w-5 h-5 text-text-muted shrink-0" />
						<input
							type={showPassword ? 'text' : 'password'}
							name="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							className="bg-transparent text-text-primary placeholder-text-muted/60 outline-none text-sm w-full"
							required
							autoComplete="current-password"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="text-text-muted hover:text-primary transition-colors p-1"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							tabIndex={-1}
						>
							{showPassword ? (
								<RiEyeOffLine className="w-5 h-5" />
							) : (
								<RiEyeLine className="w-5 h-5" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="text-status-error text-xs mt-1 ml-1 flex items-center gap-1">
							<RiAlertLine className="w-3 h-3" /> {errors.password}
						</p>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						className="mt-8 w-full h-12 rounded-card bg-primary hover:bg-primary-hover active:bg-primary-active transition-colors text-text-inverse font-medium text-sm shadow-glow-orange/20"
					>
						Sign in to Dashboard
					</button>

					{/* Sign Up Link */}
					<p className="text-text-muted text-sm mt-6 text-center">
						Don't have an account?{' '}
						<Link to="/register" className="text-primary hover:text-primary-hover transition-colors font-medium">
							Create free account
						</Link>
					</p>

					{/* Security Note */}
					<p className="text-text-muted/60 text-xs text-center mt-8">
						Secured with TLS • No data stored without consent
					</p>
				</form>

				{/* Back to Home Link */}
				<Link to="/" className="mt-8 text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-2">
					<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					Back to homepage
				</Link>
			</div>
		</div>
	)
}