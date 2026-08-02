import { useCallback, useEffect } from "react"

import { fetchSession } from "@/lib/api"
import { useSessionStore } from "@/stores/sessionStore"

export function useSession() {
  const session = useSessionStore((s) => s.session)
  const status = useSessionStore((s) => s.status)
  const error = useSessionStore((s) => s.error)
  const setSession = useSessionStore((s) => s.setSession)
  const setStatus = useSessionStore((s) => s.setStatus)
  const setError = useSessionStore((s) => s.setError)
  const clearSession = useSessionStore((s) => s.clearSession)

  const load = useCallback(async () => {
    setStatus("loading")
    try {
      const data = await fetchSession()
      setSession(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session")
    }
  }, [setSession, setStatus, setError])

  useEffect(() => {
    load()
  }, [load])

  const isExpired = useCallback(() => {
    if (!session) return false
    return new Date(session.expiresAt).getTime() <= Date.now()
  }, [session])

  return { session, status, error, isExpired, load, clear: clearSession }
}