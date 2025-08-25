import { Loader2, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuthContext } from "@/hooks/useAuth";
import { useUserInitLinkingFlow } from "@/hooks/useUserInitLinkingFlow";

import FullScreenLoader from "@/common/loaders/FullScreenLoader";

import routes from "@/api";
import { ProviderIdentifier } from "@/types/gateway";
import {
  UserInitLinkingDiscoverRequest,
  UserInitLinkingDiscoverResponse,
} from "@/types/linkedFacility";
import { mutate } from "@/utils/request/request";

interface SearchRecordsStepProps {
  hip: ProviderIdentifier;
  setStep: Dispatch<SetStateAction<number>>;
  setSecondStepData: Dispatch<
    SetStateAction<UserInitLinkingDiscoverResponse | null>
  >;
}

const ReadOnlyField = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <div
      role="textbox"
      aria-readonly="true"
      className="h-10 rounded-md border bg-muted/40 px-3 flex items-center text-sm text-gray-700"
    >
      {value || "—"}
    </div>
  </div>
);

const SearchRecordsStep = ({
  hip,
  setStep,
  setSecondStepData,
}: SearchRecordsStepProps) => {
  const { user } = useAuthContext();
  const [patientId, setPatientId] = useState("");

  const { mutation: discoverMutation, isLoading } =
    useUserInitLinkingFlow<UserInitLinkingDiscoverRequest>({
      mutationFn: mutate(routes.linkedFacility.discover),
      onSuccess: (data) => {
        toast.success("Records fetched successfully");
        setSecondStepData(data.data as UserInitLinkingDiscoverResponse);
        setStep(2);
      },
    });

  const handleSearch = () => {
    let payload: UserInitLinkingDiscoverRequest = { hip };
    if (patientId) {
      payload.unverified_identifiers = [{ type: "MR", value: patientId }];
    }
    discoverMutation.mutate(payload);
  };

  if (!user) return null;

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <CardDescription>
          We will be sharing these details with the facility.
        </CardDescription>
      </CardHeader>
      <CardContent className="animate-enter">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ReadOnlyField label="Full name" value={user.fullName} />
          <ReadOnlyField label="Gender" value={user.gender} />
          <ReadOnlyField label="Year of birth" value={user.yearOfBirth} />
          <ReadOnlyField label="Mobile number" value={user.mobile} />
          <ReadOnlyField label="ABHA Number" value={user.abhaNumber} />
          <ReadOnlyField label="ABHA Address" value={user.abhaAddress} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="patientId">
              Patient ID{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="patientId"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-2">
        <Button
          size="lg"
          className="w-full"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Search className="mr-2 size-4" />
          )}
          {isLoading ? "Fetching..." : "Fetch records"}
        </Button>
      </CardFooter>
    </>
  );
};

export default SearchRecordsStep;
