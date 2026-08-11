import { Braces } from "lucide-react";
import ReactJson from "@microlink/react-json-view";
import { toast } from "sonner";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const JSON_THEME = {
  base00: "#1c1b1b",
  base01: "#201f1f",
  base02: "#2b2a2a",
  base03: "#353434",
  base04: "#353434",
  base05: "#e5e2e1",
  base06: "#e5e2e1",
  base07: "#e5e2e1",
  base08: "#f87171",
  base09: "#93c5fd",
  base0A: "#7dd3fc",
  base0B: "#86efac",
  base0C: "#7dd3fc",
  base0D: "#7dd3fc",
  base0E: "#c4b5fd",
  base0F: "#f5c99b",
} as const;

interface JsonViewerProps {
  data: unknown;
  collapsed?: boolean | number;
  maxStringLength?: number;
  className?: string;
}

function JsonViewer({
  data,
  collapsed = false,
  maxStringLength = 100,
  className,
}: JsonViewerProps) {
  if (data === null || data === undefined) {
    return (
      <EmptyState
        icon={Braces}
        title="No JSON body"
        description="This request did not include a JSON body"
      />
    );
  }

  function renderRaw(value: unknown) {
    let content: string;
    try {
      content = JSON.stringify(value, null, 2);
    } catch {
      content = String(value);
    }
    return (
      <div
        className={cn(
          "overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low p-6",
          className,
        )}
      >
        <pre className="font-code-md text-code-md text-on-surface whitespace-pre-wrap wrap-break-word">
          {content}
        </pre>
      </div>
    );
  }

  const parsed = typeof data === "string" ? tryParseJson(data) : data;
  if (typeof parsed === "object" && parsed !== null) {
    return (
      <div
        className={cn(
          "overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low p-6",
          className,
        )}
      >
        <ReactJson
          src={parsed as object}
          name={false}
          theme={JSON_THEME}
          enableClipboard={() => toast.success("Copied")}
          collapsed={collapsed}
          collapseStringsAfterLength={maxStringLength}
          indentWidth={2}
          iconStyle="triangle"
          sortKeys={false}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      </div>
    );
  }

  return renderRaw(parsed);
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export default JsonViewer;
