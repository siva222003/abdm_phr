import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbhaNumberOtpFlow from "@/src/components/auth/AbhaNumberOtpFlow";
import { FormMemory } from "@/types/auth";

interface ConfirmDialogProps {
  name: string;
  handleCancel: () => void;
  handleOk: () => void;
  show: boolean;
}

const AbhaUnlinkDialog = (props: ConfirmDialogProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [_, setMemory] = useState<FormMemory>({
    existingAbhaAddresses: [],
    transactionId: "",
    mode: "abha-number",
  });

  return (
    <Dialog open={props.show} onOpenChange={props.handleCancel}>
      <DialogContent>
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
              <Button variant="outline" onClick={props.handleCancel}>
                Cancel
              </Button>
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
          <>
            <DialogHeader>
              <DialogTitle>Unlink using ABHA number</DialogTitle>
              <DialogDescription>
                Select an Otp method to unlink your ABHA number.
              </DialogDescription>
            </DialogHeader>
            <AbhaNumberOtpFlow
              flowType="login"
              transactionId=""
              setMemory={setMemory}
              goTo={() => {}}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AbhaUnlinkDialog;
