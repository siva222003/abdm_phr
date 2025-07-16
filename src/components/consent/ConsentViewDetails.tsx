import { ChevronDown, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function ConsentBasicDetails() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>
          Basic information about the consent request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Requester</p>
          <p className="text-base text-gray-900 font-medium">John Doe</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Purpose of Request</p>
          <p className="text-base text-gray-900 font-medium">Self</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Request Type</p>
          <Badge variant="secondary">Subscription</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsentDurationDetails() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg">Consent Duration</CardTitle>
        <CardDescription>
          Duration information about the validity of the consent request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Valid From</p>
          <p className="text-base text-gray-900 font-medium">
            Jan 1, 2025 10:00:00 AM
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Valid To</p>
          <p className="text-base text-gray-900 font-medium">
            Jan 1, 2025 10:00:00 AM
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsentHealthInformationTypes() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg">
          Requested Health Information Types
        </CardTitle>
        <CardDescription>
          These are the health information types that the requester has
          requested.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[
            "Prescription",
            "Medical History",
            "Lab Results",
            "Medications",
            "Allergies",
            "Procedures",
            "Imaging",
            "Other",
          ].map((type, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-secondary-100 rounded-lg border border-secondary-200"
            >
              <FileText className="size-4" />
              <span className="text-sm font-medium">{type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SubscriptionCategories() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg">Subscription Categories</CardTitle>
        <CardDescription>
          These categories determine what type of information the HIU will
          receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-2 h-2 mt-1 bg-blue-500 rounded-full" />
          <div>
            <p className="text-base font-medium text-gray-900">LINK</p>
            <p className="text-sm text-gray-600">
              Enables the HIU to receive notifications when new care contexts
              are linked to a patient.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-2 h-2 mt-1 bg-green-500 rounded-full" />
          <div>
            <p className="text-base font-medium text-gray-900">DATA</p>
            <p className="text-sm text-gray-600">
              Enables the HIU to receive health information for existing care
              contexts already linked to a patient.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConsentHIPs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Health Information Providers</CardTitle>
        <CardDescription>
          These are the health information providers that the requester has
          requested.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            name: "Facility 1",
            careContexts: ["Context 1", "Context 2"],
          },
        ].map((facility, facilityIndex) => (
          <Collapsible key={facilityIndex} className="space-y-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 px-2">
                <h3 className="text-left">{facility.name}</h3>
                <Badge
                  variant="outline"
                  className="border-indigo-200 bg-indigo-50 text-indigo-700"
                >
                  {facility.careContexts.length} contexts
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-4 space-y-2">
              {facility.careContexts.map((context, contextIndex) => (
                <div
                  key={contextIndex}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">
                    {context}
                  </span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
