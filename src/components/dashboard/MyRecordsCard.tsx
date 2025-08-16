import { Hospital } from "lucide-react";
import { Link } from "raviger";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PatientLink } from "@/types/gateway";

interface MyRecordsCardProps {
  data: PatientLink;
}

export default function MyRecordsCard({ data }: MyRecordsCardProps) {
  return (
    <Link
      href={`/my-records/${data.hip.id}`}
      className="block h-[160px] hover:scale-[1.02] transition-transform"
    >
      <Card className="gap-2 h-full border  transition-colors rounded-xl shadow-sm">
        <CardHeader className="flex items-center gap-3 pb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Hospital className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg font-medium text-gray-800 line-clamp-1">
            {data.hip.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-700">Patient ID:</span>{" "}
            {data.careContexts[0].patientReference}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
