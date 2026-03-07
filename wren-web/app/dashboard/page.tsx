'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
      const email = typeof window !== 'undefined' ? localStorage.getItem('wren_email') : null
      
      if (email === 'demo@wren.dev') {
        setUser({ email: 'demo@wren.dev', credits: 100 })
        setKeys([{
          id: 'demo_key_1',
          key: 'wren_sk_2d39305d43a9409089507be5f6c89520',
          created_at: new Date().toISOString(),
          credits_remaining: 100
        }])
        setEvents([])
        setLoading(false)
        return
      }

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
      <div className="min-h-screen flex items-center justify-center bg-[#14120B]">
        <div className="font-mono text-[13px] text-[#555]">
          Loading<span className="animate-pulse">…</span>
        </div>
      </div>
    )
  }

  const email = typeof window !== 'undefined' ? localStorage.getItem('wren_email') || user?.email : user?.email

  return (
    <div className="min-h-screen bg-[#14120B]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#14120B]/90 border-b border-[#222]">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" width={20} height={20} alt="Wren Logo" className="object-contain" />
            <span className="font-display font-medium text-[16px] text-[#EAEAEA]">
              wren
            </span>
            <span className="ml-2 text-[12px] text-[#555] font-mono">
              / dashboard
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#888]">{email}</span>
            <button
              onClick={handleLogout}
              className="bg-transparent border border-[#333] rounded-md px-3 py-1.5 text-[#888] text-[12px] font-mono hover:border-[#F85149]/40 hover:text-[#F85149] transition-all"
            >
              logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 py-10 relative">
        {error && (
          <div className="bg-[#3A1414] border border-[#5A1414] rounded-lg p-3 mb-6 text-[13px] text-[#F85149] font-mono">
            {error}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="CREDITS REMAINING"
            value={String(user?.credits ?? 0)}
            accent="#EAEAEA"
            sub="1 credit per request"
          />
          <StatCard
            label="API KEYS"
            value={String(keys.length)}
            accent="#EAEAEA"
            sub="Active keys"
          />
          <StatCard
            label="REQUESTS USED"
            value={String(Math.max(0, 100 - (user?.credits ?? 0)))}
            accent="#EAEAEA"
            sub="Since account creation"
          />
        </div>

        {/* API Keys section */}
        <div className="bg-[#0A0A09] border border-[#222] rounded-xl overflow-hidden mb-8">
          <div className="flex items-center justify-between p-6 border-b border-[#222]">
            <div>
              <div className="font-display font-medium text-[16px] text-[#EAEAEA] mb-1">
                API Keys
              </div>
              <div className="text-[13px] text-[#555] font-body">
                Use these in your WrenClient SDK calls
              </div>
            </div>
            <button
              onClick={handleGenerateKey}
              disabled={generatingKey}
              className={`font-medium text-[13px] px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                generatingKey 
                  ? 'bg-[#EAEAEA]/50 text-black cursor-not-allowed' 
                  : 'bg-[#EAEAEA] text-black hover:bg-white'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              {generatingKey ? 'Generating…' : 'Generate key'}
            </button>
          </div>

          {/* Key list */}
          {keys.length === 0 ? (
            <div className="p-10 text-center text-[#555] text-[13px] font-mono">
              No keys yet. Generate one above.
            </div>
          ) : (
            <div>
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_180px_140px] gap-4 px-6 py-3 border-b border-[#1a1a1a]">
                {['KEY', 'CREATED', 'ACTIONS'].map(h => (
                  <span key={h} className="font-mono text-[10px] text-[#555] tracking-[0.1em]">
                    {h}
                  </span>
                ))}
              </div>

              {keys.map(k => (
                <div
                  key={k.id}
                  className="grid grid-cols-[1fr_180px_140px] gap-4 px-6 py-4 border-b border-[#1a1a1a] items-center hover:bg-[#111111] transition-colors last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] text-[#EAEAEA]">
                      {maskKey(k.key)}
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-[#888]">
                    {formatDate(k.created_at)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyKey(k.id, k.key)}
                      className={`border rounded-md px-3 py-1.5 text-[12px] font-mono transition-all whitespace-nowrap ${
                        copiedId === k.id 
                          ? 'bg-[#142A19] border-[#1F4D29] text-[#3FB950]' 
                          : 'bg-transparent border-[#333] text-[#888] hover:border-[#555] hover:text-[#EAEAEA]'
                      }`}
                    >
                      {copiedId === k.id ? '✓ copied' : 'copy'}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(k.id)}
                      className="bg-transparent border border-[#3A1414] rounded-md px-3 py-1.5 text-[#F85149] text-[12px] font-mono hover:bg-[#3A1414] hover:border-[#5A1414] transition-all whitespace-nowrap"
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
        <div className="bg-[#0A0A09] border border-[#222] rounded-xl p-6 mb-8">
          <div className="font-display font-medium text-[16px] text-[#EAEAEA] mb-4">
            Security Events
          </div>

          {events.length === 0 ? (
            <div className="text-[#555] text-[13px] font-mono mt-2 py-4 border-t border-[#1a1a1a]">
              No attacks detected yet.
            </div>
          ) : (
            <div>
              {events.map((e, i) => (
                <div key={i} className={`flex justify-between py-3 items-center ${i === events.length - 1 ? '' : 'border-b border-[#1a1a1a]'}`}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#161616] text-[#888] uppercase border border-[#333]">
                        {e.module}
                      </span>
                      <span className={`text-[11px] font-semibold uppercase ${
                        e.severity === 'high' ? 'text-[#F85149]' : 
                        e.severity === 'medium' ? 'text-[#EAEAEA]' : 'text-[#3FB950]'
                      }`}>
                        {e.severity}
                      </span>
                    </div>
                    <span className="text-[13px] text-[#EAEAEA]">{e.reason}</span>
                  </div>
                  <div className="text-[12px] text-[#555] font-mono">
                    {e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Just now'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick start */}
        <div className="bg-[#0A0A09] border border-[#222] rounded-xl p-6">
          <div className="font-mono text-[11px] text-[#555] tracking-[0.12em] mb-4">
            QUICK START
          </div>
          <div className="bg-[#121212] border border-[#222] rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-[#161616] border-b border-[#222] flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#888]">
                app.py
              </span>
            </div>
            <div className="p-4 font-mono text-[12px] leading-relaxed">
              <div><span className="text-[#555]">1 </span><span className="text-[#EAEAEA]">from wren_gateway import WrenClient</span></div>
              <div><span className="text-[#555]">2 </span></div>
              <div><span className="text-[#555]">3 </span><span className="text-[#EAEAEA]">client = WrenClient(</span></div>
              <div><span className="text-[#555]">4 </span><span className="text-[#888]">    base_url=</span><span className="text-[#888]">"http://localhost:8000"</span><span className="text-[#888]">,</span></div>
              <div><span className="text-[#555]">5 </span><span className="text-[#888]">    api_key=</span><span className="text-[#EAEAEA]">{keys[0] ? `"${maskKey(keys[0].key)}"` : '"wren_sk_..."'}</span></div>
              <div><span className="text-[#555]">6 </span><span className="text-[#EAEAEA]">)</span></div>
              <div><span className="text-[#555]">7 </span></div>
              <div><span className="text-[#555]">8 </span><span className="text-[#888]">response = client.simple_chat(</span><span className="text-[#888]">"Hello"</span><span className="text-[#888]">)</span></div>
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
    <div className="bg-[#0A0A09] border border-[#222] rounded-xl p-5 sm:p-6">
      <div className="font-mono text-[10px] text-[#555] tracking-[0.12em] mb-2.5">
        {label}
      </div>
      <div className="font-display font-medium text-[36px] bg-clip-text text-transparent bg-gradient-to-b from-[#FFF] to-[#AAA] mb-1 tracking-tight">
        {value}
      </div>
      <div className="text-[12px] text-[#555] font-body">{sub}</div>
    </div>
  )
}