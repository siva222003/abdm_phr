import { ArrowRight, Clock } from "lucide-react";
import { navigate } from "raviger";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { PatientLockerBasic } from "@/types/healthLocker";
import { formatReadableDateTime } from "@/utils";

interface HealthLockerCardProps {
  data: PatientLockerBasic;
}

export default function HealthLockerCard({ data }: HealthLockerCardProps) {
  const handleView = () => {
    navigate(`/health-lockers/${data.lockerId}`);
  };

  return (
    <Card className="relative h-[160px] rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all">
      <div className="absolute top-3 right-3">
        <Badge
          variant={data.isActive ? "primary" : "destructive"}
          className="text-xs px-2 py-0.5"
        >
          {data.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
          {data.lockerName}
        </CardTitle>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="size-3.5" />
          {formatReadableDateTime(data.dateCreated, true)}
        </div>
      </CardHeader>

      <CardFooter className="flex justify-end pt-0">
        <Button
          size="sm"
          variant="outline"
          onClick={handleView}
          className="rounded-md flex items-center gap-1.5"
        >
          View
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
