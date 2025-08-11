import { ArrowRight } from "lucide-react";
import { Link } from "raviger";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Provider } from "@/types/gateway";

interface AddFacilityCardProps {
  data: Provider;
}

export default function AddFacilityCard({ data }: AddFacilityCardProps) {
  return (
    <Card className="relative group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {data.identifier.name}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 flex-wrap mt-2">
            {data.facilityType?.map((type) => (
              <Badge variant="outline" key={type}>
                {type}
              </Badge>
            ))}
          </div>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button variant="link" asChild className="ml-auto text-gray-800">
          <Link href={`/linked-facilities/add/${data.identifier.id}`}>
            Link Facility
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
