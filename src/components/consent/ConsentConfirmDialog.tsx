import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { navigate } from "raviger";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import routes from "@/api";
import { mutate } from "@/utils/request/request";

type ConsentConfirmDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  requestId: string;
};

const ConsentConfirmDialog = ({
  open,
  setOpen,
  requestId,
}: ConsentConfirmDialogProps) => {
  const queryClient = useQueryClient();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
    }
  };

  const denyConsentMutation = useMutation({
    mutationFn: mutate(routes.consent.deny, {
      pathParams: {
        requestId: requestId,
      },
    }),
    onSuccess: () => {
      toast.success("Consent denied successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["consents"] });
      navigate("/consents?category=REQUESTS&status=DENIED&limit=15&offset=0");
    },
    onError: () => {
      toast.error("Failed to deny consent");
    },
  });

  const handleConfirm = () => {
    denyConsentMutation.mutate({});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlink ABHA Number</DialogTitle>
          <DialogDescription className="space-y-2 pb-4">
            <div>
              Do you really want to deny this consent? This action cannot be
              undone.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={denyConsentMutation.isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={denyConsentMutation.isPending}
            onClick={handleConfirm}
          >
            {denyConsentMutation.isPending ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Denying...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentConfirmDialog;
