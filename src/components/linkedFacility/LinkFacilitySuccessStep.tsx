import { useMutation } from "@tanstack/react-query";
import { Link, Loader2 } from "lucide-react";
import { navigate } from "raviger";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

import { useAuthContext } from "@/hooks/useAuth";

import routes from "@/api";
import { mutate } from "@/utils/request/request";

const LinkFacilitySuccessStep = () => {
  const { user } = useAuthContext();

  const { mutate: initConsent, isPending } = useMutation({
    mutationFn: mutate(routes.consent.init),
    onSuccess: () => {
      toast.success(
        "Request initiated successfully. It might take some time to receive the records.",
      );
      navigate("/");
    },
  });

  const handleInitConsent = () => {
    if (!user?.abhaAddress) {
      return;
    }
    initConsent({ patient_id: user.abhaAddress });
  };

  return (
    <>
      <CardContent className="animate-enter flex flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-primary/10 p-6 shadow-sm flex items-center justify-center">
          <Link className="xsm:size-16 size-12 text-primary" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            All set!
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            The facility has been linked. Pull your records now to access them
            anytime from your dashboard.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center pt-4">
        <Button
          size="lg"
          className="w-full max-w-xs shadow-md"
          onClick={handleInitConsent}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Pull Records"
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default LinkFacilitySuccessStep;
