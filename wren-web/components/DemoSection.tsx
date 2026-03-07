import Link from 'next/link'

const STEPS = [
  {
    n: '01',
    title: 'Sign up & get your key',
    desc: '100 free credits included. No credit card.',
    code: null,
    badge: { label: 'wren_sk_ab3f91...', type: 'key' },
  },
  {
    n: '02',
    title: 'Install the SDK',
    desc: 'One command. Works with any Python LLM app.',
    code: 'pip install wren-gateway',
    badge: null,
  },
  {
    n: '03',
    title: 'Route your calls through Wren',
    desc: 'Replace your LLM client with WrenClient.',
    code: 'client = WrenClient(api_key="wren_sk_...")',
    badge: null,
  },
  {
    n: '04',
    title: 'Watch attacks get blocked',
    desc: 'Dashboard shows every threat in real time.',
    code: null,
    badge: { label: '← BLOCKED: PROMPT_INJECTION (0.97)', type: 'alert' },
  },
]

export default function DemoSection() {
  return (
    <section className="relative py-28 border-t border-white/5 overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="section-label mb-4">GET STARTED IN MINUTES</p>
          <h2 className="text-4xl lg:text-5xl font-display font-700 tracking-tight leading-tight mb-4">
            From zero to<br />
            <span className="text-amber-500">protected in 4 steps.</span>
          </h2>
          <p className="text-white/45 font-body font-300 text-lg">
            No infrastructure to manage. No complex config. Just protection.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {STEPS.map((step, i) => (
            <div key={i} className="relative">
              {/* Step connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-5 flex items-center justify-center z-10" style={{ transform: 'translateX(-50%)' }}>
                  <div className="w-full h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
                </div>
              )}

              <div className="p-5 rounded-xl bg-[#0D1117] border border-white/6 h-full flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <span className="font-mono text-xs text-amber-500 font-medium">{step.n}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-600 text-sm mb-1.5">{step.title}</h3>
                  <p className="text-white/40 text-xs font-body leading-relaxed">{step.desc}</p>
                </div>

                {step.code && (
                  <div className="mt-auto">
                    <div className="code-block">
                      <div className="px-3 py-2 flex items-center gap-2">
                        <span className="text-white/25 font-mono text-xs">$</span>
                        <span className="font-mono text-xs text-amber-400 break-all">{step.code}</span>
                      </div>
                    </div>
                  </div>
                )}

                {step.badge && (
                  <div className="mt-auto">
                    {step.badge.type === 'key' ? (
                      <div className="px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
                        <span className="font-mono text-xs text-amber-400">{step.badge.label}</span>
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/15">
                        <span className="font-mono text-xs text-red-400">{step.badge.label}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-5 mb-20">
          {[
            { value: '< 2ms', label: 'Avg inspection latency' },
            { value: '100', label: 'Free credits on signup' },
            { value: '6', label: 'Security protection layers' },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl border border-white/6 bg-[#0D1117] text-center">
              <div className="text-3xl lg:text-4xl font-display font-800 text-amber-500 amber-text-glow mb-2">
                {stat.value}
              </div>
              <div className="text-white/40 text-sm font-body">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 border border-amber-500/20 rounded-2xl" />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)',
            }}
          />
          <div className="relative px-8 lg:px-16 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-700 tracking-tight mb-3">
                Start protecting your AI today.
              </h2>
              <p className="text-white/50 font-body font-300 text-lg">
                Free to start. No credit card. 100 credits included.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="/signup" className="btn-primary px-8 py-3.5 rounded-xl text-sm whitespace-nowrap">
                Create free account →
              </Link>
              <Link href="#" className="btn-secondary px-8 py-3.5 rounded-xl text-sm whitespace-nowrap">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
