import { CheckCircle2 } from "lucide-react";
import { navigate } from "raviger";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

const LinkFacilitySuccessStep = () => {
  return (
    <>
      <CardContent className="animate-enter flex flex-col items-center space-y-4 text-center">
        <CheckCircle2 className="size-14 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">All set!</h2>
          <p className="text-muted-foreground">
            Your records have been linked successfully.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            // TODO: Update the navigation to the linked facility page
            navigate("/dashboard");
          }}
        >
          View Records
        </Button>
      </CardFooter>
    </>
  );
};

export default LinkFacilitySuccessStep;
