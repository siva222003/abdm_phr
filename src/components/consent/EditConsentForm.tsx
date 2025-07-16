import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  ConsentDurationSection,
  HealthInformationTypesSection,
  HipSelector,
  SubscriptionCategoriesSection,
} from "@/components/consent/ConsentFormSections";

import { ConsentType, ConsentTypes } from "@/types/consent";

interface EditConsentFormProps {
  consentType: ConsentType;
}

export default function EditConsentForm({ consentType }: EditConsentFormProps) {
  return (
    <div>
      <form className="space-y-8">
        <ConsentDurationSection />
        <HealthInformationTypesSection />
        {consentType === ConsentTypes.SUBSCRIPTION && (
          <SubscriptionCategoriesSection />
        )}

        <HipSelector />

        <Button type="submit" className="w-full" variant="primary">
          <>
            <Loader2Icon className="mr-2 size-4 animate-spin" />
            Updating...
          </>
        </Button>
      </form>
    </div>
  );
}
