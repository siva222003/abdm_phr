import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  ConsentDurationSection,
  HITypeSelector,
  HipSelector,
  SubscriptionCategoriesSelector,
} from "@/components/consent/ConsentFormSections";

import {
  ConsentBase,
  ConsentHITypes,
  ConsentLinks,
  isSubscription,
} from "@/types/consent";
import { SubscriptionCategories } from "@/types/subscription";
import { toIsoUtcString } from "@/utils";

interface EditConsentSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: ConsentBase;
  onUpdate: (payload: ConsentBase) => void;
  isLoading?: boolean;
}

interface FormData {
  fromDate: string;
  toDate: string;
  dataEraseAt: string;
  selectedHiTypes: ConsentHITypes[];
  selectedSubscriptionCategories: SubscriptionCategories[];
  selectedHips: ConsentLinks[];
}

export default function EditConsentSheet({
  open,
  setOpen,
  data,
  onUpdate,
  isLoading = false,
}: EditConsentSheetProps) {
  const [formData, setFormData] = useState<FormData>({
    fromDate: "",
    toDate: "",
    dataEraseAt: "",
    selectedHiTypes: [],
    selectedSubscriptionCategories: [],
    selectedHips: [],
  });

  useEffect(() => {
    if (open && data) {
      setFormData({
        fromDate: data.fromDate,
        toDate: data.toDate,
        dataEraseAt: data.dataEraseAt || "",
        selectedHiTypes: data.hiTypes,
        selectedSubscriptionCategories: data.subscriptionCategories || [],
        selectedHips: data.links,
      });
    }
  }, [open, data]);

  const validateForm = () => {
    const now = new Date();
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);

    if (fromDate >= toDate) {
      toast.error("From date must be before to date");
      return false;
    }

    if (toDate <= now) {
      toast.error("To date must be in the future");
      return false;
    }

    if (formData.dataEraseAt) {
      const dataEraseDate = new Date(formData.dataEraseAt);
      if (dataEraseDate <= now) {
        toast.error("Data erase date must be in the future");
        return false;
      }
    }

    if (formData.selectedHiTypes.length === 0) {
      toast.error("Please select at least one health information type");
      return false;
    }

    if (formData.selectedHips.length === 0) {
      toast.error("Please select at least one health information provider");
      return false;
    }

    if (
      isSubscription(data.type) &&
      formData.selectedSubscriptionCategories.length === 0
    ) {
      toast.error("Please select at least one subscription category");
      return false;
    }

    return true;
  };

  const handleUpdate = () => {
    if (!validateForm()) {
      return;
    }

    const updatedData: ConsentBase = {
      ...data,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      dataEraseAt: formData.dataEraseAt,
      hiTypes: formData.selectedHiTypes,
      subscriptionCategories: formData.selectedSubscriptionCategories,
      links: formData.selectedHips,
    };

    onUpdate(updatedData);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-2xl overflow-y-auto p-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg">Edit Consent Details</SheetTitle>
          <SheetDescription>
            Update consent information and permissions below.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="space-y-8 mt-4"
        >
          <ConsentDurationSection
            fromDate={formData.fromDate}
            toDate={formData.toDate}
            dataEraseAt={formData.dataEraseAt}
            onDateChange={(
              date: string,
              key: "fromDate" | "toDate" | "dataEraseAt",
            ) => {
              setFormData((prev) => ({
                ...prev,
                [key]: toIsoUtcString(date),
              }));
            }}
          />

          <HITypeSelector
            selectedTypes={formData.selectedHiTypes}
            onSelectionChange={(types: ConsentHITypes[]) => {
              setFormData((prev) => ({ ...prev, selectedHiTypes: types }));
            }}
          />

          {isSubscription(data.type) && (
            <SubscriptionCategoriesSelector
              selectedCategories={formData.selectedSubscriptionCategories}
              onSelectionChange={(categories) =>
                setFormData((prev) => ({
                  ...prev,
                  selectedSubscriptionCategories: categories,
                }))
              }
            />
          )}

          <HipSelector
            hips={data.links}
            selectedHips={formData.selectedHips}
            onSelectionChange={(hips: ConsentLinks[]) =>
              setFormData((prev) => ({ ...prev, selectedHips: hips }))
            }
            showContexts={!isSubscription(data.type)}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
