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
  });
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
            goTo={() => {}}
            setMemory={setMemory}
            transactionId={memory.transactionId}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMobileDialog;
