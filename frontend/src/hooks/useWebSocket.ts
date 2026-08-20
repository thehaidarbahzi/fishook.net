import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { useLogsStore } from "@/stores/logsStore"
import { useSessionStore } from "@/stores/sessionStore"
import type { WebhookLog, WebSocketStatus } from "@/types"

const WS_BASE = "ws://localhost:3000"
const RECONNECT_DELAY = 3000

export function useWebSocket() {
  const webhookId = useSessionStore((s) => s.session?.webhookId)
  const addLog = useLogsStore((s) => s.addLog)
  const clearLogs = useLogsStore((s) => s.clearLogs)

  const [status, setStatus] = useState<WebSocketStatus>("connecting")
  const wasReconnecting = useRef(false)

  useEffect(() => {
    if (!webhookId) return
    let disposed = false
    let timer: number | undefined
    let ws: WebSocket | undefined

    clearLogs()

    const connect = () => {
      if (disposed) return
      ws = new WebSocket(`${WS_BASE}?webhook_id=${encodeURIComponent(webhookId)}`)
      setStatus("connecting")

      ws.onopen = () => {
        setStatus("open")
        if (wasReconnecting.current) {
          wasReconnecting.current = false
          toast.success("Reconnected")
        }
      }
      ws.onmessage = (event: MessageEvent) => {
        try {
          const log = JSON.parse(event.data as string) as WebhookLog
          addLog(log)
        } catch {
          // pesan malformed — abaikan, jangan putus koneksi
        }
      }
      ws.onerror = () => {}
      ws.onclose = () => {
        if (disposed) return
        setStatus("reconnecting")
        if (!wasReconnecting.current) {
          wasReconnecting.current = true
          toast.warning("Connection lost — reconnecting…")
        }
        timer = window.setTimeout(connect, RECONNECT_DELAY)
      }
    }

    connect()

    return () => {
      disposed = true
      if (timer) clearTimeout(timer)
      ws?.close()
    }
  }, [webhookId, addLog, clearLogs])

  return { status }
}