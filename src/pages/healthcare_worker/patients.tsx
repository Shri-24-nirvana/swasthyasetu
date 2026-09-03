import { useEffect, useState } from "react";
import { UserPlus, Eye } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LongitudinalRecord } from "@/components/shared/LongitudinalRecord";
import { searchPatients, registerPatient } from "@/api/healthcare_worker/patients";
import { getLongitudinalRecord } from "@/api/healthcare_worker/records";
import type { Patient } from "@/dto/patient/Patient";
import type { HealthRecordResponse } from "@/dto/health-record/HealthRecordResponse";

export function WorkerPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [viewing, setViewing] = useState<Patient | null>(null);
  const [record, setRecord] = useState<HealthRecordResponse | null>(null);
  const [loadRecord, setLoadRecord] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const homeFacilityId = "phc-1";

  useEffect(() => {
    (async () => {
      setPatients(await searchPatients());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      setPatients(await searchPatients(query));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleView = async (p: Patient) => {
    setViewing(p);
    setLoadRecord(true);
    setRecord(await getLongitudinalRecord());
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = await registerPatient({
      name,
      age: Number(age),
      gender,
      village,
      district,
      bloodGroup,
      allergies: allergies ? allergies.split(",").map((a) => a.trim()) : [],
      homeFacilityId,
    });
    setPatients((prev) => [newPatient, ...prev]);
    setRegisterOpen(false);
    setName("");
    setVillage("");
  };

  if (loading) return <LoadingBlob />;

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Register and search patients"
        actions={
          <Button onClick={() => setRegisterOpen(true)}>
            <UserPlus className="h-4 w-4" /> Register Patient
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by name, Swasthya ID, or village…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-brand-50 text-left text-muted">
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Swasthya ID</th>
              <th className="px-4 py-3 font-medium">Village</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.swasthyaId} className="border-b border-border last:border-0 hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{p.age} yrs · {p.gender}</p>
                </td>
                <td className="px-4 py-3 text-muted">{p.swasthyaId}</td>
                <td className="px-4 py-3 text-muted">{p.village}</td>
                <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                <td className="px-4 py-3">
                  <Button variant="secondary" size="sm" onClick={() => handleView(p)}>
                    <Eye className="h-3 w-3" /> View Record
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && (
          <div className="py-12 text-center text-muted">No patients found.</div>
        )}
      </Card>

      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)} title="Register New Patient" className="max-w-lg">
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Age</label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Gender</label>
              <Select value={gender} onChange={(e) => setGender(e.target.value as typeof gender)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Blood Group</label>
              <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Village</label>
              <Input value={village} onChange={(e) => setVillage(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">District</label>
              <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Allergies <span className="text-muted">(comma separated, optional)</span>
            </label>
            <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin" />
          </div>
          <Button type="submit" className="w-full">Register & Generate Swasthya ID</Button>
        </form>
      </Modal>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={`Health Record — ${viewing?.name ?? ""}`}
        className="max-w-3xl h-[80vh] overflow-y-auto"
      >
        {loadRecord && record ? (
          <LongitudinalRecord record={record} />
        ) : (
          <LoadingBlob label="Loading record…" />
        )}
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}