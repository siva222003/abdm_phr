import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

import Page from "@/components/common/Page";
import AddHealthLockerSheet from "@/components/healthLocker/AddHealthLockerSheet";
import HealthLockerCard from "@/components/healthLocker/HealthLockerCard";

import { CardGridSkeleton } from "@/common/loaders/SkeletonLoader";

import routes from "@/api";
import { query } from "@/utils/request/request";

const tempLockers = [
  {
    id: 1,
    lockerId: "1",
    lockerName: "Sandbox Test Hospital",
    patientId: "1",
    dateCreated: "2025-08-17T00:00:00.000Z",
    dateModified: "2025-08-17T00:00:00.000Z",
    isActive: true,
  },
  {
    id: 2,
    lockerId: "2",
    lockerName: "DriefCase",
    patientId: "2",
    dateCreated: "2025-08-17T00:00:00.000Z",
    dateModified: "2025-08-17T00:00:00.000Z",
    isActive: true,
  },
];

function HealthLockerHeader({
  onAddClick,
  count,
}: {
  onAddClick: () => void;
  count: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <div className="flex gap-x-3 items-center flex-wrap">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            Health Lockers
          </h1>
          {count > 0 && (
            <Badge variant="purple" className="h-5 mb-2">
              {count} Lockers
            </Badge>
          )}
        </div>
        <p className="text-gray-600 text-sm">
          View and manage your health lockers
        </p>
      </div>
      <Button variant="outline" className="gap-3" onClick={onAddClick}>
        <Plus />
        Add Health Locker
      </Button>
    </div>
  );
}

export default function HealthLocker() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["patientLockers"],
    queryFn: query(routes.healthLocker.listPatientLockers),
  });

  const [open, setOpen] = useState(false);

  return (
    <Page title="Health Lockers" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <HealthLockerHeader
          onAddClick={() => setOpen(true)}
          count={tempLockers?.length ?? 0}
        />

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CardGridSkeleton count={4} />
          </div>
        )}

        {(isError || !tempLockers || tempLockers.length === 0) &&
          !isLoading && (
            <EmptyState
              icon={FolderOpen}
              title="No health lockers found"
              description="Register a new health locker to get started"
            />
          )}

        {tempLockers && tempLockers.length > 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tempLockers.map((locker) => (
              <HealthLockerCard key={locker.lockerId} data={locker} />
            ))}
          </div>
        )}

        <AddHealthLockerSheet
          open={open}
          setOpen={setOpen}
          existingLockers={data || []}
        />
      </div>
    </Page>
  );
}
