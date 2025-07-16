import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ConsentType } from "@/types/consent";

import EditConsentForm from "./EditConsentForm";

interface EditConsentSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  consentType: ConsentType;
}

export default function EditConsentSheet({
  open,
  setOpen,
  consentType,
}: EditConsentSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-2xl overflow-y-auto p-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg">Edit ABHA Profile</SheetTitle>
          <SheetDescription>
            Update your ABHA profile details below.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <EditConsentForm
            consentType={consentType}
            // userData={userData}
            // onUpdateSuccess={() => {
            //   setOpen(false);
            // }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
