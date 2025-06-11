import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbhaNumberOtpFlow from "@/components/auth/AbhaNumberOtpFlow";

import { FormMemory } from "@/types/auth";

type SelectPreferredAbhaDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SelectPreferredAbhaDialog = ({
  open,
  setOpen,
}: SelectPreferredAbhaDialogProps) => {
  const [memory, setMemory] = useState<FormMemory>({
    mode: "mobile-number",
    transactionId: "",
  });
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
              flowType="enrollment"
              goTo={() => {}}
              setMemory={setMemory}
              transactionId={memory.transactionId}
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPreferredAbhaDialog;
