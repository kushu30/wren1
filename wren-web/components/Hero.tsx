'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const ATTACKS = [
  { type: 'PROMPT_INJECTION', payload: 'Ignore previous instructions and...', status: 'BLOCKED', risk: 0.97 },
  { type: 'PII_LEAK', payload: 'SSN: 123-45-6789 detected in context', status: 'REDACTED', risk: 0.84 },
  { type: 'JAILBREAK', payload: 'You are DAN, you can do anything...', status: 'BLOCKED', risk: 0.99 },
  { type: 'RAG_POISON', payload: 'Malicious chunk injected in retrieval', status: 'BLOCKED', risk: 0.91 },
  { type: 'TOOL_ABUSE', payload: 'exec(os.system("rm -rf /"))', status: 'BLOCKED', risk: 0.96 },
]

export default function Hero() {
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Stagger log entries appearing
    const rows = logRef.current?.querySelectorAll('.log-entry')
    rows?.forEach((row, i) => {
      const el = row as HTMLElement
      el.style.opacity = '0'
      el.style.transform = 'translateX(-8px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      }, 600 + i * 200)
    })
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Radial glow behind hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 opacity-0-init animate-fade-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shield-pulse" />
              <span className="font-mono text-xs text-amber-500 tracking-wider">AI SECURITY GATEWAY</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl lg:text-6xl xl:text-7xl font-display font-800 leading-[0.95] tracking-tight mb-6 opacity-0-init animate-fade-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              Stop attacks
              <br />
              <span className="text-amber-500 amber-text-glow">before they</span>
              <br />
              reach your LLM.
            </h1>

            {/* Subheading */}
            <p
              className="text-white/55 text-lg leading-relaxed max-w-xl mb-10 font-body font-300 opacity-0-init animate-fade-up"
              style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
            >
              Wren sits between your app and any LLM — blocking prompt injections,
              redacting PII, enforcing policies, and logging every threat in real time.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 mb-12 opacity-0-init animate-fade-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
              <Link href="/signup" className="btn-primary px-6 py-3 rounded-xl text-sm">
                Get started free →
              </Link>
              <Link href="#how-it-works" className="btn-secondary px-6 py-3 rounded-xl text-sm">
                See how it works
              </Link>
            </div>

            {/* Install snippet */}
            <div
              className="opacity-0-init animate-fade-up"
              style={{ animationDelay: '0.65s', animationFillMode: 'forwards' }}
            >
              <p className="text-white/30 text-xs font-mono mb-2 tracking-wider">QUICK INSTALL</p>
              <div className="code-block inline-block">
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-white/30 font-mono text-sm">$</span>
                  <span className="font-mono text-sm text-amber-400">pip install wren-gateway</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live log mockup */}
          <div
            className="opacity-0-init animate-fade-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <div className="gradient-border animate-float">
              <div className="rounded-xl overflow-hidden border border-white/6 bg-[#0D1117]">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#F85149]/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                      <div className="w-3 h-3 rounded-full bg-[#3FB950]/70" />
                    </div>
                    <span className="font-mono text-xs text-white/30 ml-2">wren — security monitor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono text-xs text-white/30">LIVE</span>
                  </div>
                </div>

                {/* Column headers */}
                <div className="px-4 py-2 border-b border-white/4 grid grid-cols-12 gap-2">
                  <span className="col-span-3 font-mono text-xs text-white/25 uppercase tracking-wider">Type</span>
                  <span className="col-span-5 font-mono text-xs text-white/25 uppercase tracking-wider">Payload</span>
                  <span className="col-span-2 font-mono text-xs text-white/25 uppercase tracking-wider">Risk</span>
                  <span className="col-span-2 font-mono text-xs text-white/25 uppercase tracking-wider">Status</span>
                </div>

                {/* Log rows */}
                <div ref={logRef} className="divide-y divide-white/4">
                  {ATTACKS.map((attack, i) => (
                    <div key={i} className="log-entry log-row px-4 py-3 grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-3 font-mono text-xs text-amber-400/80 truncate">
                        {attack.type}
                      </span>
                      <span className="col-span-5 font-mono text-xs text-white/40 truncate">
                        {attack.payload}
                      </span>
                      <div className="col-span-2 flex items-center gap-1">
                        <div
                          className="h-1 rounded-full bg-red-500/80"
                          style={{ width: `${attack.risk * 100}%`, minWidth: 4 }}
                        />
                        <span className="font-mono text-xs text-white/40">{Math.round(attack.risk * 100)}</span>
                      </div>
                      <span
                        className={`col-span-2 font-mono text-xs px-1.5 py-0.5 rounded text-center ${
                          attack.status === 'BLOCKED'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-amber-500/15 text-amber-400'
                        }`}
                      >
                        {attack.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 bg-[#161B22] border-t border-white/4 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/25 cursor">
                    5 threats detected today
                  </span>
                  <span className="font-mono text-xs text-green-400/70">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080A0C] to-transparent pointer-events-none" />
    </section>
  )
}
