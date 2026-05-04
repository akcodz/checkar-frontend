import {testimonials} from "../../assets/data.jsx";

const TestimonialSection = () => {
    const columns = [
        { start: 0, end: 3, className: "animate-scroll-up-1" },
        { start: 3, end: 6, className: "hidden md:block animate-scroll-up-2" },
        { start: 6, end: 9, className: "hidden lg:block animate-scroll-up-3" }
    ]

    const renderCard = (testimonial, index) => (
        <div
            key={`${testimonial.id}-${index}`}
            className="group relative bg-bg-base rounded-card p-6 mb-4
                     hover:-translate-y-1 transition-all duration-500 cursor-default
                     /* Premium Fading Border Effect */
                     before:absolute before:inset-0 before:rounded-card before:p-[1.5px]
                     before:bg-linear-to-b before:from-primary/30 before:via-primary/8 before:via-25% before:to-transparent
                     before:opacity-20 hover:before:opacity-70
                     before:transition-opacity before:duration-500 before:pointer-events-none
                     /* Inner Highlight */
                     after:absolute after:inset-0 after:rounded-card after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]
                     after:pointer-events-none"
        >
            {/* Subtle Corner Glows */}
            <div className="absolute -inset-px rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-10 h-10 bg-linear-to-br from-primary/12 to-transparent rounded-tl-card blur-lg" />
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-tl from-primary/8 to-transparent rounded-br-card blur-lg" />
            </div>

            {/* Quote Icon - Orange Primary */}
            <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13.056c.464 0 .91-.131 1.237-.364.329-.234.513-.55.513-.88v-3.73c0-.33-.184-.647-.513-.88C7.91 6.97 7.464 6.838 7 6.838c-.232 0-.455-.066-.619-.182-.164-.117-.256-.275-.256-.44v-.622c0-.33.184-.646.513-.879.328-.233.773-.364 1.237-.364.232 0 .455-.066.619-.182.164-.117.256-.275.256-.44V2.485c0-.165-.092-.323-.256-.44a1.1 1.1 0 0 0-.619-.181c-1.392 0-2.728.393-3.712 1.092-.985.7-1.538 1.649-1.538 2.638v6.218c0 .33.184.646.513.88.328.233.773.364 1.237.364zm9.83 0c.465 0 .91-.131 1.238-.364.328-.234.513-.55.513-.88v-3.73c0-.33-.184-.647-.513-.88-.328-.233-.773-.364-1.237-.364-.232 0-.455-.066-.619-.182-.164-.117-.256-.275-.256-.44v-.622c0-.33.184-.646.512-.879.329-.233.774-.364 1.238-.364.232 0 .454-.066.619-.182.164-.117.256-.275.256-.44V2.485c0-.165-.092-.323-.256-.44a1.1 1.1 0 0 0-.62-.181c-1.391 0-2.727.393-3.711 1.092-.985.7-1.538 1.649-1.538 2.638v6.218c0 .33.184.646.512.88.329.233.774.364 1.238.364z" stroke="currentColor" className="text-primary" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* Testimonial Text */}
            <p className="text-sm text-text-muted mb-5 leading-relaxed group-hover:text-text-secondary transition-colors">
                "{testimonial.description}"
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="size-10 rounded-full border border-bg-border ring-2 ring-bg-base/50"
                />
                <div>
                    <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-muted">{testimonial.company}</p>
                    {/* Role Badge - Orange Theme */}
                    <span className="inline-block mt-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/30">
                        {testimonial.role}
                    </span>
                </div>
            </div>

            {/* Hover Indicator - Premium Reveal */}
            <div className="mt-4 pt-3 border-t border-bg-border/60 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0.5 group-hover:translate-y-0">
                <span className="text-xs text-primary/90 mono flex items-center gap-1">
                    View incident example
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
            </div>
        </div>
    )

    return (
        <>
            <style>
                {`
                    @keyframes scroll-up {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    .animate-scroll-up-1 { animation: scroll-up 25s linear infinite; }
                    .animate-scroll-up-2 { animation: scroll-up 30s linear infinite; }
                    .animate-scroll-up-3 { animation: scroll-up 20s linear infinite; }
                    
                    /* Pause animation on hover for readability */
                    .group:hover [class*="animate-scroll-up"] {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <section id="testimonials" className="bg-bg-base flex flex-col items-center justify-center py-20 px-4">

                {/* Section Header */}
                <div className="text-center mb-14 max-w-3xl">
                    <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 border border-primary/30 rounded-full">
                        Trusted by Engineers
                    </span>
                    <h2 className="text-3xl md:text-5xl font-semibold text-text-primary mt-5 mb-4 leading-tight">
                        Built for Teams Who <span className="text-primary">Ship & Sleep Well</span>
                    </h2>
                    <p className="text-base text-text-muted leading-relaxed">
                        Real feedback from developers, SREs, and engineering leaders using Checker
                        to monitor APIs, servers, and frontend apps — with AI that helps, not hypes.
                    </p>
                </div>

                {/* Scrolling Testimonials Grid */}
                <div className="relative w-full max-w-6xl overflow-hidden">
                    {/* Fade Masks - Dark Base */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-bg-base to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-bg-base to-transparent z-10 pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-160 overflow-hidden">
                        {columns.map((col, colIndex) => (
                            <div key={colIndex} className={col.className}>
                                {[...testimonials.slice(col.start, col.end), ...testimonials.slice(col.start, col.end)].map((testimonial, index) =>
                                    renderCard(testimonial, index)
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA + Social Proof */}
                <div className="mt-16 text-center">
                    <p className="text-text-muted text-sm mb-6">
                        Join 500+ engineering teams reducing alert fatigue with Checker
                    </p>
                </div>
            </section>
        </>
    )
}

export default TestimonialSection