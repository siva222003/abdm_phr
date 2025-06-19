import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "raviger";
import { Dispatch, SetStateAction, useCallback } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbhaAddressSelector from "@/components/common/AbhaAddressSelector";

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

  const handleSwitchProfile = useCallback(
    (selectedAddress: string) => {
      if (!selectedAddress || !data?.transaction_id) return;

      swithProfileVerifyMutation.mutate({
        abha_address: selectedAddress,
        transaction_id: data?.transaction_id || "",
      });
    },
    [data?.transaction_id, swithProfileVerifyMutation],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Profile</DialogTitle>
          <DialogDescription>
            Select the profile you want to switch to.
          </DialogDescription>
        </DialogHeader>
        <AbhaAddressSelector
          addresses={data?.users || []}
          isListLoading={isLoading}
          isActionLoading={swithProfileVerifyMutation.isPending}
          defaultSelectedAddress={currentAbhaAddress}
          onContinue={handleSwitchProfile}
          continueLabel="Switch Profile"
        />
      </DialogContent>
    </Dialog>
  );
};

export default SwitchProfile;
