import { create } from "zustand"

import type { WebhookLog } from "@/types"

interface LogsState {
  logs: WebhookLog[]
  selectedLogId: number | null
  addLog: (log: WebhookLog) => void
  selectLog: (id: number | null) => void
  clearLogs: () => void
}

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  selectedLogId: null,
  addLog: (log) =>
    set((state) => {
      if (state.logs.some((item) => item.id === log.id)) return state
      return {
        logs: [log, ...state.logs],
        selectedLogId: state.selectedLogId ?? log.id,
      }
    }),
  selectLog: (id) => set({ selectedLogId: id }),
  clearLogs: () => set({ logs: [], selectedLogId: null }),
}))
