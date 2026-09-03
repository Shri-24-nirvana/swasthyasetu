import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getAppointments, bookAppointment } from "@/api/patient/appointments";
import { facilities } from "@/lib/mock/facilities";
import type { Appointment } from "@/dto/appointment/Appointment";
import { AppointmentStatus } from "@/dto/constants/AppointmentStatus";

const PATIENT_ID = "SWA-9284-1829";

const statusTone: Record<AppointmentStatus, "INFO" | "GREEN" | "YELLOW" | "RED"> = {
  [AppointmentStatus.BOOKED]: "INFO",
  [AppointmentStatus.CHECKED_IN]: "YELLOW",
  [AppointmentStatus.COMPLETED]: "GREEN",
  [AppointmentStatus.CANCELLED]: "RED",
  [AppointmentStatus.MISSED]: "RED",
};

export function AppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [facilityId, setFacilityId] = useState(facilities[0].id);
  const [date, setDate] = useState("2026-09-05");
  const [time, setTime] = useState("10:00");

  const load = async () => {
    setItems(await getAppointments(PATIENT_ID));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleBook = async () => {
    const facility = facilities.find((f) => f.id === facilityId)!;
    const dept = facility.specialties[0] ?? "General Medicine";
    await bookAppointment({
      patientId: PATIENT_ID,
      facilityId,
      doctorName: "Doctor on duty",
      date,
      time,
      department: dept,
      reason: "Routine consultation",
    });
    setOpen(false);
    setLoading(true);
    await load();
  };

  if (loading) return <LoadingBlob />;

  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Book and manage your appointments"
        actions={
          <Button onClick={() => setOpen(true)}>
            <CalendarPlus className="h-4 w-4" /> Book Appointment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{a.department}</h3>
              <Badge tone={statusTone[a.status]}>{a.status}</Badge>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <p><strong>{a.date}</strong> at {a.time}</p>
              <p className="text-muted">{a.doctorName}</p>
              <p className="text-muted">{facilities.find(f => f.id === a.facilityId)?.name ?? a.facilityId}</p>
              {a.reason && <p className="text-muted">{a.reason}</p>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Book an Appointment">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleBook();
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Facility</label>
            <Select value={facilityId} onChange={(e) => setFacilityId(e.target.value)}>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full">Confirm Booking</Button>
        </form>
      </Modal>
    </div>
  );
}