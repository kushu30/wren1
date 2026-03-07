'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api, saveSession, WrenAPIError } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ apiKey: string; credits: number } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Frontend demo bypass
    if (email === 'demo@wren.dev' && password === 'demo1234') {
      saveSession('demo_token', email)
      setDone({ apiKey: 'wren_sk_demo123_456789abc', credits: 100 })
      setLoading(false)
      return
    }

    try {
      const res = await api.signup(email, password)
      saveSession(res.token, res.email)
      setDone({ apiKey: res.api_key, credits: res.credits })
    } catch (err) {
      if (err instanceof WrenAPIError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Post-signup success screen ─────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#14120B]">
        <div className="max-w-[480px] w-full relative z-10">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 justify-center group hover:opacity-80 transition-opacity">
            <Image src="/logo.png" width={24} height={24} alt="Wren Logo" className="object-contain" />
            <span className="font-display font-medium text-[20px] tracking-tight text-[#EAEAEA]">
              wren
            </span>
          </Link>

          <div className="bg-[#0A0A09] border border-[#222] rounded-2xl p-8 sm:p-10 shadow-2xl">
            {/* Success header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-[#333] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9l3.75 3.75 6.75-7.5" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="font-display font-medium text-[18px] text-[#EAEAEA]">Account created</div>
                <div className="text-[14px] text-[#888] font-body mt-0.5">Welcome aboard! Here's your API key.</div>
              </div>
            </div>

            {/* API Key */}
            <div className="mb-6">
              <div className="text-[11px] text-[#888] font-mono tracking-widest uppercase mb-2">
                YOUR API KEY
              </div>
              <div className="bg-[#161616] border border-[#333] rounded-lg p-4 flex items-center justify-between gap-4">
                <span className="font-mono text-[13px] text-[#EAEAEA] break-all">
                  {done.apiKey}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(done.apiKey)}
                  className="text-[#888] hover:text-[#EAEAEA] transition-colors flex-shrink-0"
                  title="Copy to clipboard"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="text-[12px] text-[#555] mt-2 font-body">
                Save this somewhere safe. You can generate more in the dashboard.
              </div>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-[#161616] border border-[#333] rounded-lg mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EAEAEA]" />
              <span className="text-[13px] text-[#888] font-body">
                <span className="text-[#EAEAEA] font-medium">{done.credits} credits</span> added to your account
              </span>
            </div>

            {/* Next step */}
            <div className="bg-[#161616] border border-[#333] rounded-lg p-4 mb-8">
              <div className="text-[11px] text-[#555] font-mono tracking-widest uppercase mb-2">
                NEXT STEP
              </div>
              <div className="font-mono text-[13px] text-[#EAEAEA] flex gap-3">
                <span className="text-[#555] select-none">$</span>
                <span>pip install wren-gateway</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-full font-medium text-[14px] py-3 flex items-center justify-center bg-[#EAEAEA] text-black hover:bg-white transition-all"
            >
              Go to dashboard →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#14120B]">
      <div className="max-w-[400px] w-full relative z-10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10 justify-center group hover:opacity-80 transition-opacity">
          <Image src="/logo.png" width={24} height={24} alt="Wren Logo" className="object-contain" />
          <span className="font-display font-medium text-[20px] tracking-tight text-[#EAEAEA]">
            wren
          </span>
        </Link>

        {/* Signup Box */}
        <div className="bg-[#0A0A09] border border-[#222] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <h1 className="font-display text-[26px] font-medium text-[#EAEAEA] mb-2 tracking-tight">
            Create your account
          </h1>
          <p className="text-[#888] text-[14px] mb-8 font-body">
            Get 100 free credits. No credit card needed.
          </p>

          {error && (
            <div className="bg-[#3A1414] border border-[#5A1414] rounded-lg p-3 mb-6 text-[13px] text-[#F85149] font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] text-[#888] mb-2 font-mono tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#161616] border border-[#333] rounded-lg px-4 py-3 text-[#EAEAEA] text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#666] transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#888] mb-2 font-mono tracking-widest uppercase">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-[#161616] border border-[#333] rounded-lg px-4 py-3 text-[#EAEAEA] text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#666] transition-colors font-body"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 rounded-full font-medium text-[14px] py-3 flex items-center justify-center transition-all ${
                loading 
                  ? 'bg-[#EAEAEA]/50 text-black cursor-not-allowed' 
                  : 'bg-[#EAEAEA] text-black hover:bg-white'
              }`}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#888] font-body">
            Already have an account?{' '}
            <Link href="/login" className="text-[#EAEAEA] hover:underline hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}