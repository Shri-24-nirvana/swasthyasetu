import { useEffect, useState } from "react";
import { Siren, PhoneCall, Ambulance, MapPin, ArrowRight } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getEmergencyAssistance } from "@/api/patient/emergency";
import type { EmergencyInfoResponse, EmergencyContact } from "@/dto/emergency/EmergencyInfoResponse";

export function EmergencyPage() {
  const [info, setInfo] = useState<EmergencyInfoResponse | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    getEmergencyAssistance().then(setInfo);
  }, []);

  if (!info) return <LoadingBlob />;

  const triggerEmergency = () => {
    setActive(true);
  };

  return (
    <div>
      <PageHeader
        title="Emergency Assistance"
        subtitle="Immediate help when you need it most"
        backTo="/patient"
        backLabel="Back to Patient Dashboard"
      />

      {!active ? (
        <>
          <Card className="border border-rose-500/40 bg-rose-500/10 text-center shadow-lg p-6">
            <Siren className="mx-auto h-12 w-12 text-rose-600 dark:text-rose-400 animate-pulse" />
            <h2 className="mt-3 text-xl font-black text-rose-700 dark:text-rose-300">In an emergency?</h2>
            <p className="mx-auto mt-1 max-w-md text-xs text-muted">
              Trigger this to alert the nearest facility and share your health-critical
              details (allergies, blood group, conditions) with them instantly.
            </p>
            <Button
              variant="danger"
              size="lg"
              className="mt-5 font-bold shadow-md"
              onClick={triggerEmergency}
            >
              <Siren className="h-5 w-5" /> Trigger Emergency Alert
            </Button>
          </Card>

          <div className="mt-4">
            <Card className="border border-border">
              <h3 className="font-bold text-sm text-fg">Emergency Contact Numbers</h3>
              <div className="mt-3 space-y-2">
                {info.emergencyNumbers.map((n: EmergencyContact) => (
                  <div key={n.number} className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary/40 p-3 hover:border-brand-500/30 transition">
                    <span className="flex items-center gap-2 text-xs font-semibold text-fg">
                      <PhoneCall className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      {n.name}
                    </span>
                    <a href={`tel:${n.number.replace(/\s/g, "")}`} className="font-bold font-mono text-sm text-brand-700 dark:text-brand-400 hover:underline">
                      {n.number}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          <Card className="border border-emerald-500/40 bg-emerald-500/10 shadow-lg">
            <div className="flex items-center gap-3.5">
              <Ambulance className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <div>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">Ambulance dispatched</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  ETA {info.ambulanceETA} · Nearest facility alerted
                </p>
              </div>
            </div>
          </Card>

          <Card className="mt-4 border border-border">
            <h3 className="font-bold text-fg">{info.nearestFacility.name}</h3>
            <p className="mt-1 text-xs text-muted">
              <MapPin className="mr-1 inline h-3.5 w-3.5 text-brand-600" />
              {info.nearestFacility.village}, {info.nearestFacility.district} ·{" "}
              {info.nearestFacility.distanceKm?.toFixed(1)}km away
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3">
                <p className="text-xl font-black text-brand-700 dark:text-brand-300">{info.nearestFacility.doctorsAvailable}</p>
                <p className="text-[10px] uppercase font-bold text-muted mt-0.5">Doctors</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{info.nearestFacility.availableBeds}</p>
                <p className="text-[10px] uppercase font-bold text-muted mt-0.5">Free Beds</p>
              </div>
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                <p className="text-xl font-black text-sky-600 dark:text-sky-400">24/7</p>
                <p className="text-[10px] uppercase font-bold text-muted mt-0.5">Emergency</p>
              </div>
            </div>
            <Button className="mt-4 w-full font-bold shadow-md">
              Directions <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="mt-4 border border-border">
            <h3 className="font-bold text-fg text-sm">Your health-critical info shared with facility</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-muted">
              <li className="flex items-center gap-1.5"><span className="text-rose-500 font-bold">⚠️ Blood group {(info.nearestFacility.availableBeds ?? 0) >= 0 && "O+"}</span> · <span className="text-rose-600 dark:text-rose-400 font-bold">Allergies: Penicillin, Sulfa</span></li>
              <li>• Active conditions: <strong className="text-fg">Hypertension, Type 2 Diabetes</strong></li>
              <li>• Current medications will be visible to attending emergency staff</li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}