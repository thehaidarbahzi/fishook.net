import { create } from "zustand"

import type { Session } from "@/types"

type SessionStatus = "idle" | "loading" | "success" | "error"

interface SessionState {
  session: Session | null
  status: SessionStatus
  error: string | null
  setSession: (session: Session) => void
  setStatus: (status: SessionStatus) => void
  setError: (error: string | null) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: "idle",
  error: null,
  setSession: (session) => set({ session, status: "success", error: null }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: "error" }),
  clearSession: () => set({ session: null, status: "idle", error: null }),
}))
