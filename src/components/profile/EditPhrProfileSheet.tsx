import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { PhrProfile } from "@/types/profile";

import PhrProfileForm from "./PhrProfileForm";

interface EditPhrProfileProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userData: PhrProfile;
}

export default function EditPhrProfile({
  open,
  setOpen,
  userData,
}: EditPhrProfileProps) {
  //   const { t } = useTranslation();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Edit Abha Profile</SheetTitle>
          <SheetDescription>
            Update your Abha profile details below.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <PhrProfileForm
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
