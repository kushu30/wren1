'use client'

const PIPELINE = [
  {
    step: '01',
    label: 'Your App',
    description: 'Any LLM-powered application — chatbot, agent, RAG system, API.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 8l2 2-2 2M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    step: '02',
    label: 'Wren SDK',
    description: 'Drop in one import. Route all LLM calls through the gateway.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6 5l-4 5 4 5M14 5l4 5-4 5M11 3l-2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlight: true,
  },
  {
    step: '03',
    label: 'Security Pipeline',
    description: 'Input scanning → policy engine → RAG check → tool validation → output filtering.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 6v5c0 4.4 3 8.1 7 9 4-0.9 7-4.6 7-9V6L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    step: '04',
    label: 'LLM Provider',
    description: 'Clean, validated request reaches your model. Threats never get through.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const LAYERS = [
  { name: 'Advanced Security Scanner', color: '#F85149' },
  { name: 'Input Scanner + PII Redaction', color: '#F59E0B' },
  { name: 'Policy Engine', color: '#58A6FF' },
  { name: 'RAG Integrity Check', color: '#3FB950' },
  { name: 'Tool Call Validation', color: '#BC8CFF' },
  { name: 'Output Scanner', color: '#F59E0B' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-20 max-w-2xl">
          <p className="section-label mb-4">HOW IT WORKS</p>
          <h2 className="text-4xl lg:text-5xl font-display font-700 tracking-tight leading-tight mb-4">
            A security layer that<br />
            <span className="text-amber-500">never breaks your flow.</span>
          </h2>
          <p className="text-white/50 font-body font-300 text-lg">
            Two lines of code. Full coverage. Every request is inspected, scored, and acted on — in milliseconds.
          </p>
        </div>

        {/* Architecture flow */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {PIPELINE.map((item, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < PIPELINE.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px z-10" style={{ width: 'calc(100% - 100%)' }}>
                  <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-amber-500/30 to-transparent" style={{ width: '100%', left: '100%', marginLeft: '-2px' }} />
                </div>
              )}

              <div className={`feature-card p-5 h-full ${item.highlight ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  item.highlight ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/50'
                }`}>
                  {item.icon}
                </div>
                <div className="font-mono text-xs text-white/25 mb-1">{item.step}</div>
                <h3 className="font-display font-600 text-base mb-2">{item.label}</h3>
                <p className="text-white/45 text-sm font-body leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline detail */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: code */}
          <div>
            <p className="section-label mb-6">INTEGRATION</p>
            <div className="code-block">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-[#161B22]">
                <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                <span className="font-mono text-xs text-white/40">app.py</span>
              </div>
              <div className="p-4 space-y-0.5">
                {[
                  { n: 1, text: 'from wren_gateway import WrenClient', color: 'text-white/70' },
                  { n: 2, text: '', color: '' },
                  { n: 3, text: 'client = WrenClient(', color: 'text-white/70' },
                  { n: 4, text: '    base_url="http://localhost:8000",', color: 'text-white/50' },
                  { n: 5, text: '    api_key="wren_sk_xxxxxx"', color: 'text-amber-400' },
                  { n: 6, text: ')', color: 'text-white/70' },
                  { n: 7, text: '', color: '' },
                  { n: 8, text: '# All LLM calls now go through Wren', color: 'text-white/25' },
                  { n: 9, text: 'response = client.simple_chat("Hello")', color: 'text-white/70' },
                ].map((line) => (
                  <div key={line.n} className="flex">
                    <span className="line-number font-mono text-xs w-8 text-right select-none">{line.n}</span>
                    <span className={`font-mono text-xs ${line.color}`}>{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: security layers */}
          <div>
            <p className="section-label mb-6">SECURITY PIPELINE</p>
            <div className="space-y-2">
              {LAYERS.map((layer, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-[#0D1117] border border-white/5"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
                  <span className="font-mono text-xs text-white/55">{layer.name}</span>
                  <div className="ml-auto">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="3" fill={layer.color} opacity="0.3"/>
                      <circle cx="6" cy="6" r="1.5" fill={layer.color}/>
                    </svg>
                  </div>
                </div>
              ))}
              <div className="p-3.5 rounded-lg border border-dashed border-white/10 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="font-mono text-xs text-white/25">→ LLM Provider</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
