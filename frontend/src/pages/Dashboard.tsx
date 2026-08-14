import { Clock, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/useSession";
import { useWebSocket } from "@/hooks/useWebSocket";

function Dashboard() {
  const { session, status, error, isExpired, load } = useSession();
  const { status: wsStatus } = useWebSocket();

  useEffect(() => {
    if (status === "error" && error) {
      toast.error(error);
    }
  }, [status, error]);

  if (status === "idle" || status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "error" || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center p-gutter">
        <EmptyState
          icon={TriangleAlert}
          title="Failed to load session"
          description={error ?? undefined}
          action={
            <Button type="button" variant="outline" onClick={load}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  if (isExpired()) {
    return (
      <main className="flex min-h-screen items-center justify-center p-gutter">
        <EmptyState
          icon={Clock}
          title="Webhook expired"
          description="Generate a new one to keep receiving requests"
          action={
            <Button type="button" onClick={load}>
              Generate new webhook
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <DashboardLayout
      wsStatus={wsStatus}
      webhookUrl={session.webhookUrl}
      expiresAt={session.expiresAt}
      onRetryWebhook={load}
    />
  );
}

function DashboardSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-gutter">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline-sm text-headline-sm">
            Loading session…
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-stack-md">
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
        </CardContent>
      </Card>
    </main>
  );
}

export default Dashboard;