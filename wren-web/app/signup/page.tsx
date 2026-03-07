'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080A0C' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10 justify-center">
            <ShieldIcon />
            <span className="font-display font-700 text-lg tracking-tight">
              wren<span style={{ color: '#F59E0B' }}>.</span>
            </span>
          </div>

          <div style={{
            background: '#0D1117',
            border: '1px solid rgba(63,185,80,0.3)',
            borderRadius: 16,
            padding: '32px',
          }}>
            {/* Success header */}
            <div className="flex items-center gap-3 mb-6">
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(63,185,80,0.1)',
                border: '1px solid rgba(63,185,80,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9l3.75 3.75 6.75-7.5" stroke="#3FB950" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="font-display font-600 text-base">Account created</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>You're in. Here's your API key.</div>
              </div>
            </div>

            {/* API Key */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}>YOUR API KEY</div>
              <div style={{
                background: '#161B22',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 8,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: '#FBBF24',
                  wordBreak: 'break-all',
                }}>
                  {done.apiKey}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(done.apiKey)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)', flexShrink: 0,
                  }}
                  title="Copy"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                Save this somewhere safe. You can generate more in the dashboard.
              </div>
            </div>

            {/* Credits */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.15)',
              borderRadius: 8,
              marginBottom: 24,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#F59E0B',
              }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>{done.credits} credits</span> added to your account
              </span>
            </div>

            {/* Next step */}
            <div style={{
              background: '#161B22',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 24,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.25)',
                marginBottom: 8,
              }}>NEXT STEP</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>$ </span>
                <span style={{ color: '#FBBF24' }}>pip install wren-gateway</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%', background: '#F59E0B', color: '#000',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 14, padding: '12px', borderRadius: 10,
                border: 'none', cursor: 'pointer',
              }}
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080A0C' }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(245,158,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.04) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ maxWidth: 440, width: '100%', position: 'relative' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <ShieldIcon />
          <span className="font-display font-700 text-lg tracking-tight">
            wren<span style={{ color: '#F59E0B' }}>.</span>
          </span>
        </div>

        <div style={{
          background: '#0D1117',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: '32px',
        }}>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Create your account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>
            Get 100 free credits. No credit card needed.
          </p>

          {error && (
            <div style={{
              background: 'rgba(248,81,73,0.08)',
              border: '1px solid rgba(248,81,73,0.2)',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
              fontSize: 13,
              color: '#F87171',
              fontFamily: 'var(--font-mono)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 6,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
              }}>
                EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  background: '#161B22',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 6,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                style={{
                  width: '100%',
                  background: '#161B22',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(245,158,11,0.5)' : '#F59E0B',
                color: '#000',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: 13,
            color: 'rgba(255,255,255,0.35)',
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#F59E0B', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <path d="M14 2L4 7V14C4 19.5 8.5 24.7 14 26C19.5 24.7 24 19.5 24 14V7L14 2Z"
        stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 14L13 17L18 11" stroke="#F59E0B" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}