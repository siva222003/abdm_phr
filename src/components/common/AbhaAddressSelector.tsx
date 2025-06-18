import { Loader2Icon, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { User } from "@/types/auth";

interface AbhaAddressSelectorProps {
  addresses: User[];
  isListLoading?: boolean;
  isActionLoading: boolean;
  defaultSelectedAddress?: string;

  onContinue: (selectedAddress: string) => void;
  onCreateNew?: () => void;

  continueLabel?: string;
  continueButtonDisabled?: boolean;
  showCreateNew?: boolean;

  emptyState?: React.ReactNode;
}

const DefaultEmptyState = () => (
  <div className="flex flex-col items-center justify-center pb-6 pt-4 text-muted-foreground">
    <UserSearch className="w-10 h-10 mb-2 text-gray-400" />
    <p className="text-md font-medium">No addresses found</p>
  </div>
);

export default function AbhaAddressSelector({
  addresses,
  isListLoading = false,
  isActionLoading = false,
  defaultSelectedAddress,
  onContinue,
  onCreateNew,
  continueLabel = "Continue",
  continueButtonDisabled = false,
  showCreateNew = false,
  emptyState,
}: AbhaAddressSelectorProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultSelectedAddress || null,
  );

  useEffect(() => {
    if (!defaultSelectedAddress && addresses.length > 0) {
      setSelectedAddress(addresses[0].abhaAddress);
    }
  }, [addresses, defaultSelectedAddress]);

  const renderContent = () => {
    if (isListLoading) {
      return Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton key={idx} className="h-12 w-full rounded-lg" />
      ));
    }

    if (addresses.length === 0) {
      return emptyState || <DefaultEmptyState />;
    }

    return addresses.map(({ abhaAddress }) => {
      const isSelected = abhaAddress === selectedAddress;
      return (
        <div
          key={abhaAddress}
          className={cn(
            "relative cursor-pointer rounded-lg border p-3 text-sm shadow-sm transition-colors flex items-center",
            isSelected ? "border-primary bg-primary/10" : "hover:bg-primary/5",
          )}
          onClick={() => setSelectedAddress(abhaAddress)}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedAddress(abhaAddress);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-4 w-4 rounded-full border border-gray-400 transition-colors",
                isSelected ? "border-primary bg-primary" : "bg-white",
              )}
              aria-hidden="true"
            />
            <div className="font-mono">{abhaAddress}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="w-full rounded-md p-1">
        <div className="max-h-48 space-y-2">{renderContent()}</div>
      </ScrollArea>

      <div className="mt-2 pt-4 space-y-4">
        <Button
          className="w-full"
          disabled={
            !selectedAddress || isActionLoading || continueButtonDisabled
          }
          onClick={() => onContinue(selectedAddress!)}
        >
          {isActionLoading ? (
            <Loader2Icon className="text-white animate-spin scale-150" />
          ) : (
            continueLabel
          )}
        </Button>

        {showCreateNew && onCreateNew && (
          <>
            <div className="relative flex items-center justify-center text-xs uppercase">
              <span className="absolute left-0 right-0 top-1/2 border-t" />
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <span>Still want to create a new ABHA address? </span>
              <Button
                variant="link"
                className="h-auto p-0"
                disabled={isActionLoading}
                onClick={onCreateNew}
              >
                Create
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
