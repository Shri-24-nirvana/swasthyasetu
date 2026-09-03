import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { getFacilityWorkload } from "@/api/admin/workload";
import type { FacilityWorkload } from "@/api/admin/workload";

export function WorkloadPage() {
  const [data, setData] = useState<FacilityWorkload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacilityWorkload().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="Facility Workload"
        subtitle="Compare workload across facilities"
      />

      <Card>
        <h3 className="mb-4 font-semibold">Patients seen today by facility</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="facilityName" tick={{ fontSize: 10 }} stroke="var(--muted)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted)" />
              <Tooltip />
              <Bar dataKey="patientsToday" name="Patients today" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {data.map((f) => (
          <Card key={f.facilityId}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">{f.facilityName}</p>
              <span className="text-xs text-muted">{f.type}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-brand-50 p-2">
                <p className="text-lg font-bold text-brand-700">{f.patientsToday}</p>
                <p className="text-xs text-muted">Patients</p>
              </div>
              <div className="rounded-lg bg-sky-50 p-2">
                <p className="text-lg font-bold text-sky-700">{f.consultsDone}</p>
                <p className="text-xs text-muted">Consults</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2">
                <p className="text-lg font-bold text-amber-700">{f.avgWaitMin}m</p>
                <p className="text-xs text-muted">Avg wait</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}