import { EyeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import {
  CONSENT_STATUS_COLORS,
  CONSENT_TYPE_COLORS,
  ConsentBase,
} from "@/types/consent";
import { formatDateTime } from "@/utils";

interface ConsentTableProps {
  data: { consents: ConsentBase[] };
  onView: (id: string, type: "consent" | "subscription") => void;
}

export default function ConsentTable({ data, onView }: ConsentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request Type</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>From Date</TableHead>
          <TableHead>To Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.consents.map((consent) => (
          <TableRow key={consent.id}>
            <TableCell>
              <Badge variant={CONSENT_TYPE_COLORS[consent.type]}>
                {consent.type}
              </Badge>
            </TableCell>
            <TableCell>{consent.requester}</TableCell>
            <TableCell>{consent.purpose}</TableCell>
            <TableCell>
              <Badge
                variant={
                  CONSENT_STATUS_COLORS[
                    consent.status as keyof typeof CONSENT_STATUS_COLORS
                  ]
                }
              >
                {consent.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDateTime(consent.fromDate)}</TableCell>
            <TableCell>{formatDateTime(consent.toDate)}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => onView(consent.id, consent.type)}
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
