import { Dispatch, SetStateAction, useCallback, useState } from "react";

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

import { useAuthContext } from "@/hooks/useAuth";

import { AuthFlowTypes, INITIAL_AUTH_FORM_VALUES } from "@/types/auth";
import { PROFILE_UPDATE_ACTIONS } from "@/types/profile";

type AbhaUnlinkDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  existingAbhaNumber: string;
  isKYCVerified: boolean;
};

const AbhaUnlinkDialog = ({
  open,
  setOpen,
  existingAbhaNumber,
  isKYCVerified,
}: AbhaUnlinkDialogProps) => {
  const { logout } = useAuthContext();
  const [isConfirmed, setIsConfirmed] = useState(!isKYCVerified);

  const [memory, setMemory] = useState(INITIAL_AUTH_FORM_VALUES);

  const onVerifyOtpSuccess = useCallback(() => {
    setOpen(false);
    logout(false);
  }, [logout, setOpen]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isKYCVerified) {
      setIsConfirmed(false);
    }
    if (!isOpen) {
      setMemory(INITIAL_AUTH_FORM_VALUES);
    }
  };

  const { LINK, DE_LINK } = PROFILE_UPDATE_ACTIONS;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <Button variant="outline" onClick={() => setOpen(false)}>
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
          <DialogHeader>
            <DialogTitle>
              {isKYCVerified ? "Unlink ABHA" : "Link ABHA"}
            </DialogTitle>
            <DialogDescription>
              {`Select a method to verify otp for ${
                isKYCVerified ? "unlinking" : "linking"
              } your ABHA number.`}
            </DialogDescription>
            <AbhaNumberOtpFlow
              flowType={AuthFlowTypes.PROFILE_UPDATE}
              setMemory={setMemory}
              existingAbhaNumber={existingAbhaNumber}
              transactionId={memory.transactionId}
              onVerifyOtpSuccess={onVerifyOtpSuccess}
              action={isKYCVerified ? DE_LINK : LINK}
            />
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AbhaUnlinkDialog;
