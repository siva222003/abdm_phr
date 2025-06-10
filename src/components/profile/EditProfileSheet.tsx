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
}

export default function EditProfileSheet({
  open,
  setOpen,
  userData,
}: EditProfileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-2xl overflow-y-auto p-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg">Edit Abha Profile</SheetTitle>
          <SheetDescription>
            Update your Abha profile details below.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <EditProfileForm
            userData={userData}
            onUpdateSuccess={() => {
              setOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
