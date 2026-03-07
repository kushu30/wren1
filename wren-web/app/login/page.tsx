'use client'

import { useState } from 'react'
import Link from 'next/link'
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
          <h1 className="font-display" style={{
            fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em',
          }}>
            Welcome back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>
            Sign in to access your API keys and dashboard.
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
                display: 'block', fontSize: 12,
                color: 'rgba(255,255,255,0.4)', marginBottom: 6,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
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
                  width: '100%', background: '#161B22',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '11px 14px',
                  color: '#fff', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s', fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                }}>
                  PASSWORD
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                style={{
                  width: '100%', background: '#161B22',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '11px 14px',
                  color: '#fff', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s', fontFamily: 'inherit',
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
                fontWeight: 700, fontSize: 14,
                padding: '12px', borderRadius: 10,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p style={{
            marginTop: 20, textAlign: 'center',
            fontSize: 13, color: 'rgba(255,255,255,0.35)',
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#F59E0B', textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>

        {/* Demo credentials hint for hackathon */}
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.1)',
          borderRadius: 8, textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'rgba(255,255,255,0.25)',
          }}>
            demo: demo@wren.dev / demo1234
          </span>
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