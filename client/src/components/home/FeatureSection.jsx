import React from 'react'
import {featuresData} from "../../assets/data.jsx";

const FeatureSection = () => {
    return (
        <>
            <section id="features" className="py-20 px-4 bg-bg-base flex flex-col justify-center items-center gap-6">
                {/* Headline - PPT Aligned */}
                <h2 className="text-3xl md:text-5xl font-semibold text-text-primary max-w-3xl text-center leading-tight">
                    Everything You Need to <span className="text-primary">Monitor, Detect & Debug</span>
                </h2>

                {/* Subheadline */}
                <p className="text-base text-text-muted max-w-2xl text-center leading-relaxed">
                    From APIs to frontend UI, Checker watches your stack 24/7.
                    Get intelligent alerts, not noise — and ship with confidence.
                </p>

                {/* Feature Grid - Premium Cards with Subtle Fading Border */}
                <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {featuresData.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-bg-base rounded-card p-6 space-y-4
                     hover:-translate-y-1 transition-all duration-500 cursor-default
                     /* Fading Gradient Border - Subtle Top Focus */
                     before:absolute before:inset-0 before:rounded-card before:p-[1.5px]
                     before:bg-linear-to-b before:from-primary/30 before:via-primary/8 before:via-25% before:to-transparent
                     before:opacity-20 hover:before:opacity-70
                     before:transition-opacity before:duration-500 before:pointer-events-none
                     /* Inner Highlight for Depth */
                     after:absolute after:inset-0 after:rounded-card after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]
                     after:pointer-events-none"
                        >
                            {/* Subtle Corner Glows - Reduced Size & Opacity */}
                            <div className="absolute -inset-px rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute top-0 left-0 w-10 h-10 bg-linear-to-br from-primary/12 to-transparent rounded-tl-card blur-lg" />
                                <div className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-tl from-primary/8 to-transparent rounded-br-card blur-lg" />
                            </div>

                            {/* Icon Container - Darker Base, Subtle Hover */}
                            <div className="relative flex items-center justify-center w-12 h-12 rounded-lg
                          bg-bg-elevated border border-white/3
                          group-hover:border-primary/15
                          group-hover:shadow-[0_0_15px_-6px_rgba(251,146,60,0.06)]
                          transition-all duration-500">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="relative font-medium text-lg text-text-primary
                         group-hover:text-primary transition-colors duration-300">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="relative text-sm text-text-muted/80 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Indicator - Smooth Reveal */}
                            <div className="relative pt-2 opacity-0 group-hover:opacity-100
                          transition-all duration-300 translate-y-0.5 group-hover:translate-y-0">
                <span className="text-xs text-primary/90 mono flex items-center gap-1.5">
                    Explore feature
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Secondary Features - "Plus More" */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Dashboard Analytics
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Visual Reporting
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Real-Time WebSockets
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Multi-Channel Alerts
                    </span>
                </div>


            </section>
        </>
    )
}

export default FeatureSection