'use client'

import Link from 'next/link'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-[#0A0A09] border-t border-[#1a1a1a]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-center">
          
          {/* Left: Copy */}
          <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col items-start lg:mt-[-80px]">
            <h2 className="text-[28px] sm:text-[34px] leading-[1.2] font-medium text-white mb-2 font-display">
              Wren secures your LLM apps
            </h2>
            <p className="text-[#999999] text-[20px] leading-[1.4] mb-8 font-body">
              Accelerate development by handing off security tasks to Wren, while you focus on building features.
            </p>
            <Link 
              href="/docs" 
              className="text-[#FF6B2C] text-[15px] hover:text-[#FF8A50] transition-colors flex items-center gap-1.5 font-medium"
            >
              Learn about Wren security <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Right: Security Pipeline App Mockup */}
          <div className="w-full flex-grow relative">
            {/* Outer grayish container representing the screenshot background padding */}
            <div className="bg-[#595244] p-4 sm:p-6 md:p-8 rounded-md w-full shadow-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
              
              {/* Fake App Window */}
              <div className="bg-[#121212] rounded-lg border border-[#ffffff15] h-full w-full overflow-hidden flex flex-col shadow-2lg">
                
                {/* Window Header */}
                <div className="h-10 bg-[#161616] border-b border-[#ffffff10] flex items-center px-4 relative flex-shrink-0">
                  <div className="flex gap-2 w-16">
                    <div className="w-3 h-3 rounded-full bg-[#5C5C5C]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#5C5C5C]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#5C5C5C]"></div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 text-[12px] text-[#888888] font-medium font-sans">
                    Wren Security
                  </div>
                </div>

                {/* Window Body Split */}
                <div className="flex flex-1 overflow-hidden min-h-0">
                  
                  {/* Left Sidebar (Action Log / Steps) */}
                  <div className="hidden md:flex flex-col w-1/3 min-w-[200px] border-r border-[#ffffff08] bg-[#121212] p-4 gap-4 overflow-y-auto">
                    <div className="flex flex-col text-sm">
                      <div className="text-white font-medium mb-2">Request Intercepted</div>
                      <div className="px-3 py-2 border border-[#ffffff15] rounded-md text-[#A3A3A3] text-xs leading-relaxed">
                        User input detected. Extracting context and scanning for known vulnerabilities...
                      </div>
                    </div>

                    <div className="flex flex-col text-sm mt-2">
                       <div className="text-[#888888] text-xs mb-1">Status 4ms</div>
                       <div className="flex items-center gap-2 text-white text-xs px-3 py-2 bg-[#1A1A1A] rounded-md border border-[#ffffff05]">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                         Input validated
                       </div>
                    </div>

                    <div className="mt-auto">
                      <div className="bg-[#1A1A1A] border border-[#ffffff10] rounded-lg p-3">
                        <div className="text-[#888888] text-[11px] mb-2 flex justify-between">
                          <span>Security Checks</span>
                          <span className="flex gap-1">{'<'} {'>'}</span>
                        </div>
                        <div className="text-[13px] text-white font-medium mb-3">Which checks failed?</div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-[#888888]">
                            <span className="w-4 h-4 rounded text-[9px] border border-[#ffffff20] flex items-center justify-center">1</span>
                            Prompt Injection (Clean)
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#888888]">
                            <span className="w-4 h-4 rounded text-[9px] border border-[#ffffff20] flex items-center justify-center">2</span>
                            PII Redaction (Clean)
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#888888]">
                            <span className="w-4 h-4 rounded text-[9px] border border-[#ffffff20] flex items-center justify-center">3</span>
                            Policy Violation (Clean)
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 text-xs">
                          <button className="text-[#888888]">Skip</button>
                          <button className="bg-[#D98A33] text-[#1A1A1A] font-medium px-2 py-1 rounded">Continue</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Main Content (Documentation / Config) */}
                  <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 bg-[#141414]">
                    <div className="max-w-[440px]">
                      <h3 className="text-[22px] font-semibold text-white mb-2 leading-tight">
                        Wren SDK Integration
                      </h3>
                      <p className="text-[#A3A3A3] text-[13px] leading-[1.6] mb-6">
                        Drop in one import. Route all LLM calls through the gateway. Clean, validated requests reach your model while threats are blocked.
                      </p>

                      <div className="space-y-4 mb-8">
                        <div>
                          <h4 className="text-white text-[14px] font-medium mb-1">Trigger</h4>
                          <p className="text-[#A3A3A3] text-[13px] leading-[1.5]">
                            Initialize the WrenClient and pass your queries. Milliseconds latency overhead.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-white text-[14px] font-medium mb-1">Validation Behavior</h4>
                          <p className="text-[#A3A3A3] text-[13px] leading-[1.5]">
                            Input scanning → policy engine → RAG check → tool validation → output filtering.
                          </p>
                        </div>
                      </div>

                      <div className="text-[#888888] text-[11px] mb-3">3 Checks Enabled</div>
                      <div className="space-y-3 pl-1">
                        <div className="flex items-start gap-3">
                          <div className="w-3.5 h-3.5 rounded-full border border-[#ffffff30] mt-0.5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3]"></div>
                          </div>
                          <span className="text-[#D4D4D4] text-[13px]">Scan for prompt injections</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-3.5 h-3.5 rounded-full border border-[#ffffff30] mt-0.5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3]"></div>
                          </div>
                          <span className="text-[#D4D4D4] text-[13px]">Enforce custom output policies</span>
                        </div>
                        <div className="flex items-start gap-3 opacity-60">
                          <div className="w-3.5 h-3.5 rounded-full border border-[#ffffff30] mt-0.5 flex-shrink-0"></div>
                          <span className="text-[#A3A3A3] text-[13px]">Add a custom validation layer...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
