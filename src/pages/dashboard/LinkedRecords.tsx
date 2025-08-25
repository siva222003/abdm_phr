import { FolderOpen } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

import LinkedRecordsCard from "@/components/dashboard/LinkedRecordsCard";

import { usePatientLinks } from "@/hooks/usePatientLinks";

import { CardGridSkeleton } from "@/common/loaders/SkeletonLoader";

export default function LinkedRecords() {
  const { patientLinks, isLoading, isError } = usePatientLinks();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CardGridSkeleton count={4} />
      </div>
    );
  }

  if (isError || !patientLinks || patientLinks.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No linked facilities found"
        description="Link a new facility to get started"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patientLinks.map((link) => (
        <LinkedRecordsCard key={link.hip.id} data={link} />
      ))}
    </div>
  );
}
