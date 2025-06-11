import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbhaNumberOtpFlow from "@/components/auth/AbhaNumberOtpFlow";

import { FormMemory } from "@/types/auth";

type AbhaUnlinkDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AbhaUnlinkDialog = ({ open, setOpen }: AbhaUnlinkDialogProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  console.log({ isConfirmed });

  const [memory, setMemory] = useState<FormMemory>({
    mode: "mobile-number",
    transactionId: "",
  });
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setIsConfirmed(false);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        {!isConfirmed ? (
          <>
            <DialogHeader>
              <DialogTitle>Unlink ABHA Number</DialogTitle>
              <DialogDescription className="space-y-2 pb-4">
                <div>
                  Even after unlinking the ABHA number, you will still be able
                  to share health records with healthcare facilities through
                  ABHA address.
                </div>
                <div>
                  Do you still want to unlink the ABHA number 91-3167-7861-0170
                  from the ABHA address 91316778610170@sbx?
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log("Unlinking Abha profile");
                  setIsConfirmed(true);
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <DialogHeader>
            <DialogTitle>Unlink ABHA</DialogTitle>
            <DialogDescription>
              Select a method to verify otp for unlinking your ABHA number.
            </DialogDescription>
            <AbhaNumberOtpFlow
              flowType="enrollment"
              goTo={() => {}}
              setMemory={setMemory}
              transactionId={memory.transactionId}
            />
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AbhaUnlinkDialog;
