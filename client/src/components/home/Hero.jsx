import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const isLoggedIn = Boolean(isAuthenticated);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header className="relative flex flex-col items-center bg-bg-base text-text-primary px-4 overflow-hidden">
        <nav className="mx-auto z-50 flex w-full max-w-310 items-center justify-between py-4 md:px-6 lg:px-10 backdrop-blur">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Checker Logo"
              className="h-10 w-auto group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Nav - Mapped */}
          <div className="hidden md:flex items-center gap-8 transition duration-500 border border-bg-border bg-bg-surface/60 px-6 py-2.5 rounded-full backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Primary CTA - Orange */}
          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            <button className="hidden md:block bg-primary hover:bg-primary-hover active:bg-primary-active transition px-5 py-2 text-sm font-medium text-text-inverse rounded-full cursor-pointer shadow-glow-orange/30">
              {isLoggedIn ? "Go to Dashboard" : "Start Monitoring Free"}
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="open-menu"
            onClick={() => setMobileOpen(true)}
            className="md:hidden active:scale-90 transition p-2 text-text-secondary hover:text-text-primary"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Nav Overlay - Mapped Links */}
        <div
          aria-hidden={!mobileOpen}
          className={`fixed inset-0 z-40 bg-bg-base/95 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-text-secondary hover:text-text-primary transition"
            >
              {link.label}
            </Link>
          ))}

          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            onClick={() => setMobileOpen(false)}
          >
            <button className="mt-4 bg-primary hover:bg-primary-hover transition px-6 py-2.5 text-sm font-medium text-text-inverse rounded-full">
              {isLoggedIn ? "Go to Dashboard" : "Start Free"}
            </button>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 p-2 text-text-muted hover:text-text-primary transition"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* NEW Badge - AI Incident Summaries - Orange Theme */}
        <div
          
          className="flex items-center gap-2 rounded-full border border-primary/30 bg-bg-surface/40 pl-1.5 pr-3 py-1 mt-24 md:mt-32 hover:border-primary/50 transition"
        >
          <span className="bg-primary/20 text-primary text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-primary/40">
            NEW
          </span>
          <span className="text-[13px] text-text-secondary">
            AI-powered incident summaries →
          </span>
        </div>

        {/* Hero Headline - PPT-Aligned */}
        <h1 className="text-center text-4xl leading-tight md:text-6xl mt-4 font-semibold max-w-3xl">
          Stop Guessing. <span className="text-primary">Start Knowing.</span>
        </h1>

        {/* Subheadline - Clear Value Prop */}
        <p className="text-center text-text-muted text-base md:text-lg max-w-170 mt-4 leading-relaxed">
          Real-time monitoring for APIs, servers, ports, SSL & frontend apps.
          Detect downtime, group related failures, and get AI-powered incident
          summaries that actually help you debug faster.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link to="/login">
            {" "}
            <button className="bg-primary hover:bg-primary-hover active:bg-primary-active transition px-7 py-3 text-sm font-medium text-text-inverse rounded-full cursor-pointer w-full sm:w-auto shadow-glow-orange/20">
              Start Monitoring Free
            </button>
          </Link>
          <button className="border border-bg-border bg-bg-surface/60 hover:bg-bg-elevated transition rounded-full px-7 py-3 text-sm font-medium text-text-secondary cursor-pointer w-full sm:w-auto">
            View Live Demo
          </button>
        </div>

        {/* Dashboard Preview with Enhanced Shadow */}
        <div className="relative mx-auto mt-16 w-full max-w-7xl md:px-6 lg:px-10">
          <div className="relative mx-auto w-full max-w-5xl">
            {/* Dashboard Container with Animated Glow */}
            <div className="relative mx-auto w-full max-w-5xl">
              {/* Animated Background Glow */}
              <div
                className="
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-[110%] h-[110%] max-h-100
    bg-linear-to-br from-primary/20 via-primary/5 to-transparent
    blur-[80px] opacity-60 z-0
    animate-pulse-slow
    pointer-events-none
  "
              ></div>

              {/* Dashboard Image */}
              <img
                className="
      relative z-10 max-h-64 w-full object-cover object-top
      border border-bg-border rounded-lg
      md:max-h-80 lg:max-h-96
      shadow-[0_8px_30px_rgb(0,0,0,0.12)]
      shadow-orange-500/20
      drop-shadow-[0_0_35px_rgba(251,146,60,0.25)]
      drop-shadow-[0_0_80px_rgba(251,146,60,0.15)]
      transition-shadow duration-500
      hover:drop-shadow-[0_0_45px_rgba(251,146,60,0.35)]
    "
    src="hero.png"
                alt="Checker dashboard showing real-time API monitoring, incident alerts, and AI-powered root cause analysis"
              />
            </div>

            {/* Bottom Fade Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-bg-base to-transparent z-10 pointer-events-none"></div>

            {/* Floating Status Card - Demo Teaser - Responsive + Orange Palette */}
            <div
              className="hidden
                            absolute -bottom-6 sm:-bottom-4 left-1/2 -translate-x-1/2
                            bg-bg-surface/90 border border-bg-border rounded-lg
                            px-3 py-2.5 sm:px-4 sm:py-3
                            sm:flex items-center justify-center gap-2.5 sm:gap-3
                            backdrop-blur-sm z-20
                            w-[92%] sm:w-auto max-w-xs sm:max-w-none
                            shadow-lg shadow-status-error/20
                        "
            >
              {/* Animated Alert Dot - Error State */}
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-error"></span>
              </span>

              {/* Alert Text - Responsive Typography */}
              <span className="text-[11px] sm:text-xs text-text-secondary leading-tight sm:leading-normal text-center sm:text-left">
                <span className="font-medium text-status-error">Alert:</span>{" "}
                <span className="hidden sm:inline">
                  API latency spike detected → AI analyzing...
                </span>
                <span className="sm:hidden">
                  Latency spike → AI analyzing...
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Hero;
