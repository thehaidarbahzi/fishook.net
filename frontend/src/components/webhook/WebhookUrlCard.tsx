import { Link, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CopyButton from "@/components/shared/CopyButton";
import { formatTimeRemaining } from "@/lib/format";

interface WebhookUrlCardProps {
  webhookUrl: string;
  expiresAt: string;
  loading?: boolean;
  onRetry?: () => void;
}

function WebhookUrlCard({
  webhookUrl,
  expiresAt,
  loading = false,
  onRetry,
}: WebhookUrlCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card size="sm">
        <CardContent className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
        </CardContent>
      </Card>
    );
  }

  if (!webhookUrl) {
    return (
      <Card size="sm">
        <CardContent className="flex items-center justify-between gap-3">
          <span className="font-code-sm text-code-sm text-muted-foreground">
            Failed to load webhook URL
          </span>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm">
      <CardContent className="space-y-2">
        <p className="font-label-caps text-label-caps uppercase text-muted-foreground">
          Webhook URL
        </p>
        <div className="flex items-center gap-2 border border-outline-variant bg-surface-container-low rounded-lg px-3 py-2">
          <Link className="size-4 shrink-0 text-on-surface-variant" />
          <code
            className="min-w-0 flex-1 truncate font-code-md text-code-md text-primary select-all"
            title={webhookUrl}
          >
            {webhookUrl}
          </code>
          <CopyButton value={webhookUrl} label="Copy webhook URL" />
          <Separator orientation="vertical" className="h-4 shrink-0" />
          <div
            className="shrink-0 flex items-center gap-1.5 text-on-surface-variant"
            title={expiresAt}
          >
            <Timer className="size-4" />
            <span className="font-label-caps text-label-caps">
              {formatTimeRemaining(expiresAt, now)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WebhookUrlCard;
