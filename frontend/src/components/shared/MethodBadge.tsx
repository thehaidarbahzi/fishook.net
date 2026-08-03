import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import type { HttpMethod } from "@/types";

const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "text-green-400 border-green-400/30 bg-green-400/10",
  POST: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  PUT: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  DELETE: "text-red-400 border-red-400/30 bg-red-400/10",
  PATCH: "text-violet-400 border-violet-400/30 bg-violet-400/10",
};

interface MethodBadgeProps {
  method: HttpMethod;
  className?: string;
}

function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-label-caps font-semibold uppercase",
        METHOD_STYLES[method],
        className,
      )}
    >
      {method}
    </Badge>
  );
}

export default MethodBadge;
