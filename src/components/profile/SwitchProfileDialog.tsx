import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, UserSearch } from "lucide-react";
import { useNavigate } from "raviger";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuthContext } from "@/hooks/useAuth";

import routes from "@/api";
import { mutate, query } from "@/utils/request/request";

type SwitchProfileProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentAbhaAddress: string;
};

const SwitchProfile = ({
  open,
  setOpen,
  currentAbhaAddress,
}: SwitchProfileProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { handleAuthSuccess } = useAuthContext();

  const { data, isLoading } = useQuery({
    queryKey: ["phrProfiles"],
    queryFn: query(routes.profile.phrProfiles),
  });

  const switchProfileMutationFn = mutate(routes.profile.switchProfileVerify);
  const swithProfileVerifyMutation = useMutation({
    mutationFn: switchProfileMutationFn,
    onSuccess: (data) => {
      toast.success("Profile switched successfully!");
      setOpen(false);

      handleAuthSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });

      navigate("/");
    },
  });

  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    currentAbhaAddress,
  );

  const handleSwitchProfile = () => {
    if (!selectedAddress) return;

    swithProfileVerifyMutation.mutate({
      abha_address: selectedAddress,
      transaction_id: data?.transaction_id || "",
    });
  };

  const isSubmitting = swithProfileVerifyMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setSelectedAddress(currentAbhaAddress);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Profile</DialogTitle>
          <DialogDescription>
            Select the profile you want to switch to.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full rounded-md p-2">
          <div className="max-h-48 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full rounded-lg" />
              ))
            ) : data?.users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <UserSearch className="w-10 h-10 mb-2 text-gray-400" />
                <p className="text-md font-medium">No profiles found</p>
                <p className="text-xs text-center max-w-xs">
                  Looks like you don’t have any linked profiles yet. Try linking
                  a new one.
                </p>
              </div>
            ) : (
              data?.users.map(({ abhaAddress }) => {
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
              })
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-2">
          <Button
            className="w-full"
            disabled={
              !selectedAddress ||
              selectedAddress === currentAbhaAddress ||
              isSubmitting
            }
            onClick={handleSwitchProfile}
          >
            {isSubmitting ? (
              <Loader2Icon className="text-white animate-spin scale-150" />
            ) : (
              "Switch Profile"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchProfile;
