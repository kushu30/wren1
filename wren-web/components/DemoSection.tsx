import Link from 'next/link'

const STEPS = [
  {
    n: '01',
    title: 'Run your local gateway',
    desc: 'Self-host the secure proxy in your infrastructure.',
    badge: { label: 'localhost:8000', type: 'key' },
    code: null,
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
    title: 'Route calls through Wren',
    desc: 'Replace your LLM client with WrenClient.',
    code: 'client = WrenClient(api_key="wren_sk_...")',
    badge: null,
  },
  {
    n: '04',
    title: 'Watch attacks get blocked',
    desc: 'Dashboard shows every threat in real time.',
    badge: { label: '← BLOCKED: PROMPT_INJECTION (0.97)', type: 'alert' },
    code: null,
  },
]

export default function DemoSection() {
  return (
    <section className="relative pt-24 sm:pt-32 bg-[#0A0A09] border-t border-[#1a1a1a]">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16">
          <h2 className="text-[28px] sm:text-[34px] leading-[1.2] font-medium text-white mb-2 font-display">
            Get started in minutes
          </h2>
          <p className="text-[#999999] text-[20px] leading-[1.4] mb-8 font-body max-w-2xl">
            From zero to fully protected in 4 steps. No infrastructure to manage. No complex config. Just protection.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-[#121110] border border-[#222] rounded-xl hover:border-[#333] transition-colors flex flex-col h-full min-h-[220px]">
              <div className="p-5 flex flex-col h-full">
                <div className="text-[#888] text-[15px] font-mono mb-6">
                  {step.n}
                </div>
                
                <h3 className="text-[16px] font-medium text-[#EAEAEA] mb-2 font-display">
                  {step.title}
                </h3>
                
                <p className="text-[#8B8B8B] text-[13px] leading-relaxed mb-6 font-body flex-grow">
                  {step.desc}
                </p>

                {step.code && (
                  <div className="mt-auto">
                    <div className="bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2.5 flex items-center gap-2 overflow-hidden">
                      <span className="text-[#555] font-mono text-[12px] select-none">$</span>
                      <span className="font-mono text-[12px] text-[#A3A3A3] truncate">{step.code}</span>
                    </div>
                  </div>
                )}

                {step.badge && (
                  <div className="mt-auto">
                    {step.badge.type === 'key' ? (
                      <div className="bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2.5 flex items-center justify-center">
                        <span className="font-mono text-[12px] text-[#FF6B2C]">{step.badge.label}</span>
                      </div>
                    ) : (
                      <div className="bg-[#3A1414] border border-[#5A1414] rounded-md px-3 py-2.5 flex items-center justify-center">
                        <span className="font-mono text-[12px] text-[#F85149]">{step.badge.label}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats / Outline Area */}
        <div className="grid md:grid-cols-3 gap-6 mb-24 hidden sm:grid">
          {[
            { value: '< 2ms', label: 'avg inspection latency' },
            { value: '100%', label: 'open-source & privacy-first' },
            { value: '6', label: 'security protection layers' },
          ].map((stat, i) => (
            <div key={i} className="border-t border-[#333] pt-6 group">
               <div className="text-[28px] font-medium text-[#EAEAEA] mb-1 font-display group-hover:text-white transition-colors">
                 {stat.value}
               </div>
               <div className="text-[#888] text-[14px]">
                 {stat.label}
               </div>
            </div>
          ))}
        </div>
</div>
        {/* New CTA block designed like the reference image */}
        <div className="bg-[#14120B] py-24 sm:py-32 flex flex-col items-center justify-center border-t border-[#1a1a1a]">
           <h2 className="text-[36px] sm:text-[44px] leading-[1.1] font-medium text-[#EAEAEA] mb-6 font-display tracking-tight">
              Try Wren now.
           </h2>
           
           <Link 
              href="https://github.com" 
              className="bg-[#EAEAEA] text-black px-5 py-2.5 rounded-full font-medium text-[13px] flex items-center gap-2 hover:bg-white transition-colors"
           >
              View on GitHub
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
           </Link>
        </div>

      
    </section>
  )
}
