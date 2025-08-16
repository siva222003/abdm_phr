import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Page from "@/components/common/Page";

import LinkedRecords from "./LinkedRecords";
import UploadedRecords from "./UploadedRecords";

interface DashboardProps {
  tab: string;
}

const Dashboard = ({ tab = "linked" }: DashboardProps) => {
  return (
    <Page title="My Records" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <div className="space-y-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">
              My Records
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage your health records
            </p>
          </div>
          <Tabs value={tab} className="w-full">
            <TabsList className="w-full justify-evenly sm:justify-start border-b rounded-none bg-transparent p-0 h-auto overflow-x-auto">
              <TabsTrigger
                className="border-b-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900 data-[state=active]:border-b-primary-700  data-[state=active]:text-primary-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
                value="linked"
              >
                Linked
              </TabsTrigger>
              <TabsTrigger
                className="border-b-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900 data-[state=active]:border-b-primary-700  data-[state=active]:text-primary-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
                value="uploaded"
              >
                Uploaded
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="linked" className="mt-0">
                <LinkedRecords />
              </TabsContent>

              <TabsContent value="uploaded" className="mt-0">
                <UploadedRecords />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
