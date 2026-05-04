
import { Link } from 'react-router-dom'
import {legalLinks, navColumns, socialLinks} from "../../assets/data.jsx";

const Footer = () => {
    return (
        <>
            <footer className="bg-bg-base pt-20 px-4">
                <div className="bg-bg-base/60 w-full max-w-337.5 mx-auto text-text-primary pt-8 lg:pt-12 px-4 sm:px-8 md:px-16 lg:px-28 rounded-tl-3xl rounded-tr-3xl overflow-hidden border-t border-bg-border">

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12">

                        {/* Brand Column */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Logo - Premium Hover */}
                            <Link to="/" className="flex items-center gap-2 group">
                                       <img
                                         src="/logo.png"
                                         alt="Checker Logo"
                                         className="h-14 w-auto group-hover:opacity-90 transition-opacity"
                                       />
                                     </Link>

                            {/* Tagline */}
                            <p className="text-sm/6 text-text-muted max-w-96">
                                Real-time monitoring for APIs, servers, ports, SSL & frontend apps.
                                AI-powered incident summaries that help you debug faster — not just alert louder.
                            </p>



                            {/* Social Links - Mapped with Premium Hover */}
                            <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="text-text-muted hover:text-primary transition group"
                                        aria-label={social.ariaLabel}
                                        rel="noopener noreferrer"
                                    >
                                        <span className="group-hover:scale-110 transition-transform inline-block">
                                            {social.icon}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Columns - Mapped */}
                        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-20 items-start">
                            {navColumns.map((column) => (
                                <div key={column.title} className={column.isWide ? 'col-span-2 md:col-span-1' : ''}>
                                    <h3 className="font-medium text-sm mb-4 text-text-secondary">{column.title}</h3>
                                    <ul className="space-y-3 text-sm text-text-muted">
                                        {column.links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    to={link.href}
                                                    className="hover:text-primary transition relative inline-block group"
                                                >
                                                    {link.label}
                                                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Bar - Premium Divider */}
                    <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-bg-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-text-muted/70 text-sm">
                            © {new Date().getFullYear()} Checker Monitoring. Built for engineers.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="text-text-muted/70 hover:text-primary transition"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Decorative Brand Mark - Orange Glow */}
                    <div className="relative mt-8">
                        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-primary/10 rounded-full blur-[170px] pointer-events-none"/>
                        <h3 className="text-center font-extrabold leading-[0.7] text-transparent text-[clamp(3rem,15vw,15rem)] [-webkit-text-stroke:1px_rgba(251,146,60,0.3)] mt-6 select-none">
                            CHECKAR
                        </h3>
                    </div>


                </div>
            </footer>
        </>
    )
}

export default Footer