import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ConsentBase } from "@/types/consent";

interface ConsentCardsProps {
  data: { consents: ConsentBase[] };
  onView: (id: string, type: "consent" | "subscription") => void;
}

export default function ConsentCards({ data, onView }: ConsentCardsProps) {
  return (
    <div className="grid gap-4">
      {data.consents.map((consent) => (
        <Card key={consent.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  {consent.type === "consent" ? "Consent" : "Subscription"}
                </CardTitle>
                <Badge variant="outline" className="mt-1">
                  {consent.status}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(consent.id, consent.type)}
              >
                <Eye className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Requester</p>
                <p className="text-sm font-medium">{consent.requester}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Purpose</p>
                <p className="text-sm">{consent.purpose}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-sm">{consent.fromDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-sm">{consent.toDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
