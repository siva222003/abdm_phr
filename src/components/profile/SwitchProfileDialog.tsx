import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type SwitchProfileProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentAbhaAddress: string;
  onSwitchProfileSuccess: (profile: string) => void;
};

const SwitchProfile = ({
  open,
  setOpen,
  currentAbhaAddress,
  // onSwitchProfileSuccess,
}: SwitchProfileProps) => {
  const [selectedAddress, setSelectedAddress] =
    useState<string>(currentAbhaAddress);

  const { data: phrProfiles, isLoading } = useQuery({
    queryKey: ["phrProfiles"],
    queryFn: async () => {
      return new Promise<string[]>((resolve) => {
        setTimeout(() => {
          resolve([
            "dora1sbx@sbx",
            "91316778610170@sbx",
            "91316778610171@sbx",
            "91316778610173@sbx",
            "91316778610174@sbx",
            "91316778610175@sbx",
            "91316778610176@sbx",
            "91316778610177@sbx",
            "91316778610178@sbx",
            "91316778610179@sbx",
          ]);
        }, 4000);
      });
    },
    refetchOnMount: false,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Profile</DialogTitle>
          <DialogDescription>
            Select the profile you want to switch to.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full rounded-md p-2">
          <div className="max-h-48 space-y-4">
            {phrProfiles?.map((abhaAddress) => {
              const isSelected = abhaAddress === selectedAddress;
              return (
                <div
                  key={abhaAddress}
                  className={cn(
                    "relative cursor-pointer rounded-lg border p-3 text-sm shadow-sm transition-colors flex items-center",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "hover:bg-primary/5",
                  )}
                  onClick={() => setSelectedAddress(abhaAddress)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedAddress(abhaAddress);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border border-gray-400 transition-colors",
                        isSelected ? "border-primary bg-primary" : "bg-white",
                      )}
                    />
                    <div>{abhaAddress}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-2">
          <Button
            className="w-full"
            disabled={!selectedAddress}
            onClick={() => {
              setOpen(false);
            }}
          >
            Switch Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchProfile;
