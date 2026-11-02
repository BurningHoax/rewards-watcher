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
    <Card>
      <CardHeader>
        <CardTitle>Add New Target</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
          <Input required placeholder="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 min-w-[200px]" />
          <Input required type="url" placeholder="Page URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="flex-1 min-w-[200px]" />
          <Input required placeholder="CSS Selector" value={form.selector} onChange={(e) => setForm({ ...form, selector: e.target.value })} className="flex-1 min-w-[200px]" />
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}