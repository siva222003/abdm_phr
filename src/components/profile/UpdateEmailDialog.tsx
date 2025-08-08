import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmailOtpFlow from "@/components/auth/EmailOtpFlow";

import { AuthFlowTypes, INITIAL_AUTH_FORM_VALUES } from "@/types/auth";
import { ProfileUpdateActions } from "@/types/profile";

type UpdateEmailDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdateEmailDialog = ({ open, setOpen }: UpdateEmailDialogProps) => {
  const [memory, setMemory] = useState(INITIAL_AUTH_FORM_VALUES);
  const queryClient = useQueryClient();

  const handleOtpSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setMemory(INITIAL_AUTH_FORM_VALUES);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Enter your new email address to update your profile.
          </DialogDescription>
        </DialogHeader>

        <EmailOtpFlow
          flowType={AuthFlowTypes.PROFILE_UPDATE}
          setMemory={setMemory}
          transactionId={memory.transactionId}
          onVerifyOtpSuccess={handleOtpSuccess}
          action={ProfileUpdateActions.UPDATE_EMAIL}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmailDialog;
