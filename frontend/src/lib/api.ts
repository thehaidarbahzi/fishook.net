import type { ApiError, Session } from "@/types"

const API_BASE_URL = "http://localhost:3000"

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const err = (await res.json()) as ApiError
      message = err.message || message
    } catch {
      // non-JSON error body — pakai statusText fallback
    }
    throw new Error(message)
  }

  return (await res.json()) as T
}

export function fetchSession(): Promise<Session> {
  return apiFetch<Session>("/api/v1/session/me")
}
