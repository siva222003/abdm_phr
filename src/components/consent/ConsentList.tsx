import { Eye, EyeIcon } from "lucide-react";
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

import { ConsentBase, isSubscription } from "@/types/consent";
import { CONSENT_STATUS_VARIANTS } from "@/types/consent";
import { CONSENT_TYPE_VARIANTS } from "@/types/consent";
import { formatReadableDateTime, toTitleCase } from "@/utils";

interface ConsentListProps {
  data: ConsentBase[];
}

function ConsentCard({ data }: ConsentListProps) {
  return (
    <div className="grid gap-4">
      {data.map((consent) => (
        <Card key={consent.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  {consent.type}
                </CardTitle>
                <Badge variant="outline" className="mt-1">
                  {consent.status}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/consents/${consent.id}/${consent.type}`)
                }
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

function ConsentTable({ data }: ConsentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requester</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Request Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>From Date</TableHead>
          <TableHead>To Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((consent) => (
          <TableRow key={consent.id}>
            <TableCell>{consent.requester}</TableCell>
            <TableCell>{consent.purpose}</TableCell>
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
                onClick={() =>
                  navigate(`/consents/${consent.id}/${consent.type}`)
                }
              >
                <EyeIcon />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ConsentList({ data }: ConsentListProps) {
  return (
    <>
      <div className="md:hidden">
        <ConsentCard data={data} />
      </div>
      <div className="hidden md:block">
        <ConsentTable data={data} />
      </div>
    </>
  );
}
