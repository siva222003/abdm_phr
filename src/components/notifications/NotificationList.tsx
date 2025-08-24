import {
  Check,
  EllipsisIcon,
  MailIcon,
  MailOpenIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import { navigate } from "raviger";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import { Notification } from "@/types/notification";
import { SubscriptionCategories } from "@/types/subscription";
import { toTitleCase } from "@/utils";
import dayjs from "@/utils/dayjs";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const getCategoryVariant = (category: SubscriptionCategories) =>
  category === SubscriptionCategories.LINK ? "primary" : "indigo";

const onView = (id: string) => {
  navigate(`/linked-facilities/${id}`);
};

const StatusIcon = ({ isRead }: { isRead: boolean }) => (
  <div
    className={cn(
      "rounded-full shrink-0 border size-9 flex items-center justify-center",
      isRead
        ? "bg-gray-50 border-gray-200"
        : "bg-primary-50 border-primary-200",
    )}
  >
    {isRead ? (
      <MailOpenIcon className="size-4 text-gray-500 mb-0.5" />
    ) : (
      <MailIcon className="size-4 text-primary-600" />
    )}
  </div>
);

const RenderCard = ({ notifications, onMarkAsRead }: NotificationListProps) => (
  <div className="md:hidden space-y-3">
    {notifications.map((notif) => {
      const category = getCategoryVariant(notif.category);

      return (
        <Card
          key={notif.event_id}
          className={cn(
            "transition-all rounded-lg",
            notif.is_read
              ? "bg-white border-gray-200"
              : "bg-primary-50 border-primary-200",
          )}
        >
          <CardContent className="space-y-3 max-xsm:px-4">
            <div className="flex items-center gap-2 min-w-0">
              <StatusIcon isRead={notif.is_read} />
              <div className="flex justify-between items-center gap-x-2 gap-y-[2px] flex-wrap w-full">
                <h3
                  className={cn(
                    "text-base font-semibold",
                    notif.is_read ? "text-gray-800" : "text-gray-900",
                  )}
                >
                  {notif.title}
                </h3>
                <span className="text-xs text-gray-500 shrink-0">
                  {dayjs(notif.published_at).format("DD MMM YYYY, hh:mm A")}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {notif.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <Badge variant={category}>{toTitleCase(notif.category)}</Badge>

              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(notif.hip_id)}
                  className="flex items-center gap-1 rounded-full px-2 text-primary-600 hover:text-primary-700"
                >
                  <SquareArrowOutUpRight className="size-3.5" />
                  <span className="text-xs">View</span>
                </Button>

                {!notif.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notif.id)}
                    className="flex items-center gap-1 rounded-full px-2 text-muted-foreground hover:text-primary-600"
                  >
                    <Check className="size-3.5" />
                    <span className="text-xs">Mark</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

const RenderTable = ({
  notifications,
  onMarkAsRead,
}: NotificationListProps) => (
  <div className="hidden md:block">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[5%]">Status</TableHead>
          <TableHead className="w-[25%]">Title</TableHead>
          <TableHead className="w-[35%]">Description</TableHead>
          <TableHead className="w-[15%]">Category</TableHead>
          <TableHead className="w-[15%]">Date</TableHead>
          <TableHead className="w-[10%] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notifications.map((notif) => {
          const category = getCategoryVariant(notif.category);

          return (
            <TableRow key={notif.event_id}>
              <TableCell>
                <div className="flex justify-center">
                  <StatusIcon isRead={notif.is_read} />
                </div>
              </TableCell>
              <TableCell className="font-medium truncate">
                {notif.title}
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="truncate cursor-help">{notif.description}</p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md text-white">
                    <p>{notif.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Badge variant={category}>{toTitleCase(notif.category)}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {dayjs(notif.published_at).format("DD MMM YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <EllipsisIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(notif.hip_id)}
                      >
                        <SquareArrowOutUpRight className="mr-1 size-4" />
                        View
                      </DropdownMenuItem>
                      {!notif.is_read && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onMarkAsRead(notif.id)}
                        >
                          <Check className="mr-1 size-4" />
                          Mark as read
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

const NotificationList = (props: NotificationListProps) => (
  <div className="space-y-6">
    <RenderTable {...props} />
    <RenderCard {...props} />
  </div>
);

export default NotificationList;
