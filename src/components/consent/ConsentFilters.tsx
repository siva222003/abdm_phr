import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CONSENT_STATUS_BY_CATEGORY,
  ConsentCategories,
  ConsentStatuses,
} from "@/types/consent";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Consents</h1>
          <p className="text-gray-600 text-sm">View and manage your consents</p>
        </div>
      </div>

      <div className="flex items-center gap-3 my-4 max-sm:flex-col">
        <Tabs
          value={category ?? ConsentCategories.REQUESTS}
          onValueChange={(value) =>
            onCategoryChange(value as ConsentCategories)
          }
          className="max-sm:w-full w-1/2"
        >
          <TabsList className="max-sm:flex w-full">
            <TabsTrigger className="flex-1" value={ConsentCategories.REQUESTS}>
              Requests
            </TabsTrigger>
            <TabsTrigger className="flex-1" value={ConsentCategories.APPROVED}>
              Approved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={status ?? ConsentStatuses.REQUESTED}
          onValueChange={(value) => onStatusChange(value as ConsentStatuses)}
        >
          <SelectTrigger className="sm:max-w-1/5 border-gray-300">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {CONSENT_STATUS_BY_CATEGORY[category]?.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {statusOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
