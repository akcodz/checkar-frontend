import {faqs} from "../../assets/data.jsx";

const FaqSection = () => {
    const mid = Math.ceil(faqs.length / 2)
    const columns = [faqs.slice(0, mid), faqs.slice(mid)]

    return (
        <>

            <section id="faq" className="bg-bg-base w-full flex flex-col items-center justify-center py-20 px-4">
                <div className="w-full max-w-5xl">

                    {/* Section Header */}
                    <div className="mb-14 text-center">
                        <h2 className="text-3xl md:text-5xl font-semibold text-text-primary mt-5 mb-4 leading-tight">
                            Questions, <span className="text-primary">Answered</span>
                        </h2>
                        <p className="text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
                            Everything you need to know about deploying, configuring, and scaling Checker
                            for your infrastructure. Can't find what you're looking for?{" "}
                            <a href="#contact" className="text-primary hover:text-primary-hover transition">Reach out</a>.
                        </p>
                    </div>

                    {/* Hidden Radio for Accordion Fallback */}
                    <input id="faq-none" name="faq-accordion" type="radio" className="hidden" defaultChecked />

                    {/* FAQ Grid - Two Column on Desktop */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                        {columns.map((column, columnIndex) => (
                            <div key={columnIndex} className="space-y-4">
                                {column.map((faq, index) => (
                                    <details
                                        key={index}
                                        name="faq-accordion"
                                        className="group relative rounded-card overflow-hidden
                                                 hover:-translate-y-0.5 transition-all duration-500
                                                 /* Premium Fading Border Effect */
                                                 before:absolute before:inset-0 before:rounded-card before:p-[1.5px]
                                                 before:bg-linear-to-b before:from-primary/30 before:via-primary/8 before:via-25% before:to-transparent
                                                 before:opacity-20 group-open:before:opacity-70 before:hover:opacity-70
                                                 before:transition-opacity before:duration-500 before:pointer-events-none
                                                 /* Inner Highlight */
                                                 after:absolute after:inset-0 after:rounded-card after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]
                                                 after:pointer-events-none"
                                    >
                                        {/* Subtle Corner Glows on Open */}
                                        <div className="absolute -inset-px rounded-card opacity-0 group-open:opacity-100 transition-opacity duration-500 pointer-events-none">
                                            <div className="absolute top-0 left-0 w-10 h-10 bg-linear-to-br from-primary/12 to-transparent rounded-tl-card blur-lg" />
                                            <div className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-tl from-primary/8 to-transparent rounded-br-card blur-lg" />
                                        </div>

                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden relative z-10">
                                            <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                                                {faq.question}
                                            </span>
                                            <div className="shrink-0 rounded p-1 text-text-muted transition-colors group-hover:text-primary group-open:text-primary">
                                                {/* Plus Icon (Closed) */}
                                                <svg className="block group-open:hidden" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14" /><path d="M12 5v14" />
                                                </svg>
                                                {/* Minus Icon (Open) */}
                                                <svg className="hidden group-open:block" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14" />
                                                </svg>
                                            </div>
                                        </summary>

                                        {/* Animated Content Reveal */}
                                        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-open:grid-rows-[1fr] group-open:opacity-100">
                                            <div className="overflow-hidden relative z-10">
                                                <p className="px-4 pb-4 text-sm leading-relaxed text-text-muted">
                                                    {faq.answer}
                                                </p>

                                                {/* Tech Badge for Architecture Questions - Orange Palette */}
                                                {faq.question.toLowerCase().includes("architecture") && (
                                                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                                                        <span className="mono text-[10px] px-2 py-0.5 rounded border border-bg-border bg-bg-surface/40 text-text-muted">MERN</span>
                                                        <span className="mono text-[10px] px-2 py-0.5 rounded border border-bg-border bg-bg-surface/40 text-text-muted">Redis</span>
                                                        <span className="mono text-[10px] px-2 py-0.5 rounded border border-bg-border bg-bg-surface/40 text-text-muted">BullMQ</span>
                                                        <span className="mono text-[10px] px-2 py-0.5 rounded border border-bg-border bg-bg-surface/40 text-text-muted">Puppeteer</span>
                                                        <span className="mono text-[10px] px-2 py-0.5 rounded border border-bg-border bg-bg-surface/40 text-text-muted">Docker</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}

export default FaqSection