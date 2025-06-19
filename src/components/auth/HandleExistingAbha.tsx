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
          You don't have any ABHA address linked yet. To get started, you
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
  const { existingAbhaAddresses = [] } = memory || {};

  const handleCreateNew = useCallback(() => {
    if (memory?.mode === "abha-number") goTo("choose-abha-address");
    else goTo("add-demographic-details");
  }, [memory?.mode, goTo]);

  const handleSelectExisting = useCallback(
    (selectedAddress: string) => {
      if (!selectedAddress || !memory?.transactionId) return;
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
    if (!existingAbhaAddresses.length && flowType === "enrollment") {
      handleCreateNew();
    }
  }, [existingAbhaAddresses.length, flowType, handleCreateNew]);

  return (
    <Card className="mx-4 sm:w-full">
      <CardHeader className="space-y-1 px-4">
        <CardTitle className="text-2xl font-bold">
          Existing ABHA Addresses
        </CardTitle>
        {existingAbhaAddresses.length > 0 && (
          <CardDescription className="text-sm">
            We found {existingAbhaAddresses.length} ABHA address
            {existingAbhaAddresses.length > 1 && "es"} associated with your
            account. Choose one to continue{" "}
            {flowType === "enrollment" && "or create a new one"}.
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
