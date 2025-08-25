import { ArrowRight } from "lucide-react";
import { Link } from "raviger";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Provider } from "@/types/gateway";

interface AddFacilityCardProps {
  data: Provider;
}

export default function AddFacilityCard({ data }: AddFacilityCardProps) {
  return (
    <Card className="group relative rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between h-full">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {data.identifier.name}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {data.facilityType?.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              {type}
            </Badge>
          ))}
          {data.isGovtEntity && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              Govt
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardFooter className="p-0 mt-4 flex justify-end">
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-50"
        >
          <Link href={`/linked-facilities/add/${data.identifier.id}`}>
            Link Facility <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
