/**
 * Wren API client
 * All calls to the FastAPI auth backend go through here.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export class WrenAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'WrenAPIError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('wren_token') : null

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new WrenAPIError(res.status, err.detail || 'Request failed')
  }

  return res.json()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface SignupResponse {
  user_id: string
  email: string
  credits: number
  api_key: string
  token: string
}

export interface LoginResponse {
  token: string
  user_id: string
  email: string
}

export interface ApiKey {
  id: string
  key: string
  created_at: string
  credits_remaining: number
}

export interface UserInfo {
  id: string
  email: string
  credits: number
  created_at: string
}

export const api = {
  signup: (email: string, password: string) =>
    request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<UserInfo>('/auth/me'),

  listApiKeys: () => request<ApiKey[]>('/auth/api-keys'),

  generateKey: () =>
    request<{ api_key: string; id: string; created_at: string }>(
      '/auth/generate-key',
      { method: 'POST' }
    ),
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export function saveSession(token: string, email: string) {
  localStorage.setItem('wren_token', token)
  localStorage.setItem('wren_email', email)
}

export function clearSession() {
  localStorage.removeItem('wren_token')
  localStorage.removeItem('wren_email')
}

export function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('wren_token') : null
}

export function isLoggedIn() {
  return !!getToken()
}