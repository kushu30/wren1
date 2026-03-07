'use client'

import Link from 'next/link'

export default function Features() {
  return (
    <section id="features" className="relative py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-[28px] sm:text-[32px] font-medium text-[#EAEAEA] mb-1 font-display">
            Stay secure on the frontier
          </h2>
        </div>

        {/* Feature Grid (Top Row) */}
        <div className="grid lg:grid-cols-3 gap-6 mb-24">
          
          {/* Card 1 */}
          <div className="bg-[#121110] border border-[#222] rounded-xl overflow-hidden flex flex-col group hover:border-[#333] transition-colors relative h-[480px]">
            <div className="p-6 pb-0 z-10">
              <h3 className="text-[17px] font-medium text-[#EAEAEA] mb-2 font-display">Core Security</h3>
              <p className="text-[#8B8B8B] text-[14px] leading-relaxed mb-4 font-body">
                Advanced pattern detection catches prompt injections before they reach your AI models. Protects against jailbreaks and tool abuse.
              </p>
              <Link href="/core" className="text-[#FF6B2C] text-[14px] hover:text-[#FF8A50] transition-colors flex items-center gap-1.5 font-medium mb-6">
                Explore core protection <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </Link>
            </div>
            {/* Visual element representing a picker menu */}
            <div className="flex-1 mt-auto mx-6 bg-[#1A1A1A] border-x border-t border-[#333] rounded-t-xl overflow-hidden flex flex-col relative translate-y-8 group-hover:translate-y-6 transition-transform duration-500 ease-out z-0 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="p-4 border-b border-[#333]">
                <div className="text-[#888] text-[13px] mb-3">Model provider targeted</div>
                <div className="flex items-center justify-between bg-[#262626] rounded-md px-3 py-2">
                  <span className="text-[#DFDFDF] text-[14px] flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    Claude 3.5 Sonnet
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#EAEAEA] flex items-center justify-center text-black">
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </div>
              </div>
              <div className="flex-1 px-4 py-2 mt-4 ml-6 w-3/4 bg-[#141414] rounded-md border border-[#333]">
                <div className="text-[#A3A3A3] text-[12px] py-1 border-b border-[#333]">Injection attempt <span className="text-[#888]">(Blocked)</span></div>
                <div className="text-[#DFDFDF] text-[13px] py-2">System prompt exploit detected</div>
                <div className="text-[#DFDFDF] text-[13px] py-2">Tool execution payload identified</div>
                <div className="text-[#DFDFDF] text-[13px] py-2">RAG poisoning string found</div>
                <div className="flex justify-between items-center py-2 text-[#888]">
                  <span className="text-[#DFDFDF] text-[13px]">Jailbreak heuristic</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#121110] border border-[#222] rounded-xl overflow-hidden flex flex-col group hover:border-[#333] transition-colors relative h-[480px]">
            <div className="p-6 pb-0 z-10 h-full flex flex-col">
              <h3 className="text-[17px] font-medium text-[#EAEAEA] mb-2 font-display">Deep payload understanding</h3>
              <p className="text-[#8B8B8B] text-[14px] leading-relaxed mb-4 font-body">
                Wren learns how your data flows, detecting and redacting sensitive PII instantly, no matter the structure.
              </p>
              <Link href="/privacy" className="text-[#FF6B2C] text-[14px] hover:text-[#FF8A50] transition-colors flex items-center gap-1.5 font-medium mb-6">
                Learn about data privacy <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </Link>
              
              <div className="flex-1 flex items-center justify-center p-4">
                 <div className="w-full bg-[#1A1A1A] rounded-lg border border-[#333] px-5 py-4 flex flex-col gap-3 shadow-[0_5px_30px_rgba(0,0,0,0.5)] transform transition-transform group-hover:scale-[1.02] duration-500 ease-out">
                    <div className="text-[#DFDFDF] text-[13px] mb-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
                       Scanning input stream for PII
                    </div>
                    <div className="flex items-start text-[12px]">
                       <span className="text-[#888] w-20">Detected</span>
                       <span className="text-[#A3A3A3]">Email signature containing phone numbers</span>
                    </div>
                    <div className="flex items-start text-[12px]">
                       <span className="text-[#888] w-20">Masked</span>
                       <span className="text-[#A3A3A3]">Social Security Numbers in attached JSON</span>
                    </div>
                    <div className="flex items-start text-[12px]">
                       <span className="text-[#888] w-20">Masked</span>
                       <span className="text-[#A3A3A3]">Credit card patterns in user feedback</span>
                    </div>
                    <div className="flex items-start text-[12px] mt-2">
                       <span className="text-[#888] w-20">Action</span>
                       <span className="text-[#888] font-mono">Redact payload and forward</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#121110] border border-[#222] rounded-xl overflow-hidden flex flex-col group hover:border-[#333] transition-colors relative h-[480px]">
            <div className="p-6 pb-0 z-10 bg-[#121110]">
              <h3 className="text-[17px] font-medium text-[#EAEAEA] mb-2 font-display">Develop enduring software</h3>
              <p className="text-[#8B8B8B] text-[14px] leading-relaxed mb-4 font-body">
                Trusted by modern enterprises to accelerate development, securely and at scale. Monitor and act with confidence.
              </p>
              <Link href="/enterprise" className="text-[#FF6B2C] text-[14px] hover:text-[#FF8A50] transition-colors flex items-center gap-1.5 font-medium mb-6">
                Explore enterprise <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </Link>
            </div>
            
            <div className="flex-1 mt-auto relative overflow-hidden group">
               {/* Decorative image background blending into the dark container */}
               <div className="absolute inset-0 bg-[#0A0A0A]" />
               <div 
                  className="absolute inset-0 opacity-80 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" 
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'left center',
                    filter: 'contrast(1.2)'
                  }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-[#121110] opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-transparent to-[#121110] opacity-80" />
               <div className="absolute inset-0 bg-[#FF6B2C] mix-blend-overlay opacity-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
