import { TableProperties } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";

interface HeadersTableProps {
  headers: Record<string, string> | null | undefined;
}

function HeadersTable({ headers }: HeadersTableProps) {
  if (!headers || Object.keys(headers).length === 0) {
    return (
      <EmptyState
        icon={TableProperties}
        title="No headers"
        description="No headers received in this request"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <table className="w-full border-collapse text-left font-code-md text-code-md">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-high">
            <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Key
            </th>
            <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {Object.entries(headers).map(([key, value]) => (
            <tr key={key}>
              <td className="p-4 pr-4 align-top font-bold text-primary">
                {key}
              </td>
              <td className="p-4 break-all text-on-surface">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HeadersTable;
