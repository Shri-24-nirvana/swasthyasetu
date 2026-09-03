import { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";
import { PageHeader, LoadingBlob } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { LongitudinalRecord } from "@/components/shared/LongitudinalRecord";
import { getHealthRecord } from "@/api/patient/records";
import type { HealthRecord } from "@/dto/HealthRecord";

export function HealthRecordsPage() {
  const [record, setRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    getHealthRecord().then(setRecord);
  }, []);

  if (!record) return <LoadingBlob />;

  const handlePrint = () => window.print();

  return (
    <div>
      <PageHeader
        title="My Health Records"
        subtitle="Your complete medical history across all facilities"
        actions={
          <>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4" /> Download
            </Button>
          </>
        }
      />
      <LongitudinalRecord record={record} />
    </div>
  );
}