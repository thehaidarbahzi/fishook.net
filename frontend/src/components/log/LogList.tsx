import { Inbox, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import EmptyState from "@/components/shared/EmptyState";
import LogItem from "@/components/log/LogItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogsStore } from "@/stores/logsStore";
import type { WebSocketStatus } from "@/types";

const CLEAR_CONFIRM_LABEL = "Confirm clear?";
const CLEAR_RESET_MS = 3000;
const SKELETON_COUNT = 5;

interface LogListProps {
  wsStatus: WebSocketStatus;
}

function LogList({ wsStatus }: LogListProps) {
  const logs = useLogsStore((s) => s.logs);
  const selectedLogId = useLogsStore((s) => s.selectedLogId);
  const selectLog = useLogsStore((s) => s.selectLog);
  const clearLogs = useLogsStore((s) => s.clearLogs);

  const [confirming, setConfirming] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);
  const hasLogs = logs.length > 0;
  const isStreaming = wsStatus === "connecting" || wsStatus === "reconnecting";

  useEffect(() => {
    return () => window.clearTimeout(resetTimer.current);
  }, []);

  function handleClear() {
    if (!confirming) {
      setConfirming(true);
      resetTimer.current = window.setTimeout(() => setConfirming(false), CLEAR_RESET_MS);
      return;
    }
    window.clearTimeout(resetTimer.current);
    setConfirming(false);
    clearLogs();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-end justify-between px-4">
        <div>
          <h2 className="font-headline-sm text-foreground font-bold">
            Request History
          </h2>
          <p className="font-body-sm text-on-surface-variant opacity-70">
            Real-time updates
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className={confirming ? "text-destructive" : "font-label-caps text-label-caps uppercase text-primary"}
          disabled={!hasLogs}
          onClick={handleClear}
        >
          {confirming ? CLEAR_CONFIRM_LABEL : "Clear All"}
        </Button>
      </div>

      {isStreaming && !hasLogs ? (
        <div className="space-y-1 px-2">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1 p-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-3.5 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : wsStatus === "closed" && !hasLogs ? (
        <EmptyState
          icon={WifiOff}
          title="Disconnected"
          description="Real-time stream unavailable"
        />
      ) : !hasLogs ? (
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          description="Waiting for incoming webhooks…"
        />
      ) : (
        <ScrollArea className="min-h-0 flex-1 px-2">
          <ul className="space-y-1">
            {logs.map((log) => (
              <li key={log.id}>
                <LogItem
                  log={log}
                  selected={log.id === selectedLogId}
                  onSelect={selectLog}
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}

export default LogList;