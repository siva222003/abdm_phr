import { FolderOpen } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

import Page from "@/components/common/Page";
import LinkedFacilityCard from "@/components/linkedFacility/LinkedFacilityCard";

import { usePatientLinks } from "@/hooks/usePatientLinks";

import { CardGridSkeleton } from "@/common/loaders/SkeletonLoader";

function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">My Records</h1>
        <p className="text-gray-600 text-sm">
          View and manage your health records
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { patientLinks, isLoading, isError } = usePatientLinks();

  return (
    <Page title="My Records" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <DashboardHeader />

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CardGridSkeleton count={4} />
          </div>
        )}

        {(isError || !patientLinks || patientLinks.length === 0) &&
          !isLoading && (
            <EmptyState
              icon={FolderOpen}
              title="No linked facilities found"
              description="Link a new facility to get started"
            />
          )}

        {patientLinks && patientLinks.length > 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patientLinks.map((link) => (
              <LinkedFacilityCard key={link.hip.id} data={link} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
