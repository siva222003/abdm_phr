import { Eye } from "lucide-react";
import { Link, navigate } from "raviger";

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

export function ConsentCard({ consent }: ConsentItemProps) {
  return (
    <Link href={`/consents/${consent.id}/${consent.type}`} className="block">
      <Card className="group relative rounded-md border border-gray-200 bg-white hover:shadow-md transition-all p-4 flex flex-col gap-4">
        <CardHeader className="p-0 gap-0.5">
          <h3 className="text-base font-semibold text-gray-900">
            {consent.requester}
          </h3>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Badge variant={CONSENT_TYPE_VARIANTS[consent.type]}>
              {isSubscription(consent.type) ? "Subscription" : "Consent"}
            </Badge>
            <Badge variant={CONSENT_STATUS_VARIANTS[consent.status]}>
              {toTitleCase(consent.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">Purpose</p>
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {consent.purpose.text}
          </p>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500 border-t pt-3">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">From</span>
              <span className="font-medium text-gray-900">
                {formatReadableDateTime(consent.fromDate)}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-muted-foreground text-sm">To</span>
              <span className="font-medium text-gray-900">
                {formatReadableDateTime(consent.toDate)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
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
          onClick={() => navigate(`/consents/${consent.id}/${consent.type}`)}
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
