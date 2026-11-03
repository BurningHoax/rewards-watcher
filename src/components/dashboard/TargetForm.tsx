import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function TargetForm({ onAdd }: { onAdd: (target: { name: string; url: string; selector: string }) => void }) {
  const [form, setForm] = useState({ name: "", url: "", selector: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: "", url: "", selector: "" });
  };

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-base tracking-tight normal-case">Add a reward tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Add the page and selector you want to monitor.</p>
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1fr_auto]">
          <Input required placeholder="Item name" aria-label="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-lg border border-input bg-background px-3" />
          <Input required type="url" placeholder="Page URL" aria-label="Page URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="h-11 rounded-lg border border-input bg-background px-3" />
          <Input required placeholder="CSS selector" aria-label="CSS selector" value={form.selector} onChange={(e) => setForm({ ...form, selector: e.target.value })} className="h-11 rounded-lg border border-input bg-background px-3" />
          <Button type="submit" className="h-11 sm:col-span-2 lg:col-span-1">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}