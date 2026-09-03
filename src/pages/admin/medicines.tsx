import { useEffect, useState } from "react";
import { Pill, RefreshCw } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getMedicineStock, restockMedicine } from "@/api/admin/medicines";
import type { Medicine } from "@/dto/medicine/Medicine";

const stockClass: Record<Medicine["availability"], string> = {
  IN_STOCK: "bg-green-100 text-green-700",
  LOW_STOCK: "bg-amber-100 text-amber-800",
  OUT_OF_STOCK: "bg-red-100 text-red-700",
};

export function AdminMedicinesPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setItems(await getMedicineStock());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingBlob />;

  const handleRestock = async (id: string) => {
    await restockMedicine(id);
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Medicine Stock"
        subtitle="Monitor availability and trigger restocking"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Pill className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-muted">{m.category}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stockClass[m.availability]}`}>
                {m.availability.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted">Stock</span>
              <span className={`font-bold ${m.availability === "OUT_OF_STOCK" ? "text-red-600" : m.availability === "LOW_STOCK" ? "text-amber-700" : "text-green-700"}`}>
                {m.stockQty} {m.unit}s
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">Reorder at {m.reorderLevel} {m.unit}s</p>
            {(m.availability === "LOW_STOCK" || m.availability === "OUT_OF_STOCK") && (
              <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => handleRestock(m.id)}>
                <RefreshCw className="h-3 w-3" /> Restock
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}