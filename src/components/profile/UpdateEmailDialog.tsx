import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmailOtpFlow from "@/components/auth/EmailOtpFlow";

import { FormMemory } from "@/types/auth";

type UpdateEmailDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdateEmailDialog = ({ open, setOpen }: UpdateEmailDialogProps) => {
  const [memory, setMemory] = useState<FormMemory>({
    mode: "mobile-number",
    transactionId: "",
    verifySystem: "abdm",
  });

  const onVerifyOtpSuccess = (data: any) => {
    console.log("OTP verified successfully", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Enter your new email address to update your profile.
          </DialogDescription>
          <EmailOtpFlow
            flowType="profile-update"
            setMemory={setMemory}
            transactionId={memory.transactionId}
            onVerifyOtpSuccess={onVerifyOtpSuccess}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmailDialog;
