import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { getAnalytics } from "@/api/admin/analytics";

const COLORS = ["#0f766e", "#14b8a6", "#eab308", "#ef4444", "#8b5cf6"];

export function AnalyticsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAnalytics>> | null>(null);

  useEffect(() => {
    getAnalytics().then(setData);
  }, []);

  if (!data) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="Healthcare Performance Analytics"
        subtitle="Population health insights across the network"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>QR Scan Trend</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.qrScansTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Referral Completion Rate</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.referralCompletionByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>High-Risk Condition Distribution</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.highRiskDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="condition" tick={{ fontSize: 10 }} stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Bar dataKey="count" name="Patients" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Common Conditions</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.commonConditions} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted)" />
                <YAxis type="category" dataKey="condition" tick={{ fontSize: 10 }} stroke="var(--muted)" width={90} />
                <Tooltip />
                <Bar dataKey="count" name="Cases" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Diagnostics Status</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.diagnosticsStatus} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                  {data.diagnosticsStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Bed Occupancy by Facility</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bedsByFacility} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="facility" tick={{ fontSize: 9 }} stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="filled" name="Filled" stackId="b" fill="#0f766e" />
                <Bar dataKey="total" name="Total" stackId="b" fill="#ccfbf1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}