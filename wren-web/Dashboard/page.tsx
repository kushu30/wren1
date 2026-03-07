'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, clearSession, getToken, WrenAPIError } from '@/lib/api'
import type { ApiKey, UserInfo } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingKey, setGeneratingKey] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
      return
    }
    loadData()
  }, [])

  async function loadData() {
    try {
      const [userInfo, apiKeys] = await Promise.all([api.me(), api.listApiKeys()])
      setUser(userInfo)
      setKeys(apiKeys)
    } catch (err) {
      if (err instanceof WrenAPIError && err.status === 401) {
        clearSession()
        router.push('/login')
      } else {
        setError('Failed to load data')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateKey() {
    setGeneratingKey(true)
    try {
      const res = await api.generateKey()
      setKeys(prev => [{
        id: res.id,
        key: res.api_key,
        created_at: res.created_at,
        credits_remaining: user?.credits ?? 0,
      }, ...prev])
    } catch (err) {
      setError('Failed to generate key')
    } finally {
      setGeneratingKey(false)
    }
  }

  async function copyKey(id: string, key: string) {
    await navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleLogout() {
    clearSession()
    router.push('/')
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  function maskKey(key: string) {
    return key.slice(0, 12) + '••••••••••••' + key.slice(-4)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#080A0C',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 13,
          color: 'rgba(255,255,255,0.3)',
        }}>
          Loading<span style={{ animation: 'blink 1s step-start infinite' }}>…</span>
        </div>
      </div>
    )
  }

  const email = typeof window !== 'undefined' ? localStorage.getItem('wren_email') || user?.email : user?.email

  return (
    <div style={{ minHeight: '100vh', background: '#080A0C' }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(245,158,11,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.03) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Nav */}
      <nav style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(8,10,12,0.88)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          height: 60, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L4 7V14C4 19.5 8.5 24.7 14 26C19.5 24.7 24 19.5 24 14V7L14 2Z"
                stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M10 14L13 17L18 11" stroke="#F59E0B" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
              wren<span style={{ color: '#F59E0B' }}>.</span>
            </span>
            <span style={{
              marginLeft: 8, fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-mono)',
            }}>
              / dashboard
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{email}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '6px 12px',
                color: 'rgba(255,255,255,0.5)', fontSize: 12,
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'var(--font-mono)',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.borderColor = 'rgba(248,81,73,0.4)'
                ;(e.target as HTMLElement).style.color = '#F87171'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
                ;(e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
              }}
            >
              logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px', position: 'relative' }}>
        {error && (
          <div style={{
            background: 'rgba(248,81,73,0.08)',
            border: '1px solid rgba(248,81,73,0.2)',
            borderRadius: 8, padding: '10px 14px',
            marginBottom: 24, fontSize: 13, color: '#F87171',
          }}>
            {error}
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: 32,
        }}>
          <StatCard
            label="CREDITS REMAINING"
            value={String(user?.credits ?? 0)}
            accent="#F59E0B"
            sub="1 credit per request"
          />
          <StatCard
            label="API KEYS"
            value={String(keys.length)}
            accent="#3FB950"
            sub="Active keys"
          />
          <StatCard
            label="REQUESTS USED"
            value={String(Math.max(0, 100 - (user?.credits ?? 0)))}
            accent="#58A6FF"
            sub="Since account creation"
          />
        </div>

        {/* API Keys section */}
        <div style={{
          background: '#0D1117',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: 16, marginBottom: 2,
              }}>
                API Keys
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Use these in your WrenClient SDK calls
              </div>
            </div>
            <button
              onClick={handleGenerateKey}
              disabled={generatingKey}
              style={{
                background: generatingKey ? 'rgba(245,158,11,0.4)' : '#F59E0B',
                color: '#000',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 13, padding: '8px 16px',
                borderRadius: 8, border: 'none',
                cursor: generatingKey ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {generatingKey ? 'Generating…' : '+ Generate new key'}
            </button>
          </div>

          {/* Key list */}
          {keys.length === 0 ? (
            <div style={{
              padding: '40px 24px', textAlign: 'center',
              color: 'rgba(255,255,255,0.25)', fontSize: 13,
              fontFamily: 'var(--font-mono)',
            }}>
              No keys yet. Generate one above.
            </div>
          ) : (
            <div>
              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 100px',
                gap: 16, padding: '10px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                {['KEY', 'CREATED', 'ACTIONS'].map(h => (
                  <span key={h} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em',
                  }}>
                    {h}
                  </span>
                ))}
              </div>

              {keys.map(k => (
                <div
                  key={k.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 180px 100px',
                    gap: 16, padding: '14px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 13,
                      color: '#FBBF24',
                    }}>
                      {maskKey(k.key)}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    {formatDate(k.created_at)}
                  </span>
                  <button
                    onClick={() => copyKey(k.id, k.key)}
                    style={{
                      background: copiedId === k.id ? 'rgba(63,185,80,0.1)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${copiedId === k.id ? 'rgba(63,185,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 6, padding: '5px 12px',
                      color: copiedId === k.id ? '#3FB950' : 'rgba(255,255,255,0.5)',
                      fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copiedId === k.id ? '✓ copied' : 'copy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick start */}
        <div style={{
          background: '#0D1117',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em',
            marginBottom: 16,
          }}>
            QUICK START
          </div>
          <div style={{
            background: '#161B22',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{
              padding: '8px 16px',
              background: '#1C2128',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(245,158,11,0.5)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                app.py
              </span>
            </div>
            <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8 }}>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>1 </span><span style={{ color: 'rgba(255,255,255,0.6)' }}>from wren_gateway import WrenClient</span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>2 </span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>3 </span><span style={{ color: 'rgba(255,255,255,0.6)' }}>client = WrenClient(</span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>4 </span><span style={{ color: 'rgba(255,255,255,0.4)' }}>    base_url=</span><span style={{ color: '#79c0ff' }}>"http://localhost:8000"</span><span style={{ color: 'rgba(255,255,255,0.4)' }}>,</span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>5 </span><span style={{ color: 'rgba(255,255,255,0.4)' }}>    api_key=</span><span style={{ color: '#FBBF24' }}>{keys[0] ? `"${maskKey(keys[0].key)}"` : '"wren_sk_..."'}</span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>6 </span><span style={{ color: 'rgba(255,255,255,0.6)' }}>)</span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>7 </span></div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>8 </span><span style={{ color: 'rgba(255,255,255,0.5)' }}>response = client.simple_chat(</span><span style={{ color: '#79c0ff' }}>"Hello"</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent, sub }: {
  label: string; value: string; accent: string; sub: string
}) {
  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '20px 24px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em',
        marginBottom: 10,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 36, color: accent,
        textShadow: `0 0 20px ${accent}40`,
        marginBottom: 4, letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{sub}</div>
    </div>
  )
}