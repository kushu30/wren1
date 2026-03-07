'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api, saveSession, WrenAPIError } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Frontend demo bypass
    if (email === 'demo@wren.dev' && password === 'demo1234') {
      saveSession('demo_token', email)
      router.push('/dashboard')
      return
    }

    try {
      const res = await api.login(email, password)
      saveSession(res.token, res.email)
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof WrenAPIError) {
        setError(err.status === 401 ? 'Invalid email or password.' : err.message)
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

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

        {/* Login Box */}
        <div className="bg-[#0A0A09] border border-[#222] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <h1 className="font-display text-[26px] font-medium text-[#EAEAEA] mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-[#888] text-[14px] mb-8 font-body">
            Sign in to access your API keys and dashboard.
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
              <div className="flex justify-between mb-2">
                <label className="block text-[11px] text-[#888] font-mono tracking-widest uppercase">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#888] font-body">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#EAEAEA] hover:underline hover:text-white transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 p-3 bg-[#121212] border border-[#222] rounded-lg text-center shadow-lg">
          <span className="font-mono text-[11px] text-[#888]">
            demo: demo@wren.dev / demo1234
          </span>
        </div>
      </div>
    </div>
  )
}