import { useEffect, useState } from "react";

import Page from "@/components/common/Page";
import NotificationsTable from "@/components/notifications/NotificationsTable";

import {
  CardGridSkeleton,
  TableSkeleton,
} from "@/common/loaders/SkeletonLoader";

export default function Notifications() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Page title="Notifications" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your notifications
          </p>
        </div>

        {isLoading && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:hidden mt-6">
              <CardGridSkeleton count={4} />
            </div>
            <div className="hidden md:block">
              <TableSkeleton count={5} />
            </div>
          </>
        )}

        {!isLoading && (
          <div className="mt-6">
            <NotificationsTable />
          </div>
        )}
      </div>
    </Page>
  );
}
