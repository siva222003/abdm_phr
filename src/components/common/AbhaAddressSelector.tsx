import {
  CheckCircle2,
  Loader2Icon,
  TriangleAlert,
  UserSearch,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { User } from "@/types/auth";
import { KYC_STATUS, KycStatus } from "@/types/profile";

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

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pb-6 pt-4 text-muted-foreground">
      <UserSearch className="w-10 h-10 mb-2 text-gray-400" />
      <p className="text-md font-medium">No addresses found</p>
    </div>
  );
}

function AddressItem({
  address,
  selected,
  onSelect,
  kycStatus,
}: {
  address: string;
  selected: boolean;
  onSelect: (address: string) => void;
  kycStatus: KycStatus;
}) {
  return (
    <div
      key={address}
      className={cn(
        "cursor-pointer rounded-lg border p-3 text-sm shadow-sm transition-colors flex items-center gap-2",
        selected ? "border-primary bg-primary/10" : "hover:bg-primary/5",
      )}
      onClick={() => onSelect(address)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(address);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
    >
      <div
        className={cn(
          "size-4 rounded-full border border-gray-400 transition-colors flex-shrink-0",
          selected ? "border-primary bg-primary" : "bg-white",
        )}
        aria-hidden="true"
      />
      <div className="font-mono truncate flex-1">{address}</div>

      <div className="flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {kycStatus === KYC_STATUS.VERIFIED ? (
                <CheckCircle2 className="text-primary-500 size-5" />
              ) : (
                <TriangleAlert className="text-yellow-500 size-5" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {kycStatus === KYC_STATUS.VERIFIED
                ? "KYC Verified"
                : "KYC Pending"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

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
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSelectedAddress) {
      setSelectedAddress(defaultSelectedAddress);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0].abhaAddress);
    }
  }, [defaultSelectedAddress, addresses]);

  const handleContinue = () => {
    if (selectedAddress) {
      onContinue(selectedAddress);
    }
  };

  const content = useMemo(() => {
    if (isListLoading) {
      return Array.from({ length: 3 }, (_, idx) => (
        <Skeleton key={idx} className="h-12 w-full rounded-lg" />
      ));
    }

    if (addresses.length === 0) {
      return emptyState || <DefaultEmptyState />;
    }

    return addresses.map(({ abhaAddress, kycStatus }) => (
      <AddressItem
        key={abhaAddress}
        address={abhaAddress}
        selected={abhaAddress === selectedAddress}
        onSelect={setSelectedAddress}
        kycStatus={kycStatus}
      />
    ));
  }, [addresses, selectedAddress, isListLoading, emptyState]);

  const isContinueDisabled =
    !selectedAddress || isActionLoading || continueButtonDisabled;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="w-full rounded-md">
        <div className="max-h-48 space-y-2 px-1">{content}</div>
      </ScrollArea>

      <div className="mt-2 pt-4 space-y-4">
        <Button
          className="w-full"
          disabled={isContinueDisabled}
          onClick={handleContinue}
        >
          {isActionLoading ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Loading...
            </>
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
