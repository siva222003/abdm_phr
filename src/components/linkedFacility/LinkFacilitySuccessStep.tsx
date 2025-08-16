import { CheckCircle2 } from "lucide-react";
import { navigate } from "raviger";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

const LinkFacilitySuccessStep = () => {
  return (
    <>
      <CardContent className="animate-enter flex flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <CheckCircle2 className="xsm:size-14 size-10 text-primary" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-bold tracking-tight">All set!</h2>
          <p className="text-muted-foreground max-xsm:text-sm">
            Your records have been linked successfully. You can now access them
            anytime from your dashboard.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center pt-4">
        <Button
          size="lg"
          className="w-full"
          // TODO: Update the navigation to the linked facility page
          onClick={() => navigate("/")}
        >
          View Records
        </Button>
      </CardFooter>
    </>
  );
};

export default LinkFacilitySuccessStep;
