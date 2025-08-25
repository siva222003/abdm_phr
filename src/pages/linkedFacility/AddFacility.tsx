import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Page from "@/components/common/Page";
import AddFacilityCard from "@/components/linkedFacility/AddFacilityCard";

import { CardGridSkeleton } from "@/common/loaders/SkeletonLoader";

import routes from "@/api";
import { query } from "@/utils/request/request";

function AddFacilityHeader({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Add Facility</h1>
        <p className="text-gray-600 text-sm">
          Search and link a facility to view and manage your health data.
        </p>
      </div>

      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search facility by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white focus-visible:ring-1"
        />
      </div>
    </div>
  );
}

export default function AddFacility() {
  const [search, setSearch] = useState("");

  const {
    data: govtPrograms,
    isLoading: isLoadingGovtPrograms,
    isError: isErrorGovtPrograms,
  } = useQuery({
    queryKey: ["govtPrograms"],
    queryFn: query(routes.gateway.listGovtPrograms),
  });

  const {
    data: providers,
    isLoading: isLoadingProviders,
    isError: isErrorProviders,
  } = useQuery({
    queryKey: ["providers", search],
    queryFn: query.debounced(routes.gateway.listProviders, {
      queryParams: {
        name: search,
      },
    }),
    enabled: !!search,
  });

  const data = search ? providers : govtPrograms;
  const isLoading = search ? isLoadingProviders : isLoadingGovtPrograms;
  const isError = search ? isErrorProviders : isErrorGovtPrograms;

  return (
    <Page title="Add Facility" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <AddFacilityHeader search={search} setSearch={setSearch} />

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CardGridSkeleton count={4} />
          </div>
        )}

        {(isError || !data || data.length === 0) && !isLoading && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center text-gray-500">
              No facilities found
            </CardContent>
          </Card>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((provider) => (
              <AddFacilityCard key={provider.identifier.id} data={provider} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
