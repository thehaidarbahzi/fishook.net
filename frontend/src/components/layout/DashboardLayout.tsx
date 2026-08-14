import { Settings } from "lucide-react";

import RequestDetail from "@/components/detail/RequestDetail";
import LogList from "@/components/log/LogList";
import WebhookUrlCard from "@/components/webhook/WebhookUrlCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WebSocketStatus } from "@/types";

interface DashboardLayoutProps {
  wsStatus: WebSocketStatus;
  webhookUrl: string;
  expiresAt: string;
  loading?: boolean;
  onRetryWebhook?: () => void;
}

function DashboardLayout({
  wsStatus,
  webhookUrl,
  expiresAt,
  loading = false,
  onRetryWebhook,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface text-on-surface">
      <header className="z-50 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container px-gutter">
        <div className="flex min-w-0 items-center gap-stack-md">
          <span className="font-display text-display font-black text-on-surface">
            Fishook
          </span>
          <WsStatusBadge status={wsStatus} />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <WebhookUrlCard
              webhookUrl={webhookUrl}
              expiresAt={expiresAt}
              loading={loading}
              onRetry={onRetryWebhook}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Settings"
            title="Settings"
          >
            <Settings />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[320px] shrink-0 overflow-hidden border-r border-outline-variant bg-surface-container-low py-stack-md">
          <LogList />
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-surface-dim p-gutter">
          <RequestDetail />
        </main>
      </div>
    </div>
  );
}

const WS_STATUS_META: Record<
  WebSocketStatus,
  { dot: string; label: string; labelColor: string }
> = {
  open: {
    dot: "bg-green-500",
    label: "Connected via WebSocket",
    labelColor: "text-green-500",
  },
  connecting: {
    dot: "bg-amber-500",
    label: "Connecting…",
    labelColor: "text-amber-500",
  },
  reconnecting: {
    dot: "bg-amber-500",
    label: "Reconnecting…",
    labelColor: "text-amber-500",
  },
  closed: {
    dot: "bg-muted-foreground",
    label: "Disconnected",
    labelColor: "text-muted-foreground",
  },
};

function WsStatusBadge({ status }: { status: WebSocketStatus }) {
  const meta = WS_STATUS_META[status];
  const isPulsing = status === "open" || status === "reconnecting";

  return (
    <div className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-high px-3 py-1">
      <span
        className={cn(
          "size-2 rounded-full",
          meta.dot,
          isPulsing && "animate-pulse",
        )}
      />
      <span
        className={cn(
          "text-[11px] font-bold tracking-wider uppercase",
          meta.labelColor,
        )}
      >
        {meta.label}
      </span>
    </div>
  );
}

export default DashboardLayout;
