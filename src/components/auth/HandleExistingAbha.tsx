import { UserSearch } from "lucide-react";
import { useNavigate } from "raviger";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AbhaAddressSelector from "@/components/common/AbhaAddressSelector";

import { useAuthContext } from "@/hooks/useAuth";

import { FlowType, FormMemory } from "@/types/auth";

interface HandleExistingAbhaProps {
  flowType: FlowType;
  memory: FormMemory | null;
  goTo: (step: string) => void;
}

function AuthEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center pb-6 pt-4 text-muted-foreground">
      <UserSearch className="w-10 h-10 mb-2 text-gray-400" />
      <p className="text-md font-medium">No addresses found</p>
      <p className="text-sm text-center max-w-xs">
        <span>
          You don&apos;t have any ABHA address linked yet. To get started, you
          can{" "}
        </span>
        <Button
          variant="link"
          className="h-auto p-0 inline"
          onClick={() => navigate("/register")}
        >
          create one here
        </Button>
        .
      </p>
    </div>
  );
}

const HandleExistingAbhaAddress = ({
  memory,
  goTo,
  flowType,
}: HandleExistingAbhaProps) => {
  const { verifyUser, isVerifyingUser } = useAuthContext();

  const existingAbhaAddresses = memory?.existingAbhaAddresses ?? [];
  const hasAddresses = existingAbhaAddresses.length > 0;

  const handleCreateNew = useCallback(() => {
    if (!memory) {
      return;
    }

    if (memory.mode === "abha-number") {
      goTo("choose-abha-address");
    } else {
      goTo("add-demographic-details");
    }
  }, [memory, goTo]);

  const handleSelectExisting = useCallback(
    (selectedAddress: string) => {
      if (!selectedAddress || !memory) {
        return;
      }

      verifyUser({
        abha_address: selectedAddress,
        transaction_id: memory.transactionId,
        type: memory.mode,
        verify_system: memory.verifySystem,
      });
    },
    [verifyUser, memory],
  );

  useEffect(() => {
    if (!hasAddresses && flowType === "enrollment" && memory) {
      handleCreateNew();
    }
  }, [hasAddresses, flowType, memory, handleCreateNew]);

  const getCardDescription = () => {
    if (!hasAddresses) return null;

    const addressCount = existingAbhaAddresses.length;
    const plural = addressCount > 1 ? "es" : "";
    const createNewText =
      flowType === "enrollment" ? " or create a new one" : "";

    return `We found ${addressCount} ABHA address${plural} associated with your account. Choose one to continue${createNewText}.`;
  };

  return (
    <Card className="mx-4 sm:w-full">
      <CardHeader className="space-y-1 px-4">
        <CardTitle className="text-2xl font-bold">
          Existing ABHA Addresses
        </CardTitle>
        {hasAddresses && (
          <CardDescription className="text-sm">
            {getCardDescription()}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <AbhaAddressSelector
          addresses={existingAbhaAddresses}
          isActionLoading={isVerifyingUser}
          onContinue={handleSelectExisting}
          showCreateNew={flowType === "enrollment"}
          onCreateNew={handleCreateNew}
          emptyState={<AuthEmptyState />}
        />
      </CardContent>
    </Card>
  );
};

export default HandleExistingAbhaAddress;
