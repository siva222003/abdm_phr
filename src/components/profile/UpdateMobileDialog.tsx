import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import MobileNumberOtpFlow from "@/components/auth/MobileNumberOtpFlow";

import { InitialAuthFormValues } from "@/common/constants";

type UpdateMobileDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdateMobileDialog = ({ open, setOpen }: UpdateMobileDialogProps) => {
  const [memory, setMemory] = useState(InitialAuthFormValues);
  const queryClient = useQueryClient();

  const handleOtpSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    setOpen(false);
  }, [queryClient, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Mobile</DialogTitle>
          <DialogDescription>
            Enter your new mobile number to update your profile.
          </DialogDescription>
        </DialogHeader>

        <MobileNumberOtpFlow
          flowType="profile-update"
          setMemory={setMemory}
          transactionId={memory.transactionId}
          onVerifyOtpSuccess={handleOtpSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMobileDialog;
