
import {RiDiscordFill, RiGithubFill, RiLinkedinBoxFill, RiTwitterXFill} from "@remixicon/react";


export const testimonials = [
    {
        id: 1,
        description: "Checker cut our MTTR by 60%. The AI incident summaries point straight to root causes — no more digging through 50 alerts.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60",
        name: "Maya Chen",
        company: "DevOps Lead @ Startup",
        role: "Early Access User"
    },
    {
        id: 2,
        description: "Finally, a monitoring tool that doesn't spam us. Checker groups related failures into one incident. My on-call team actually sleeps now.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
        name: "Raj Patel",
        company: "SRE @ FinTech",
        role: "Beta Tester"
    },
    {
        id: 3,
        description: "The Puppeteer frontend checks caught a broken checkout flow before our users did. Checker pays for itself in one prevented incident.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=60",
        name: "Sophie Laurent",
        company: "Engineering Manager @ E-commerce",
        role: "Early Access User"
    },
    {
        id: 4,
        description: "SSL expiry alerts + port monitoring in one dashboard? And the AI explains WHY the cert failed. This is monitoring done right.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60",
        name: "Alex Rivera",
        company: "Platform Engineer @ Cloud Infra",
        role: "Beta Tester"
    },
    {
        id: 5,
        description: "We replaced 3 tools with Checker. API monitoring, server health, and AI incident reports — all in one place. The BullMQ architecture scales beautifully.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=60",
        name: "Jordan Kim",
        company: "CTO @ DevTools Startup",
        role: "Early Access User"
    },
    {
        id: 6,
        description: "The cron scheduler + queue-backed workers mean we never miss a check. And when things break, the AI summary gets us to a fix in minutes, not hours.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60",
        name: "Taylor Brooks",
        company: "Backend Lead @ SaaS",
        role: "Beta Tester"
    },
    {
        id: 7,
        description: "As a solo founder, I don't have time for alert fatigue. Checker's intelligent grouping + AI explanations let me focus on building, not debugging.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=200&auto=format&fit=crop&q=60",
        name: "Chris Morgan",
        company: "Founder @ Indie Hackers",
        role: "Early Access User"
    },
    {
        id: 8,
        description: "The real-time WebSocket dashboard + ChartJS analytics make incident post-mortems actually useful. We've improved our uptime by 40% in 2 months.",
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=60",
        name: "Priya Sharma",
        company: "Data Engineer @ Analytics Co",
        role: "Beta Tester"
    },
    {
        id: 9,
        description: "Checker's microservices architecture means we can monitor our own microservices without adding overhead. Meta, but it works.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&auto=format&fit=crop&q=60",
        name: "Marcus Johnson",
        company: "Infrastructure @ Scale-up",
        role: "Early Access User"
    }
]
export const featuresData = [
    {
        icon: (
            <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 12h.01"/><path d="M12 12h.01"/><path d="M8 12h.01"/><path d="M3 4h18v16H3z"/><path d="M3 8h18"/>
            </svg>
        ),
        title: "API Monitoring",
        description: "Track endpoint status, latency & response validation. Get alerts before your users notice."
    },
    {
        icon: (
            <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
            </svg>
        ),
        title: "Server Monitoring",
        description: "Monitor CPU, memory, disk & uptime. Detect anomalies before they become outages."
    },
    {
        icon: (
            <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
            </svg>
        ),
        title: "SSL & Port Checks",
        description: "Certificate expiry alerts + port reachability tests. Never get caught with an expired cert."
    },
    {
        icon: (
            <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M7 15h2"/><path d="M11 15h2"/><path d="M15 15h2"/>
            </svg>
        ),
        title: "Frontend/UI Monitoring",
        description: "Puppeteer-driven visual & functional checks. Catch broken UI before users report it."
    },
    {
        icon: (
            <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
        ),
        title: "Cron Job Scheduler",
        description: "Custom intervals, queue-backed execution. Run checks exactly when you need them."
    },
    {
        icon: (
            <svg className="text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 14h.01"/>
            </svg>
        ),
        title: "AI Incident Workflow",
        description: "Groups related alerts, explains root causes & suggests fixes. AI that helps, not hypes."
    }
];

export const faqs = [
    {
        question: "What systems can Checker monitor?",
        answer: "Checker monitors APIs (status, latency, response validation), servers (CPU, memory, uptime), SSL certificates (expiry alerts), ports (reachability), and frontend UIs (via Puppeteer visual/functional checks). Define custom intervals via cron jobs."
    },
    {
        question: "How does the AI incident workflow work?",
        answer: "AI doesn't monitor your systems — it explains them. When related alerts fire (e.g., 3 API timeouts + high latency), Checker groups them into one incident. Gemini then analyzes patterns, error persistence, and context to generate a plain-English summary with likely root causes and suggested fixes."
    },
    {
        question: "How do you prevent alert fatigue?",
        answer: "We suppress noise by design. Instead of firing an alert for every failed check, Checker uses intelligent detection: it validates error persistency, checks latency thresholds, and groups correlated failures. You get one actionable incident, not 50 disconnected alerts."
    },
    {
        question: "What's the architecture behind Checker?",
        answer: "Microservices built for scale: Auth Service, Scheduler (cron jobs → BullMQ queues), Worker Service (distributed Puppeteer/HTTP fetchers), Incident & GenAI Service. Redis for caching, WebSockets for real-time dashboard updates, Docker for portable deployment."
    },
    {
        question: "Can I self-host Checker?",
        answer: "Yes. Checker is built with Docker and a cloud-native architecture. Deploy via docker-compose, Kubernetes, or your preferred orchestrator. All components are stateless except Redis, making horizontal scaling straightforward."
    },
    {
        question: "How do scheduling and cron jobs work?",
        answer: "Define monitoring intervals (e.g., every 30s, 5m, 1h) when creating a job. The Scheduler service pushes jobs into Redis-backed BullMQ queues. Workers pull from queues, execute checks, and store results. Failed jobs retry with exponential backoff."
    },
    {
        question: "Is my monitoring data secure?",
        answer: "All data in transit is encrypted (TLS). Sensitive config (API keys, endpoints) is stored encrypted at rest. Checker never logs response bodies by default — only status codes, latency, and metadata. Self-hosted deployments keep all data in your infrastructure."
    },
    {
        question: "Can I integrate alerts with Slack, Discord, or webhooks?",
        answer: "Yes. Checker supports multi-channel notifications: email, Slack, Discord, and generic webhooks. Configure per-monitor or per-incident. Alert payloads include incident ID, AI summary, and deep links to your dashboard."
    },
    {
        question: "How does Checker scale with thousands of monitors?",
        answer: "Queue-based architecture is the key. BullMQ + Redis decouples scheduling from execution. Add more Worker instances to handle load. Each worker is stateless, so scaling is horizontal. Real-time updates use Socket.io with fallback polling."
    },
    {
        question: "What makes Checker different from other monitoring tools?",
        answer: "Three things: (1) Alert fatigue suppression via intelligent incident grouping, (2) Purposeful AI that explains root causes instead of just notifying, and (3) A production-ready microservices architecture built for developers, not just dashboards."
    }
]
// Social Links Data - Remix Icon
export const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/your-org/checker',
        ariaLabel: 'GitHub',
        icon: <RiGithubFill />
    },
    {
        name: 'X',
        href: '#',
        ariaLabel: 'X (Twitter)',
        icon: <RiTwitterXFill />
    },
    {
        name: 'Discord',
        href: '#',
        ariaLabel: 'Discord',
        icon: <RiDiscordFill />
    },
    {
        name: 'LinkedIn',
        href: '#',
        ariaLabel: 'LinkedIn',
        icon: <RiLinkedinBoxFill />
    }
]

// Navigation Columns Data - PPT Aligned
export const navColumns = [
    {
        title: 'Monitoring',
        links: [
            { label: 'API Endpoints', href: '#apis' },
            { label: 'Server Health', href: '#servers' },
            { label: 'SSL Certificates', href: '#ssl' },
            { label: 'Port Checks', href: '#ports' },
            { label: 'Frontend UI', href: '#frontend' }
        ]
    },
    {
        title: 'Platform',
        links: [
            { label: 'Dashboard', href: '#dashboard' },
            { label: 'Alert Rules', href: '#alerts' },
            { label: 'AI Incident Workflow', href: '#ai-workflow' },
            { label: 'Reporting', href: '#reporting' },
            { label: 'Integrations', href: '#integrations' }
        ]
    },
    {
        title: 'Resources',
        isWide: true,
        links: [
            { label: 'Documentation', href: '/docs' },
            { label: 'API Reference', href: '/api' },
            { label: 'Status Page', href: '/status' },
            { label: 'Community', href: '/community' },
            { label: 'Engineering Blog', href: '/blog' }
        ]
    }
]

// Legal Links Data
export const legalLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '/security' }
]