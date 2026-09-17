import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  Pill,
  Receipt,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useHospitalDB } from "@/lib/database/db";

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const visits = useHospitalDB((s) => s.visits);
  const medicines = useHospitalDB((s) => s.medicines);
  const prescriptions = useHospitalDB((s) => s.prescriptions);
  const testOrders = useHospitalDB((s) => s.testOrders);
  const transactions = useHospitalDB((s) => s.transactions);
  const bills = useHospitalDB((s) => s.bills);
  const auditLogs = useHospitalDB((s) => s.auditLogs);
  const facilities = useHospitalDB((s) => s.facilities);

  const facility = useMemo(() => {
    return facilities.find((f) => f.id === user?.facilityId) || facilities[0];
  }, [facilities, user]);

  // Aggregate Metrics for Healthcare Transparency
  const totalPrescriptions = prescriptions.length;
  const totalMedicinesDispensed = transactions.reduce(
    (acc, t) => acc + t.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const totalBillsGenerated = bills.length;

  const lowStockMeds = medicines.filter((m) => m.availability === "LOW_STOCK" || m.availability === "OUT_OF_STOCK");

  // Patient Journey Funnel Flow
  const journeyStats = {
    booked: visits.length,
    checkedIn: visits.filter((v) => v.status !== "BOOKED").length,
    consulted: visits.filter((v) => ["TESTS_PENDING", "TESTS_COMPLETED", "PHARMACY_PENDING", "MEDICINES_DISPENSED", "COMPLETED"].includes(v.status)).length,
    testsOrdered: testOrders.length,
    testsCompleted: testOrders.filter((t) => t.status === "COMPLETED").length,
    prescriptionsIssued: prescriptions.length,
    medicinesDispensed: prescriptions.filter((p) => p.status === "DISPENSED").length,
    completedVisits: visits.filter((v) => v.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Clean & Highlighted Card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-rose-500/30 bg-surface p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
            Hospital Administration &amp; Operational Governance
          </span>
          <h1 className="mt-2 text-2xl font-black text-fg">{facility.name}</h1>
          <p className="text-xs text-muted mt-0.5">
            Operational Transparency · Real-Time Medicine Accountability · Journey Analytics · Audit Compliance
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/audit-logs">
            <Button className="font-bold cursor-pointer shadow-md">
              <ShieldCheck className="h-4 w-4" /> Immutable Audit Logs ({auditLogs.length})
            </Button>
          </Link>
          <Link to="/admin/medicines">
            <Button variant="outline" className="cursor-pointer">
              <Package className="h-4 w-4 text-brand-700 dark:text-brand-400" /> Medicine Inventory
            </Button>
          </Link>
        </div>
      </div>

      {/* HEALTHCARE TRANSPARENCY METRICS */}
      <div>
        <h2 className="mb-3 text-base font-bold text-fg flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand-700 dark:text-brand-400" />
          Healthcare &amp; Medicine Transparency (Today's Real-Time Metrics)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4 border border-brand-500/25 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30 group-hover:scale-105 transition">
              <FileCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black text-fg">{totalPrescriptions}</p>
              <p className="text-xs text-muted font-medium">Prescriptions Generated</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border border-pink-500/25 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-700 dark:text-pink-400 border border-pink-500/30 group-hover:scale-105 transition">
              <Pill className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black text-fg">{totalMedicinesDispensed} units</p>
              <p className="text-xs text-muted font-medium">Medicines Dispensed</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
              <Receipt className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black text-fg">{totalBillsGenerated}</p>
              <p className="text-xs text-muted font-medium">Bills Generated</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border border-indigo-500/25 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black text-fg">{journeyStats.completedVisits}</p>
              <p className="text-xs text-muted font-medium">Patients Fully Served</p>
            </div>
          </Card>
        </div>
      </div>

      {/* PATIENT JOURNEY TRACKING FUNNEL */}
      <Card className="space-y-4 border border-border">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <CardTitle>Hospital Patient Journey Flow</CardTitle>
            <CardDescription className="text-xs">
              Live end-to-end operational pipeline from Appointment Booking to Consultation, Tests, Pharmacy &amp; Completion
            </CardDescription>
          </div>
          <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-700 dark:text-brand-300 border border-brand-500/30">
            {visits.length} Total Journeys
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8 text-center text-xs">
          <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 dark:bg-brand-500/15 p-3">
            <span className="text-brand-700 dark:text-brand-300 block text-[10px] uppercase font-bold">1. Booked</span>
            <span className="text-xl font-black text-brand-700 dark:text-brand-300 mt-1 block">{journeyStats.booked}</span>
          </div>
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/15 p-3">
            <span className="text-blue-700 dark:text-blue-300 block text-[10px] uppercase font-bold">2. Checked In</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 block">{journeyStats.checkedIn}</span>
          </div>
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-500/15 p-3">
            <span className="text-indigo-700 dark:text-indigo-300 block text-[10px] uppercase font-bold">3. Consulted</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{journeyStats.consulted}</span>
          </div>
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 dark:bg-purple-500/15 p-3">
            <span className="text-purple-700 dark:text-purple-300 block text-[10px] uppercase font-bold">4. Tests Ordered</span>
            <span className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 block">{journeyStats.testsOrdered}</span>
          </div>
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/15 p-3">
            <span className="text-sky-700 dark:text-sky-300 block text-[10px] uppercase font-bold">5. Tests Done</span>
            <span className="text-xl font-black text-sky-600 dark:text-sky-400 mt-1 block">{journeyStats.testsCompleted}</span>
          </div>
          <div className="rounded-2xl border border-pink-500/30 bg-pink-500/10 dark:bg-pink-500/15 p-3">
            <span className="text-pink-700 dark:text-pink-300 block text-[10px] uppercase font-bold">6. Rx Issued</span>
            <span className="text-xl font-black text-pink-600 dark:text-pink-400 mt-1 block">{journeyStats.prescriptionsIssued}</span>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-3">
            <span className="text-amber-700 dark:text-amber-300 block text-[10px] uppercase font-bold">7. Dispensed</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{journeyStats.medicinesDispensed}</span>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 p-3">
            <span className="text-emerald-700 dark:text-emerald-300 block text-[10px] uppercase font-bold">8. Completed</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{journeyStats.completedVisits}</span>
          </div>
        </div>
      </Card>

      {/* Two Columns: Recent Medicine Transactions & Low Stock Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Medicine Dispensing Ledger */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <CardTitle className="text-sm">Recent Medicine Dispensing Transactions</CardTitle>
            <Link to="/admin/medicines" className="text-xs text-brand-700 font-semibold hover:underline">
              Full Ledger →
            </Link>
          </div>

          <div className="space-y-2">
            {transactions.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">No medicine transactions recorded.</p>
            ) : (
              transactions.slice(0, 4).map((txn) => (
                <div key={txn.id} className="rounded-xl border border-border p-3 text-xs space-y-1 bg-surface">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-800">{txn.transactionId}</span>
                    <span className="font-semibold text-fg">₹{txn.totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-muted">
                    Patient: <strong>{txn.patientName}</strong> ({txn.patientId}) · Pharmacist: <strong>{txn.pharmacistName}</strong>
                  </p>
                  <div className="text-[11px] text-muted pt-0.5">
                    Items: {txn.items.map((i) => `${i.medicineName} (${i.quantity}) [Batch ${i.batchNo}]`).join(", ")}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock & Inventory Alerts */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Stock &amp; Expiry Alerts
            </CardTitle>
            <Link to="/admin/medicines" className="text-xs text-brand-700 font-semibold hover:underline">
              Restock →
            </Link>
          </div>

          <div className="space-y-2">
            {lowStockMeds.map((med) => (
              <div key={med.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-xs">
                <div>
                  <p className="font-bold text-fg">{med.name}</p>
                  <p className="text-muted">
                    Stock: <strong className="text-red-700">{med.stockQty} {med.unit}s</strong> (Reorder at {med.reorderLevel})
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold border border-amber-300">
                  {med.availability.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}