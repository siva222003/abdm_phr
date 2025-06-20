import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbhaNumberOtpFlow from "@/components/auth/AbhaNumberOtpFlow";

import { InitialAuthFormValues } from "@/common/constants";

type SelectPreferredAbhaDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SelectPreferredAbhaDialog = ({
  open,
  setOpen,
}: SelectPreferredAbhaDialogProps) => {
  const [memory, setMemory] = useState(InitialAuthFormValues);

  const onVerifyOtpSuccess = (data: any) => {
    console.log("OTP verified successfully", data);
    // Handle success logic here, e.g., show a success message or update state
    setOpen(false); // Close the dialog on successful verification
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
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPreferredAbhaDialog;
