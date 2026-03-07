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
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
      return
    }
    loadData()
  }, [])

  async function loadData() {
    try {
      const [userInfo, apiKeys, attackEvents] = await Promise.all([
        api.me(),
        api.listApiKeys(),
        api.events()
      ])
      setUser(userInfo)
      setKeys(apiKeys)
      setEvents(attackEvents)
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
    setError('')
    try {
      const res = await api.generateKey()
      setKeys(prev => [{
        id: res.id,
        key: res.api_key,
        created_at: res.created_at,
        credits_remaining: res.credits || 100,
      }, ...prev])
      // Refresh user data to show reset credits
      const userInfo = await api.me()
      setUser(userInfo)
    } catch (err) {
      if (err instanceof WrenAPIError) {
        setError(err.message)
      } else {
        setError('Failed to generate key')
      }
    } finally {
      setGeneratingKey(false)
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm('Are you sure you want to delete this API key?')) return
    
    try {
      await api.deleteKey(id)
      setKeys(prev => prev.filter(k => k.id !== id))
    } catch (err) {
      setError('Failed to delete API key')
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
                gridTemplateColumns: '1fr 180px 180px',
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
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
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
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {copiedId === k.id ? '✓ copied' : 'copy'}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(k.id)}
                      style={{
                        background: 'rgba(248,81,73,0.05)',
                        border: '1px solid rgba(248,81,73,0.15)',
                        borderRadius: 6, padding: '5px 12px',
                        color: '#F87171',
                        fontSize: 12, cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLElement).style.background = 'rgba(248,81,73,0.1)'
                        ;(e.target as HTMLElement).style.borderColor = 'rgba(248,81,73,0.3)'
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLElement).style.background = 'rgba(248,81,73,0.05)'
                        ;(e.target as HTMLElement).style.borderColor = 'rgba(248,81,73,0.15)'
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Events Section */}
        <div style={{
          background: '#0D1117',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: '24px',
          marginTop: 24,
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 16
          }}>
            Security Events
          </div>

          {events.length === 0 ? (
            <div style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: 13,
              fontFamily: 'var(--font-mono)'
            }}>
              No attacks detected yet.
            </div>
          ) : (
            <div>
              {events.map((e, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i === events.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase'
                      }}>{e.module}</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: e.severity === 'high' ? '#FF7B72' : e.severity === 'medium' ? '#F59E0B' : '#3FB950'
                      }}>{e.severity.toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{e.reason}</span>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Just now'}
                  </div>
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