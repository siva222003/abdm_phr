import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon, LinkIcon, SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import routes from "@/api";
import { HealthLocker, PatientLockerBasic } from "@/types/healthLocker";
import { query } from "@/utils/request/request";

interface AddHealthLockerSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  existingLockers: PatientLockerBasic[];
}

export default function AddHealthLockerSheet({
  open,
  setOpen,
  existingLockers,
}: AddHealthLockerSheetProps) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["healthLockers", search.toLowerCase()],
    queryFn: query.debounced(routes.healthLocker.listHealthLockers, {
      queryParams: { name: search.toLowerCase() },
    }),
    enabled: !!search,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) setSearch("");
  };

  const getLink = (locker: HealthLocker) =>
    locker.endpoints?.healthLockerEndpoints?.find(
      (e) => e.use === "registration",
    )?.address || window.location.origin;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-md overflow-y-auto p-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg font-semibold">
            Add Health Locker
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Search and register with a health locker system to manage your
            health data.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="size-5 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search health lockers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 rounded-lg shadow-sm focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {!search && (
                <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground space-y-2">
                  <SearchIcon className="size-6 text-muted-foreground opacity-40" />
                  <span>Start typing to search for health lockers</span>
                </div>
              )}

              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}

              {search && !isLoading && (!data || data.length === 0) && (
                <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground space-y-2">
                  <SearchIcon className="size-6 text-muted-foreground opacity-40" />
                  <span>No health lockers found for "{search}"</span>
                </div>
              )}
              {data?.map((locker) => {
                const isLinked = existingLockers.some(
                  (l) => l.lockerId === locker.identifier.id,
                );
                return (
                  <Card
                    key={locker.identifier.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer gap-2 sm:gap-0"
                    onClick={() =>
                      window.open(
                        getLink(locker),
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <h3 className="text-sm font-medium line-clamp-1">
                        {locker.identifier.name || "Unnamed Health Locker"}
                      </h3>
                      <ExternalLinkIcon className="size-3 text-gray-400" />
                    </div>

                    {isLinked && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 text-xs mt-2 sm:mt-0"
                      >
                        <LinkIcon className="size-3" />
                        Linked
                      </Badge>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
