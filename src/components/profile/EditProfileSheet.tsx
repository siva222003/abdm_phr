import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { PhrProfile } from "@/types/profile";

import EditProfileForm from "./EditProfileForm";

interface EditProfileSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userData: PhrProfile;
  isKYCVerified: boolean;
}

export default function EditProfileSheet({
  open,
  setOpen,
  userData,
  isKYCVerified,
}: EditProfileSheetProps) {
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
          <EditProfileForm
            userData={userData}
            isKYCVerified={isKYCVerified}
            onUpdateSuccess={() => {
              setOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
