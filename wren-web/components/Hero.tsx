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
    <section className="relative min-h-screen flex flex-col pt-32 lg:pt-40 pb-0 overflow-hidden px-6">
      <div className="relative max-w-7xl mx-auto w-full flex flex-col flex-1">
        {/* Top: Copy */}
        <div className="flex flex-col items-start mb-16">
          <h1
            className="text-3xl font-medium leading-[1.1] tracking-tight mb-8 text-white w-full max-w-[800px] opacity-0-init animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            Built to make your LLMs extraordinarily secure,
            <br className="hidden md:block" />
            Wren is the best way to protect your AI apps.
          </h1>

          <Link
            href="/signup"
            className="bg-white text-black px-5 py-2.5 rounded-full font-medium text-[14px] flex items-center gap-2 hover:bg-neutral-200 transition-colors opacity-0-init animate-fade-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            Get started free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </Link>
        </div>

        {/* Bottom: Live log mockup */}
        <div
          className="w-full opacity-0-init animate-fade-up overflow-hidden border-t border-l border-r border-[#ffffff20] rounded-xl"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          {/* Painting / container background */}
          <div className="w-full bg-[#E5E0D8] pt-12 sm:pt-16 pb-0 px-4 sm:px-12 md:px-20 relative flex flex-col items-center min-h-[500px]">
            {/* Painting-like background via CSS */}
            <div 
              className="absolute inset-0 opacity-[0.85] mix-blend-multiply" 
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1019&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'saturate(0.6) contrast(1.1)'
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.2) 0%, transparent 100%)'
              }}
            />
            
            <div className="relative z-10 w-full max-w-[900px] shadow-2xl rounded-t-xl overflow-hidden translate-y-4">
              <div className="overflow-hidden border border-[#ffffff15] bg-[#0A0A0A] w-full rounded-t-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#ffffff10]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#F85149]" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-[#3FB950]" />
                    </div>
                  </div>
                  <span className="font-sans text-xs text-[#ffffff50] font-medium absolute left-1/2 -translate-x-1/2">
                    wren
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#ffffff50] hidden sm:inline-block">LIVE</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>

                {/* Column headers */}
                <div className="px-5 py-2.5 border-b border-[#ffffff08] grid grid-cols-12 gap-4 bg-[#0A0A0A]">
                  <span className="col-span-3 font-mono text-[11px] text-[#ffffff40] uppercase tracking-wider">Type</span>
                  <span className="col-span-4 font-mono text-[11px] text-[#ffffff40] uppercase tracking-wider">Payload</span>
                  <span className="col-span-3 font-mono text-[11px] text-[#ffffff40] uppercase tracking-wider hidden sm:block">Risk</span>
                  <span className="col-span-5 sm:col-span-2 font-mono text-[11px] text-[#ffffff40] uppercase tracking-wider text-right">Status</span>
                </div>

                {/* Log rows */}
                <div ref={logRef} className="divide-y divide-[#ffffff04] bg-[#0A0A0A]">
                  {ATTACKS.map((attack, i) => (
                    <div key={i} className="log-entry log-row px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#ffffff05] transition-colors">
                      <span className="col-span-3 font-mono text-[13px] text-amber-500/90 truncate">
                        {attack.type}
                      </span>
                      <span className="col-span-4 font-mono text-[13px] text-[#ffffff60] truncate">
                        {attack.payload}
                      </span>
                      <div className="col-span-3 items-center justify-start gap-2 hidden sm:flex">
                        <div className="w-16 h-1 bg-[#ffffff10] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500/80 rounded-full" 
                            style={{ width: `${attack.risk * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[13px] text-[#ffffff50]">{Math.round(attack.risk * 100)}</span>
                      </div>
                      <div className="col-span-5 sm:col-span-2 flex justify-end">
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded-sm ${
                            attack.status === 'BLOCKED'
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}
                        >
                          {attack.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional height to simulate editor content */}
                <div className="h-32 bg-[#0A0A0A]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
