import { Eye } from "lucide-react";
import { navigate } from "raviger";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import { ConsentBase, isSubscription } from "@/types/consent";
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

function ConsentCard({ consent }: ConsentItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-base mb-2">{consent.requester}</h3>
            <div className="flex gap-2">
              <Badge
                variant={CONSENT_TYPE_VARIANTS[consent.type]}
                className="text-xs"
              >
                {isSubscription(consent.type) ? "Subscription" : "Consent"}
              </Badge>
              <Badge
                variant={CONSENT_STATUS_VARIANTS[consent.status]}
                className="text-xs"
              >
                {toTitleCase(consent.status)}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
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
            <p className="text-xs text-muted-foreground mb-1">Purpose</p>
            <p className="text-sm leading-relaxed">{consent.purpose.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm font-medium">
                {formatReadableDateTime(consent.fromDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">To</p>
              <p className="text-sm font-medium">
                {formatReadableDateTime(consent.toDate)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsentCardList({ data }: ConsentListProps) {
  return (
    <div className="space-y-4">
      {data.map((consent) => (
        <ConsentCard key={consent.id} consent={consent} />
      ))}
    </div>
  );
}

function ConsentTableRow({ consent }: ConsentItemProps) {
  return (
    <TableRow className="hover:bg-muted/50">
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
          {isSubscription(consent.type) ? "Subscription" : "Consent"}
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
          <TableHead>Actions</TableHead>
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
