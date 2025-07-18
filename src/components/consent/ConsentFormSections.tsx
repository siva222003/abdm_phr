import dayjs from "dayjs";
import { Check, ChevronDown, Minus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ConsentHITypes, ConsentLinks } from "@/types/consent";
import { SubscriptionCategories } from "@/types/subscription";
import { dateQueryString, toTitleCase } from "@/utils";

export function ConsentDurationSection({
  fromDate,
  toDate,
  dataEraseAt = "",
  onFromDateChange,
  onToDateChange,
  onDataEraseAtChange,
}: {
  fromDate: string;
  toDate: string;
  dataEraseAt?: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onDataEraseAtChange: (date: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">Consent Duration</h3>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-4",
          !dataEraseAt && "mb-2",
        )}
      >
        <div className="space-y-2">
          <Label className="text-s">Valid From</Label>
          <Input
            type="date"
            value={dateQueryString(fromDate)}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-s">Valid To</Label>
          <Input
            type="date"
            min={dayjs().format("YYYY-MM-DD")}
            value={dateQueryString(toDate)}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>
      </div>

      {dataEraseAt && (
        <div className="space-y-2">
          <Label className="text-s">Data Erase At</Label>
          <Input
            type="datetime-local"
            min={dayjs().format("YYYY-MM-DDTHH:mm")}
            value={dateQueryString(dataEraseAt, true)}
            onChange={(e) => onDataEraseAtChange(e.target.value)}
          />
          <p className="text-sm text-gray-500 ml-1">
            Data will be erased after the specified date and time.
          </p>
        </div>
      )}
    </div>
  );
}

export function HITypeSelector({
  selectedTypes,
  onSelectionChange,
}: {
  selectedTypes: ConsentHITypes[];
  onSelectionChange: (types: ConsentHITypes[]) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-gray-800">
        Health Information Types
      </h3>

      <div className="space-y-2">
        {Object.values(ConsentHITypes).map((type) => {
          const isChecked = selectedTypes.includes(type);

          return (
            <Label
              key={type}
              className={`flex items-center gap-3 rounded-md border p-2.5 transition-colors cursor-pointer ${
                isChecked
                  ? "border-primary-300"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() =>
                  onSelectionChange(
                    selectedTypes.includes(type)
                      ? selectedTypes.filter((t) => t !== type)
                      : [...selectedTypes, type],
                  )
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary text-white"
              />
              <span className="text-sm font-medium text-gray-900">{type}</span>
            </Label>
          );
        })}
      </div>
    </div>
  );
}

export function SubscriptionCategoriesSelector({
  selectedCategories,
  onSelectionChange,
}: {
  selectedCategories: SubscriptionCategories[];
  onSelectionChange: (categories: SubscriptionCategories[]) => void;
}) {
  return (
    <div className="space-y-5 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">Subscription Categories</h3>

      {selectedCategories.map((item, index) => (
        <Label
          key={index}
          className="flex items-start gap-3 rounded-lg border border-gray-200 p-4"
        >
          <Checkbox
            checked={selectedCategories.includes(item)}
            onCheckedChange={() =>
              onSelectionChange(
                selectedCategories.includes(item)
                  ? selectedCategories.filter((c) => c !== item)
                  : [...selectedCategories, item],
              )
            }
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary text-white"
          />
          <div className="grid gap-1 font-normal">
            <p className="text-sm font-medium leading-none">
              {toTitleCase(item)}
            </p>
            <p className="text-sm text-muted-foreground">
              {item === SubscriptionCategories.LINK
                ? "Enables HIU to receive new care context links"
                : "Enables HIU to access data on existing care contexts"}
            </p>
          </div>
        </Label>
      ))}
    </div>
  );
}

export function HipSelector({ hips }: { hips: ConsentLinks[] }) {
  const [selectedHips, setSelectedHips] = useState<Set<string>>(
    new Set(hips.map((h) => h.hip.id)),
  );
  const [selectedContexts, setSelectedContexts] = useState<Set<string>>(
    new Set(
      hips.flatMap((h) => h.careContexts.map((c) => c.careContextReference)),
    ),
  );

  const toggleHip = (hipId: string) => {
    const hip = hips.find((h) => h.hip.id === hipId);
    if (!hip) return;

    const newContexts = new Set(selectedContexts);
    const newHips = new Set(selectedHips);

    if (newHips.has(hipId)) {
      hip.careContexts.forEach((ctx) =>
        newContexts.delete(ctx.careContextReference),
      );
      newHips.delete(hipId);
    } else {
      hip.careContexts.forEach((ctx) =>
        newContexts.add(ctx.careContextReference),
      );
      newHips.add(hipId);
    }

    setSelectedContexts(newContexts);
    setSelectedHips(newHips);
  };

  const toggleContext = (hipId: string, contextId: string) => {
    const hip = hips.find((h) => h.hip.id === hipId);
    if (!hip) return;

    const newContexts = new Set(selectedContexts);
    newContexts.has(contextId)
      ? newContexts.delete(contextId)
      : newContexts.add(contextId);

    const allSelected = hip.careContexts.every((ctx) =>
      newContexts.has(ctx.careContextReference),
    );
    const noneSelected = hip.careContexts.every(
      (ctx) => !newContexts.has(ctx.careContextReference),
    );

    const newHips = new Set(selectedHips);
    if (allSelected) newHips.add(hipId);
    else if (noneSelected) newHips.delete(hipId);

    setSelectedContexts(newContexts);
    setSelectedHips(newHips);
  };

  const getHipState = (hipId: string) => {
    const hip = hips.find((h) => h.hip.id === hipId);
    if (!hip) return "unchecked";

    const selectedCount = hip.careContexts.filter((ctx) =>
      selectedContexts.has(ctx.careContextReference),
    ).length;
    const total = hip.careContexts.length;

    if (selectedCount === 0) return "unchecked";
    if (selectedCount === total) return "checked";
    return "indeterminate";
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium">HIPs and Care Contexts</h3>

      {hips.map((hip) => {
        const hipId = hip.hip.id;
        const hipState = getHipState(hipId);
        const selectedCount = hip.careContexts.filter((ctx) =>
          selectedContexts.has(ctx.careContextReference),
        ).length;

        return (
          <Collapsible key={hipId}>
            <div
              className={`bg-white border rounded-lg shadow-sm transition-all ${
                hipState === "checked"
                  ? "border-primary/50 shadow-sm shadow-primary/10"
                  : hipState === "indeterminate"
                    ? "border-primary/20 shadow-primary/5"
                    : "border-gray-100 hover:shadow-md"
              }`}
            >
              <div className="px-4">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer w-full py-4 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <Label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={hipState === "checked"}
                            onChange={() => toggleHip(hipId)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                              hipState === "checked" ||
                              hipState === "indeterminate"
                                ? "bg-primary border-primary text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {hipState === "checked" && (
                              <Check className="w-4 h-4" />
                            )}
                            {hipState === "indeterminate" && (
                              <Minus className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </Label>

                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground block truncate">
                          {hip.hip.name}
                        </span>
                        {selectedCount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {selectedCount} contexts selected
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="py-4 border-t border-gray-200">
                  <div className="grid gap-2">
                    {hip.careContexts.map((ctx) => {
                      const isSelected = selectedContexts.has(
                        ctx.careContextReference,
                      );
                      return (
                        <Label
                          key={ctx.careContextReference}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary/40 bg-primary/5"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleContext(hipId, ctx.careContextReference)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span
                            className={`text-sm ${isSelected ? "text-primary font-medium" : "text-gray-700"}`}
                          >
                            {ctx.display || ctx.careContextReference}
                          </span>
                        </Label>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
