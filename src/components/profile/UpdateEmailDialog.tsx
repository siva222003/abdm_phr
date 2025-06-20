import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmailOtpFlow from "@/components/auth/EmailOtpFlow";

import { InitialAuthFormValues } from "@/common/constants";

type UpdateEmailDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdateEmailDialog = ({ open, setOpen }: UpdateEmailDialogProps) => {
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
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Enter your new email address to update your profile.
          </DialogDescription>
        </DialogHeader>

        <EmailOtpFlow
          flowType="profile-update"
          setMemory={setMemory}
          transactionId={memory.transactionId}
          onVerifyOtpSuccess={handleOtpSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmailDialog;
