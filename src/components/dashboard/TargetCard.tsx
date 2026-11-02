import { Target } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export function TargetCard({ target, onDelete }: { target: Target; onDelete: (id: string) => void }) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg truncate pr-8">{target.name}</CardTitle>
        <button onClick={() => onDelete(target.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <Trash2 className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <a href={target.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline block mb-2 truncate">
          View Page
        </a>
        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded truncate">
          {target.selector}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
          <div className={`h-2.5 w-2.5 rounded-full ${target.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          {target.is_active ? 'Active' : 'Paused'}
        </div>
      </CardContent>
    </Card>
  );
}