const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L3 7v6c0 5 4 9 8 10 4-1 8-5 8-10V7L11 2z" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7.5 11l2.5 2.5 5-5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Prompt Injection Protection',
    description: 'Advanced pattern detection and semantic analysis catches injection attempts before they reach your model.',
    badge: 'Core',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M8 11l2 2 4-4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'PII Redaction',
    description: 'Automatically detects and redacts SSNs, emails, phone numbers, credit cards before forwarding.',
    badge: 'Privacy',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="12" rx="2" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M7 10h8M7 13h5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Policy Enforcement',
    description: 'Define custom security rules. Block specific topics, enforce tone, restrict output formats.',
    badge: 'Control',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 5l12 12M17 5l-6 6-6 6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Tool Call Security',
    description: 'Validate and control which tools agents can invoke. Prevent dangerous function calls.',
    badge: 'Agents',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 6h14M4 10h10M4 14h6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="15" r="3" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M17 13.5v1.5l1 1" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'RAG Integrity Validation',
    description: 'Validate retrieval chunks before injection. Detect and block poisoned context documents.',
    badge: 'RAG',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 12h3l3-6 4 12 3-9 2 3h3" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Real-Time Security Dashboard',
    description: 'Every request logged. Every threat visualized. Full audit trail with risk scores and decision reasoning.',
    badge: 'Observability',
  },
]

const BADGE_COLORS: Record<string, string> = {
  Core: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Privacy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Control: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Agents: 'bg-red-500/10 text-red-400 border-red-500/20',
  RAG: 'bg-green-500/10 text-green-400 border-green-500/20',
  Observability: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

export default function Features() {
  return (
    <section id="features" className="relative py-28 border-t border-white/5">
      {/* Background accent */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-xl">
            <p className="section-label mb-4">FEATURES</p>
            <h2 className="text-4xl lg:text-5xl font-display font-700 tracking-tight leading-tight">
              Every attack vector.<br />
              <span className="text-amber-500">Covered.</span>
            </h2>
          </div>
          <p className="text-white/45 font-body font-300 max-w-sm text-base leading-relaxed">
            Built specifically for LLM security. Not a general WAF bolted on — purpose-built protection for AI systems.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/8 border border-amber-500/15 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded border ${BADGE_COLORS[f.badge]}`}>
                  {f.badge}
                </span>
              </div>
              <h3 className="font-display font-600 text-base mb-2.5">{f.label}</h3>
              <p className="text-white/45 text-sm font-body leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
