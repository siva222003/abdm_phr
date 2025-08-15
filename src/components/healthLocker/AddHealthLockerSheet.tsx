import { useQuery } from "@tanstack/react-query";
import { LinkIcon, SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

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
          <SheetTitle className="text-lg">Add Health Locker</SheetTitle>
          <SheetDescription>
            Search and register with a health locker system to manage your
            health data.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search health lockers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {!search && (
                <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                  Start typing to search for health lockers
                </div>
              )}

              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}

              {search && !isLoading && (!data || data.length === 0) && (
                <div className="flex items-center justify-center text-center h-32 text-sm text-muted-foreground">
                  No health lockers found for "{search}"
                </div>
              )}

              {data?.map((locker) => {
                const isLinked = existingLockers.some(
                  (l) => l.lockerId === locker.identifier.id,
                );
                return (
                  <div
                    key={locker.identifier.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent cursor-pointer"
                    onClick={() => {
                      window.open(
                        getLink(locker),
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                  >
                    <h3 className="text-sm font-medium">
                      {locker.identifier.name || "Unnamed Health Locker"}
                    </h3>
                    {isLinked && (
                      <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                        <LinkIcon className="size-3" />
                        <span className="text-xs">Linked</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
