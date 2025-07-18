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
  ConsentTypes,
} from "@/types/consent";
import { SubscriptionCategories } from "@/types/subscription";
import { toIsoUtcString } from "@/utils";

const hips = [
  {
    hip: {
      id: "IN3210000018",
      name: "Coronasafe Care 02",
      type: "HIP",
    },
    careContexts: [
      {
        careContextReference: "v2::prescription::2025-07-06",
        patientReference: "1234567890",
      },
    ],
  },
  {
    hip: {
      id: "IN2910000287",
      name: "eGov Care Facility 001",
      type: "HIP",
    },
    careContexts: [
      {
        careContextReference: "v2::prescription::2025-07-06",
        patientReference: "1234567890",
      },
    ],
  },
];

interface EditConsentSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  consentType: ConsentTypes;
  data: ConsentBase;
  onUpdate: (payload: ConsentBase) => void;
}

export default function EditConsentSheet({
  open,
  setOpen,
  consentType,
  data,
  onUpdate,
}: EditConsentSheetProps) {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    dataEraseAt: "",
    selectedHiTypes: [] as ConsentHITypes[],
    selectedSubscriptionCategories: [] as SubscriptionCategories[],
    selectedHips: [] as ConsentLinks[],
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when sheet opens
  useEffect(() => {
    if (open && data) {
      setFormData({
        fromDate: data.fromDate || "",
        toDate: data.toDate || "",
        dataEraseAt: data.dataEraseAt || "",
        selectedHiTypes: data.hiTypes || [],
        selectedSubscriptionCategories:
          (data.subscriptionCategories as SubscriptionCategories[]) || [],
        selectedHips: data.links || [],
      });
    }
  }, [open, data]);

  const validateForm = (): boolean => {
    const now = new Date();
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);

    // Check if from date is less than to date
    if (fromDate >= toDate) {
      toast.error("From date must be before to date");
      return false;
    }

    // Check if to date is in the future
    if (toDate <= now) {
      toast.error("To date must be in the future");
      return false;
    }

    // Check data erase date if provided
    if (formData.dataEraseAt) {
      const dataEraseDate = new Date(formData.dataEraseAt);
      if (dataEraseDate <= now) {
        toast.error("Data erase date must be in the future");
        return false;
      }
    }

    // Check if at least one HI type is selected
    if (formData.selectedHiTypes.length === 0) {
      toast.error("Please select at least one health information type");
      return false;
    }

    // Check if at least one HIP is selected
    if (formData.selectedHips.length === 0) {
      toast.error("Please select at least one health information provider");
      return false;
    }

    // Check subscription categories if it's a subscription
    if (
      consentType === ConsentTypes.SUBSCRIPTION &&
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

    setIsLoading(true);

    // Simulate async operation
    setTimeout(() => {
      const updatedData: ConsentBase = {
        ...data,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        dataEraseAt: formData.dataEraseAt,
        hiTypes: formData.selectedHiTypes,
        subscriptionCategories:
          consentType === ConsentTypes.SUBSCRIPTION
            ? formData.selectedSubscriptionCategories
            : undefined,
        links: formData.selectedHips,
      };

      onUpdate(updatedData);
      setIsLoading(false);
      setOpen(false);
      toast.success("Consent updated successfully");
    }, 500);
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

        <div className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-8"
          >
            <ConsentDurationSection
              fromDate={formData.fromDate}
              toDate={formData.toDate}
              dataEraseAt={formData.dataEraseAt}
              onFromDateChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  fromDate: toIsoUtcString(date),
                }));
              }}
              onToDateChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  toDate: toIsoUtcString(date),
                }))
              }
              onDataEraseAtChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  dataEraseAt: toIsoUtcString(date),
                }))
              }
            />

            <HITypeSelector
              selectedTypes={formData.selectedHiTypes}
              onSelectionChange={(types: ConsentHITypes[]) => {
                setFormData((prev) => ({ ...prev, selectedHiTypes: types }));
              }}
            />

            {consentType === ConsentTypes.SUBSCRIPTION && (
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
              hips={hips}
              // selectedHips={formData.selectedHips}
              // onSelectionChange={(hips: ConsentLinks[]) =>
              //   setFormData((prev) => ({ ...prev, selectedHips: hips }))
              // }
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
