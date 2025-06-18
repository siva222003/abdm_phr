import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import MobileNumberOtpFlow from "@/components/auth/MobileNumberOtpFlow";

import { FormMemory } from "@/types/auth";

type UpdateMobileDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdateMobileDialog = ({ open, setOpen }: UpdateMobileDialogProps) => {
  const [memory, setMemory] = useState<FormMemory>({
    mode: "mobile-number",
    transactionId: "",
    verifySystem: "abdm",
  });

  const onVerifyOtpSuccess = (data: any) => {
    // Handle success logic here, e.g., show a success message or update state
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Mobile</DialogTitle>
          <DialogDescription>
            Enter your new mobile number to update your profile.
          </DialogDescription>
          <MobileNumberOtpFlow
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

export default UpdateMobileDialog;
