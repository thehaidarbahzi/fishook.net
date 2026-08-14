import { ListFilter, MousePointerClick } from "lucide-react";

import HeadersTable from "@/components/detail/HeadersTable";
import JsonViewer from "@/components/detail/JsonViewer";
import CopyButton from "@/components/shared/CopyButton";
import EmptyState from "@/components/shared/EmptyState";
import MethodBadge from "@/components/shared/MethodBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatLogTime } from "@/lib/format";
import { useLogsStore } from "@/stores/logsStore";

const LARGE_BODY_BYTES = 1_000_000;

function RequestDetail() {
  const logs = useLogsStore((s) => s.logs);
  const selectedLogId = useLogsStore((s) => s.selectedLogId);

  const selectedLog = logs.find((log) => log.id === selectedLogId) ?? null;

  if (!selectedLog) {
    return (
      <EmptyState
        icon={MousePointerClick}
        title="Select a request"
        description="Choose a request from the sidebar to inspect its payload"
      />
    );
  }

  const queryParams = normalizeQueryParams(selectedLog.queryParams);

  return (
    <div className="flex h-full min-h-0 flex-col gap-stack-md">
      <div className="flex flex-col gap-4 border-b border-outline-variant pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <MethodBadge
              method={selectedLog.method}
              className="px-3 py-1 text-headline-sm"
            />
            <h1 className="min-w-0 truncate font-code-md text-headline-sm text-on-surface">
              {selectedLog.webhookId}
            </h1>
            <CopyButton value={selectedLog.webhookId} label="Copy webhook ID" />
          </div>
          <div className="flex shrink-0 flex-col text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Received
            </p>
            <p className="font-bold text-on-surface">
              {formatLogTime(selectedLog.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-2">
          <span className="px-2 font-code-sm text-code-sm text-on-surface-variant">
            Request URL:
          </span>
          <code className="select-all font-code-sm text-code-sm text-primary">
            /api/v1/listen/{selectedLog.webhookId}
          </code>
        </div>
      </div>

      <Tabs defaultValue="body" className="min-h-0 flex-1">
        <TabsList variant="line" className="mb-stack-md w-full">
          <TabsTrigger value="body">Body (JSON)</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="query">Query Params</TabsTrigger>
        </TabsList>
        <TabsContent value="body" className="min-h-0">
          <JsonViewer
            data={selectedLog.body}
            collapsed={isLargeBody(selectedLog.body)}
          />
        </TabsContent>
        <TabsContent value="headers" className="min-h-0">
          <HeadersTable headers={selectedLog.headers} />
        </TabsContent>
        <TabsContent value="query" className="min-h-0">
          {!queryParams ? (
            <EmptyState
              icon={ListFilter}
              title="No query parameters"
              description="No query parameters detected in this request"
            />
          ) : (
            <HeadersTable headers={queryParams} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function isLargeBody(body: unknown): boolean {
  if (body === null || body === undefined) return false;
  try {
    return JSON.stringify(body).length > LARGE_BODY_BYTES;
  } catch {
    return false;
  }
}

function normalizeQueryParams(
  queryParams: Record<string, string | string[]> | null | undefined,
): Record<string, string> | null {
  if (!queryParams || Object.keys(queryParams).length === 0) return null;
  return Object.fromEntries(
    Object.entries(queryParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(", ") : value,
    ]),
  );
}

export default RequestDetail;
