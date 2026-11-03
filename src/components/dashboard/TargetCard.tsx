import { Target } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export function TargetCard({ target, onDelete }: { target: Target; onDelete: (id: string) => void }) {
  return (
    <Card className="relative border-border/70 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="truncate pr-8 text-base tracking-tight normal-case">{target.name}</CardTitle>
        <button aria-label={`Delete ${target.name}`} onClick={() => onDelete(target.id)} className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <a href={target.url} target="_blank" rel="noreferrer" className="mb-3 block truncate text-sm text-blue-600 hover:underline dark:text-blue-400">
          View Page
        </a>
        <div className="truncate rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          {target.selector}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <div className={`h-2.5 w-2.5 rounded-full ${target.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          {target.is_active ? 'Active' : 'Paused'}
        </div>
      </CardContent>
    </Card>
  );
}