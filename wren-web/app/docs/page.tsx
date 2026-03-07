import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen text-[#EAEAEA] font-body selection:bg-white/10 relative">
      <Navbar />

      <main className="relative z-10 max-w-[900px] mx-auto px-6 pt-32 sm:pt-40 pb-32">
        
        {/* Header */}
        <div className="mb-24">
          <h1 className="font-display text-4xl font-medium tracking-tight mb-4 text-[#EAEAEA]">
            core concepts
          </h1>
          <p className="text-[#888] text-[15px] max-w-[600px] leading-relaxed">
            Understand how Wren acts as a secure, invisible layer between your application and AI model providers.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-32">

          {/* Architecture Overview */}
          <section id="architecture" className="scroll-mt-32">
            <div className="grid md:grid-cols-[200px_1fr] gap-8">
              <div>
                <h2 className="font-mono text-[13px] text-[#555] sticky top-32">architecture</h2>
              </div>
              <div>
                <h3 className="font-display text-xl font-medium mb-4 text-[#EAEAEA] tracking-tight">the reverse proxy model</h3>
                <div className="text-[#888] text-[15px] leading-relaxed space-y-4 mb-8">
                  <p>
                    Wren is designed to be a transparent reverse proxy. Instead of your internal applications or microservices calling OpenAI (or Anthropic, Google, etc.) directly, they route their requests through the Wren Gateway.
                  </p>
                  <p>
                    Wren intercepts the inbound prompt, evaluates it against your configured security policies, routes the clean request to the upstream target, evaluates the returning response, and finally returns the strictly-validated payload back to your client.
                  </p>
                </div>
                
                <div className="bg-[#121212] border border-[#222] rounded-xl p-8 font-mono text-sm overflow-x-auto">
                  <div className="flex flex-col gap-2 min-w-[500px]">
                    <div className="flex items-center justify-between text-center relative">
                      <div className="w-32 py-3 bg-[#1A1A1A] border border-[#333] text-[#EAEAEA] rounded text-[12px]">Client App</div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
                        <div className="h-[1px] w-full bg-[#333] border-dashed"></div>
                        <span className="absolute -top-3 bg-[#121212] px-2 text-[10px] text-[#555] tracking-widest uppercase">SDK Request</span>
                      </div>

                      <div className="w-36 py-3 bg-[#EAEAEA] text-[#0A0A09] font-semibold rounded shadow-[0_0_20px_rgba(255,255,255,0.1)] text-[12px]">Wren Gateway</div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
                        <div className="h-[1px] w-full bg-[#333] border-dashed"></div>
                        <span className="absolute -top-3 bg-[#121212] px-2 text-[10px] text-[#555] tracking-widest uppercase">Target Proxy</span>
                      </div>

                      <div className="w-32 py-3 bg-[#1A1A1A] border border-[#333] text-[#EAEAEA] rounded text-[12px]">LLM Provider</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Policies - Bento Grid */}
          <section id="policies" className="scroll-mt-32">
            <div className="grid md:grid-cols-[200px_1fr] gap-8">
              <div>
                <h2 className="font-mono text-[13px] text-[#555] sticky top-32">edge policies</h2>
              </div>
              <div>
                <h3 className="font-display text-xl font-medium mb-4 text-[#EAEAEA] tracking-tight">security & validation</h3>
                <p className="text-[#888] text-[15px] mb-8 leading-relaxed">
                  Wren's core logic is dictated by its `policy_engine.py` and modular security scanners. These policies are defined programmatically and applied throughout the request lifecycle.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#121212] border border-[#222] p-6 rounded-xl hover:border-[#333] transition-colors group">
                    <div className="font-mono text-[11px] text-[#555] mb-3 group-hover:text-[#888] transition-colors">input pipeline</div>
                    <h4 className="font-display text-[15px] font-medium text-[#EAEAEA] mb-2 tracking-tight">prompt injection</h4>
                    <p className="text-[13px] text-[#888] leading-relaxed">Leverages heuristic scanning and specialized secondary models to detect and block malicious jailbreaks before they reach your primary, expensive model.</p>
                  </div>

                  <div className="bg-[#121212] border border-[#222] p-6 rounded-xl hover:border-[#333] transition-colors group">
                    <div className="font-mono text-[11px] text-[#555] mb-3 group-hover:text-[#888] transition-colors">input pipeline</div>
                    <h4 className="font-display text-[15px] font-medium text-[#EAEAEA] mb-2 tracking-tight">pii redaction</h4>
                    <p className="text-[13px] text-[#888] leading-relaxed">Identifies and masks Personally Identifiable Information (like SSNs, emails, and phone numbers) in prompt context in real-time to maintain compliance.</p>
                  </div>

                  <div className="bg-[#121212] border border-[#222] p-6 rounded-xl hover:border-[#333] transition-colors group">
                    <div className="font-mono text-[11px] text-[#555] mb-3 group-hover:text-[#888] transition-colors">output pipeline</div>
                    <h4 className="font-display text-[15px] font-medium text-[#EAEAEA] mb-2 tracking-tight">rag integrity</h4>
                    <p className="text-[13px] text-[#888] leading-relaxed">Validates that the LLM's response only utilizes facts found strictly within the provided context window, catching hallucinations before they reach the user.</p>
                  </div>

                  <div className="bg-[#121212] border border-[#222] p-6 rounded-xl hover:border-[#333] transition-colors group">
                    <div className="font-mono text-[11px] text-[#555] mb-3 group-hover:text-[#888] transition-colors">output pipeline</div>
                    <h4 className="font-display text-[15px] font-medium text-[#EAEAEA] mb-2 tracking-tight">tool interception</h4>
                    <p className="text-[13px] text-[#888] leading-relaxed">Inspects arguments provided by the AI to invoked tools, ensuring the model isn't attempting destructive actions or accessing unauthorized local network resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Python SDK - IDE Style Code Block */}
          <section id="sdk" className="scroll-mt-32">
            <div className="grid md:grid-cols-[200px_1fr] gap-8">
              <div>
                <h2 className="font-mono text-[13px] text-[#555] sticky top-32">integration</h2>
              </div>
              <div>
                <h3 className="font-display text-xl font-medium mb-4 text-[#EAEAEA] tracking-tight">python sdk</h3>
                <p className="text-[#888] text-[15px] mb-8 leading-relaxed">
                  Wren is designed to be a drop-in integration. We provide a native Python SDK (`wren_client.py`) that handles authentication and routing transparently with identical method signatures to standard provider SDKs.
                </p>

                <div className="bg-[#121212] border border-[#222] rounded-xl overflow-hidden shadow-2xl">
                  <div className="px-4 py-3 border-b border-[#222] bg-[#161616] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-[#333]"></span>
                       <span className="w-2.5 h-2.5 rounded-full bg-[#333]"></span>
                       <span className="w-2.5 h-2.5 rounded-full bg-[#333]"></span>
                    </div>
                    <span className="font-mono text-[11px] text-[#555] uppercase tracking-widest">integration.py</span>
                    <div className="w-[42px]"></div> {/* Spacer for center alignment */}
                  </div>
                  <div className="p-6 overflow-x-auto text-[13px] font-mono leading-relaxed">
                    <div><span className="text-[#555] mr-4 select-none">1</span> <span className="text-[#EAEAEA]">from wren_gateway import WrenClient</span></div>
                    <div><span className="text-[#555] mr-4 select-none">2</span></div>
                    <div><span className="text-[#555] mr-4 select-none">3</span> <span className="text-[#888]"># Initialize with your self-hosted URL</span></div>
                    <div><span className="text-[#555] mr-4 select-none">4</span> <span className="text-[#EAEAEA]">client = WrenClient(</span></div>
                    <div><span className="text-[#555] mr-4 select-none">5</span> <span className="text-[#888]">    base_url=</span><span className="text-[#EAEAEA]">"http://localhost:8000"</span><span className="text-[#888]">,</span></div>
                    <div><span className="text-[#555] mr-4 select-none">6</span> <span className="text-[#888]">    api_key=</span><span className="text-[#EAEAEA]">"wren_sk_demo123_456789abc"</span></div>
                    <div><span className="text-[#555] mr-4 select-none">7</span> <span className="text-[#EAEAEA]">)</span></div>
                    <div><span className="text-[#555] mr-4 select-none">8</span></div>
                    <div><span className="text-[#555] mr-4 select-none">9</span> <span className="text-[#888]"># Use just like the target API</span></div>
                    <div><span className="text-[#555] mr-4 select-none">10</span> <span className="text-[#EAEAEA]">response = client.simple_chat(</span></div>
                    <div><span className="text-[#555] mr-4 select-none">11</span> <span className="text-[#888]">    prompt=</span><span className="text-[#EAEAEA]">"Extract the users phone number and email"</span><span className="text-[#888]">,</span></div>
                    <div><span className="text-[#555] mr-4 select-none">12</span> <span className="text-[#888]">    model=</span><span className="text-[#EAEAEA]">"gpt-4-turbo"</span></div>
                    <div><span className="text-[#555] mr-4 select-none">13</span> <span className="text-[#EAEAEA]">)</span></div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-[#EAEAEA] text-[#0A0A09] hover:bg-white text-[13px] px-6 py-2.5 font-medium transition-colors cursor-pointer">
                      Generate API Keys
                    </Link>
                    <Link href="https://github.com/kushu30/wren1" className="inline-flex items-center justify-center rounded-full border border-[#333] text-[#EAEAEA] hover:border-[#555] text-[13px] px-6 py-2.5 transition-colors cursor-pointer">
                      View Source on GitHub
                    </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
