import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

const data = [
  {
    title: "Coronasafe Care 02",
    description: "A new record is now available for you to view",
    date: "17 Aug 2025, 10:00 AM",
  },
  {
    title: "Coronasafe Care 02",
    description: "A new record is now available for you to view",
    date: "17 Aug 2025, 10:00 AM",
  },
  {
    title: "eGov Care Facility 001",
    description: "A new record is now available for you to view",
    date: "17 Aug 2025, 10:00 AM",
  },
  {
    title: "Coronasafe Care 02",
    description: "A new record is now available for you to view",
    date: "17 Aug 2025, 10:00 AM",
  },
  {
    title: "eGov Care Facility 001",
    description: "A new record is now available for you to view",
    date: "17 Aug 2025, 10:00 AM",
  },
];

function ConsentTableRow({ item }: { item: any }) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{item.title}</TableCell>
      <TableCell>
        <div className="">
          <p className="truncate" title={item.description}>
            {item.description}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground font-mono">{item.date}</p>
      </TableCell>
    </TableRow>
  );
}

function NotificationsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          {/* <TableHead>Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <ConsentTableRow key={index} item={item} />
        ))}
      </TableBody>
    </Table>
  );
}

export default NotificationsTable;
