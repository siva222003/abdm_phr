import { Clock } from "lucide-react";
import { Link } from "raviger";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PatientLockerBasic } from "@/types/healthLocker";
import { formatReadableDateTime } from "@/utils";

interface HealthLockerCardProps {
  data: PatientLockerBasic;
}

export default function HealthLockerCard({ data }: HealthLockerCardProps) {
  return (
    <Link href={`/health-lockers/${data.lockerId}`} className="block h-[160px]">
      <Card className="hover:shadow-md transition-shadow h-full gap-3">
        <CardHeader>
          <CardTitle className="text-lg line-clamp-1">
            {data.lockerName}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Clock className="size-3.5" />
            {formatReadableDateTime(data.dateCreated, true)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant={data.isActive ? "primary" : "destructive"}>
            {data.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
