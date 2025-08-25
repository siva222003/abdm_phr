import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CONSENT_STATUS_BY_CATEGORY,
  ConsentCategories,
  ConsentStatuses,
} from "@/types/consent";
import { toTitleCase } from "@/utils";

interface ConsentFiltersProps {
  category: ConsentCategories;
  status: ConsentStatuses;
  onCategoryChange: (category: ConsentCategories) => void;
  onStatusChange: (status: ConsentStatuses) => void;
}

export function ConsentFilters({
  category,
  status,
  onCategoryChange,
  onStatusChange,
}: ConsentFiltersProps) {
  return (
    <div className="mb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Consents</h1>
        <p className="text-gray-600 text-sm">View and manage your consents</p>
      </div>

      <div className="flex flex-col gap-4 my-2">
        <Tabs
          value={category ?? ConsentCategories.REQUESTS}
          onValueChange={(value) =>
            onCategoryChange(value as ConsentCategories)
          }
        >
          <TabsList className="w-full justify-evenly sm:justify-start border-b rounded-none bg-transparent p-0 h-auto overflow-x-auto">
            <TabsTrigger
              className="border-b-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900
               data-[state=active]:border-b-primary-700
               data-[state=active]:text-primary-800
               data-[state=active]:bg-transparent
               data-[state=active]:shadow-none
               rounded-none sm:max-w-[150px] truncate"
              value={ConsentCategories.REQUESTS}
            >
              Requests
            </TabsTrigger>
            <TabsTrigger
              className="border-b-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900
               data-[state=active]:border-b-primary-700
               data-[state=active]:text-primary-800
               data-[state=active]:bg-transparent
               data-[state=active]:shadow-none
               rounded-none sm:max-w-[150px] truncate"
              value={ConsentCategories.APPROVED}
            >
              Approved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={status ?? ConsentStatuses.REQUESTED}
          onValueChange={(value) => onStatusChange(value as ConsentStatuses)}
          className="sm:max-w-xs"
        >
          <TabsList className="flex w-full flex-1 gap-4 overflow-x-auto">
            {CONSENT_STATUS_BY_CATEGORY[
              category ?? ConsentCategories.REQUESTS
            ].map((statusOption) => (
              <TabsTrigger key={statusOption} value={statusOption}>
                {toTitleCase(statusOption)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
