const API = "http://localhost:9000"

export interface UserInfo {
  email: string
  credits: number
}

export interface ApiKey {
  id: string
  key: string
  created_at: string
  credits_remaining: number
}

export class WrenAPIError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request(path: string, options: any = {}) {
  const token = localStorage.getItem("wren_token")

  const res = await fetch(API + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-token": token } : {}),
      ...(options.headers || {})
    },
    ...options
  })

  const data = await res.json()

  if (!res.ok) {
    throw new WrenAPIError(data.detail || "API error", res.status)
  }

  return data
}

export const api = {
  signup: (email: string, password: string) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  me: () => request("/auth/me"),

  listApiKeys: () => request("/auth/api-keys"),

  generateKey: () =>
    request("/auth/generate-key", { method: "POST" }),

  events: () =>
    request("/auth/events"),

  deleteKey: (keyId: string) =>
    request(`/auth/delete-key/${keyId}`, { method: "POST" })
}

export function saveSession(token: string, email: string) {
  localStorage.setItem("wren_token", token)
  localStorage.setItem("wren_email", email)
}

export function getToken() {
  return localStorage.getItem("wren_token")
}

export function clearSession() {
  localStorage.removeItem("wren_token")
  localStorage.removeItem("wren_email")
}