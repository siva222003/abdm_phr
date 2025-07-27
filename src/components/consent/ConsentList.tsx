import { Eye } from "lucide-react";
import { navigate } from "raviger";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import { ConsentBase, ConsentTypes, isSubscription } from "@/types/consent";
import {
  CONSENT_STATUS_VARIANTS,
  CONSENT_TYPE_VARIANTS,
} from "@/types/consent";
import { formatReadableDateTime, toTitleCase } from "@/utils";

interface ConsentListProps {
  data: ConsentBase[];
}

interface ConsentItemProps {
  consent: ConsentBase;
}

const handleConsentNavigation = (consent: ConsentBase) => {
  navigate(`/consents/${consent.id}/${consent.type}`);
};

const getConsentTypeDisplay = (type: ConsentTypes) => {
  return isSubscription(type) ? "Subscription" : "Consent";
};

function ConsentCard({ consent }: ConsentItemProps) {
  return (
    <Card key={consent.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={CONSENT_TYPE_VARIANTS[consent.type]}
                className="text-xs"
              >
                {getConsentTypeDisplay(consent.type)}
              </Badge>
              <Badge
                variant={CONSENT_STATUS_VARIANTS[consent.status]}
                className="text-xs"
              >
                {toTitleCase(consent.status)}
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium">
              {consent.requester}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConsentNavigation(consent)}
            className="shrink-0"
          >
            <Eye className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Purpose</p>
            <p className="text-sm font-medium">{consent.purpose.text}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm">
                {formatReadableDateTime(consent.fromDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">To</p>
              <p className="text-sm">
                {formatReadableDateTime(consent.toDate)}
              </p>
            </div>
          </div>
          {consent.hiTypes.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Health Info Types</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {consent.hiTypes.slice(0, 3).map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
                {consent.hiTypes.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{consent.hiTypes.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ConsentCardList({ data }: ConsentListProps) {
  return (
    <div className="grid gap-4">
      {data.map((consent) => (
        <ConsentCard key={consent.id} consent={consent} />
      ))}
    </div>
  );
}

function ConsentTableRow({ consent }: ConsentItemProps) {
  return (
    <TableRow key={consent.id} className="hover:bg-muted/50">
      <TableCell className="font-medium">{consent.requester}</TableCell>
      <TableCell>
        <div className="max-w-[200px]">
          <p className="truncate" title={consent.purpose.text}>
            {consent.purpose.text}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={CONSENT_TYPE_VARIANTS[consent.type]}>
          {getConsentTypeDisplay(consent.type)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={CONSENT_STATUS_VARIANTS[consent.status]}>
          {toTitleCase(consent.status)}
        </Badge>
      </TableCell>
      <TableCell>{formatReadableDateTime(consent.fromDate)}</TableCell>
      <TableCell>{formatReadableDateTime(consent.toDate)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {consent.hiTypes.length > 0 && (
            <div className="flex items-center gap-1">
              {consent.hiTypes.slice(0, 2).map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
              {consent.hiTypes.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{consent.hiTypes.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleConsentNavigation(consent)}
        >
          <Eye className="size-4 mr-2" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

function ConsentTable({ data }: ConsentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requester</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>From Date</TableHead>
          <TableHead>To Date</TableHead>
          <TableHead>Health Info Types</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((consent) => (
          <ConsentTableRow key={consent.id} consent={consent} />
        ))}
      </TableBody>
    </Table>
  );
}

export default function ConsentList({ data }: ConsentListProps) {
  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <ConsentCardList data={data} />
      </div>
      <div className="hidden md:block">
        <ConsentTable data={data} />
      </div>
    </div>
  );
}
