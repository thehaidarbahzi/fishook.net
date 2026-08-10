import { cn } from "@/lib/utils";
import { formatLogTime, summarizeBody } from "@/lib/format";
import type { WebhookLog } from "@/types";
import MethodBadge from "@/components/shared/MethodBadge";

interface LogItemProps {
  log: WebhookLog;
  selected: boolean;
  onSelect: (id: number) => void;
}

function LogItem({ log, selected, onSelect }: LogItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(log.id)}
      className={cn(
        "group w-full cursor-pointer border-l-2 p-3 text-left transition-all",
        selected
          ? "rounded-r-lg border-primary bg-secondary-container text-on-secondary-container"
          : "border-transparent rounded-lg hover:bg-surface-variant"
      )}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <MethodBadge method={log.method} />
        <span className="font-code-sm text-code-sm opacity-60">
          {formatLogTime(log.createdAt)}
        </span>
      </div>
      <p className="mb-1 truncate font-code-md text-code-md">
        {log.webhookId}
      </p>
      <p className="truncate font-code-sm text-code-sm opacity-50">
        {summarizeBody(log.body)}
      </p>
    </button>
  );
}

export default LogItem;