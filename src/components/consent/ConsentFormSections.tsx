import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const hips = [
  {
    id: "apollo",
    name: "Apollo Hospital",
    careContexts: ["Consultation 2022", "X-ray 2023", "Blood Test"],
  },
  {
    id: "aiims",
    name: "AIIMS Delhi",
    careContexts: ["ER Visit", "Surgery 2021"],
  },
];

type HipSelectorProps = {
  mode?: "nested" | "simple";
};

export function HipSelector({ mode = "simple" }: HipSelectorProps) {
  const [selectedContexts, setSelectedContexts] = useState<
    Record<string, Set<string>>
  >({});
  const [selectedHips, setSelectedHips] = useState<Record<string, boolean>>({});

  const toggleContext = (hipId: string, context: string) => {
    setSelectedContexts((prev) => {
      const existing = new Set(prev[hipId] || []);
      existing.has(context) ? existing.delete(context) : existing.add(context);
      return { ...prev, [hipId]: existing };
    });
  };

  const toggleHip = (hipId: string) => {
    setSelectedHips((prev) => {
      const current = !!prev[hipId];
      return { ...prev, [hipId]: !current };
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">
        Select HIPs{mode === "nested" && " and Care Contexts"}
      </h3>

      {hips.map((hip) =>
        mode === "simple" ? (
          <div
            key={hip.id}
            onClick={() => toggleHip(hip.id)}
            className="flex items-center justify-between cursor-pointer border border-gray-200 rounded-md px-4 py-3 hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={!!selectedHips[hip.id]}
                onClick={(e) => e.stopPropagation()} // prevent parent click
                onCheckedChange={() => toggleHip(hip.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm font-medium text-gray-800">
                {hip.name}
              </span>
            </div>
          </div>
        ) : (
          <Collapsible
            key={hip.id}
            className="rounded-md border border-gray-200 transition-all"
          >
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between p-3 hover:bg-accent cursor-pointer">
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={!!selectedHips[hip.id]}
                    onCheckedChange={() => toggleHip(hip.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="font-medium text-gray-800">{hip.name}</span>
                </div>
                <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="p-3 pt-0 space-y-2 transition-all duration-200">
              {hip.careContexts.map((context) => {
                const isChecked =
                  selectedContexts[hip.id]?.has(context) || false;

                return (
                  <Label
                    key={context}
                    className="flex items-center gap-3 rounded-md border border-gray-200 p-2.5"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleContext(hip.id, context)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-gray-800 font-medium">
                      {context}
                    </span>
                  </Label>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ),
      )}
    </div>
  );
}

export function HealthInformationTypesSection() {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">Health Information Types</h3>

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
        ].map((type) => {
          const isChecked = true;
          return (
            <Label
              key={type}
              className={`flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer ${
                isChecked ? "" : "border-gray-200"
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => {}}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary text-white"
              />
              <span className="text-sm font-medium text-gray-800">{type}</span>
            </Label>
          );
        })}
      </div>
    </div>
  );
}

export function SubscriptionCategoriesSection() {
  return (
    <div className="space-y-5 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">Subscription Categories</h3>

      {[
        {
          id: "link",
          label: "Link",
          description: "Enables HIU to receive new care context links",
          checked: true,
        },
        {
          id: "data",
          label: "Data",
          description: "Enables HIU to access data on existing care contexts",
          checked: true,
        },
      ].map((item) => (
        <Label
          key={item.id}
          className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
        >
          <Checkbox
            defaultChecked={item.checked}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary text-white"
          />
          <div className="grid gap-1 font-normal">
            <p className="text-sm font-medium leading-none">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </Label>
      ))}
    </div>
  );
}

export function ConsentDurationSection() {
  return (
    <div className="space-y-5 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">Consent Duration</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-s">Valid From</Label>
          <Input type="date" />
          <p className="text-sm text-gray-500"> </p>
        </div>
        <div className="space-y-2">
          <Label className="text-s">Valid To</Label>
          <Input type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-s">Data Erase At</Label>
        <Input type="datetime-local" />
        <p className="text-sm text-gray-500">
          Data will be erased after the specified date and time.
        </p>
      </div>
    </div>
  );
}
