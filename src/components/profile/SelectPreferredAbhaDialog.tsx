import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbhaNumberOtpFlow from "@/components/auth/AbhaNumberOtpFlow";

import { useAuthContext } from "@/hooks/useAuth";

import { InitialAuthFormValues } from "@/common/constants";

type SelectPreferredAbhaDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  existingAbhaNumber: string;
};

const SelectPreferredAbhaDialog = ({
  open,
  setOpen,
  existingAbhaNumber,
}: SelectPreferredAbhaDialogProps) => {
  const { logout } = useAuthContext();
  const [memory, setMemory] = useState(InitialAuthFormValues);

  const onVerifyOtpSuccess = () => {
    toast.success(
      "Preferred ABHA address selected successfully. Please login again.",
    );
    setOpen(false);
    logout();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Preferred ABHA Address</DialogTitle>
          <DialogDescription>
            Select a method to verify otp for selecting your preferred ABHA
            address.
          </DialogDescription>
          <div className="my-3">
            <AbhaNumberOtpFlow
              flowType="profile-update"
              setMemory={setMemory}
              transactionId={memory.transactionId}
              onVerifyOtpSuccess={onVerifyOtpSuccess}
              existingAbhaNumber={existingAbhaNumber}
              action="SELECT_PREFERRED_ABHA"
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPreferredAbhaDialog;
