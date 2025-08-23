import { useQuery } from "@tanstack/react-query";
import {
  EyeIcon,
  FolderOpen,
  ImageIcon,
  PaperclipIcon,
  PresentationIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import {
  ArrowDownIcon,
  EllipsisIcon,
  FileIcon,
  PencilIcon,
} from "lucide-react";
import { useQueryParams } from "raviger";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import FileUploadDialog from "@/components/dashboard/dialogs/FileUploadDialog";

import { useAuthContext } from "@/hooks/useAuth";
import useFileUpload from "@/hooks/useFileUpload";

import {
  BACKEND_ALLOWED_EXTENSIONS,
  FILE_EXTENSIONS,
} from "@/common/constants";
import GlobalLoader from "@/common/loaders/GlobalLoader";
import {
  CardGridSkeleton,
  CardListSkeleton,
} from "@/common/loaders/SkeletonLoader";

import routes from "@/api/";
import { UploadedRecord } from "@/types/dashboard";
import dayjs from "@/utils/dayjs";
import { query } from "@/utils/request/request";

interface UploadedRecordsQueryParams {
  name: string;
  limit: number;
  page: number;
}

const DEFAULT_QUERY_PARAMS: UploadedRecordsQueryParams = {
  name: "",
  limit: 10,
  page: 1,
};

const normalizeQueryParams = (
  qParams: Partial<UploadedRecordsQueryParams>,
): UploadedRecordsQueryParams => ({
  name: qParams.name || DEFAULT_QUERY_PARAMS.name,
  limit: qParams.limit || DEFAULT_QUERY_PARAMS.limit,
  page: qParams.page || DEFAULT_QUERY_PARAMS.page,
});

const UploadedRecords = () => {
  const { user } = useAuthContext();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [qParams, setQParams] = useQueryParams<UploadedRecordsQueryParams>();

  const normalizedParams = useMemo(
    () => normalizeQueryParams(qParams),
    [qParams],
  );

  const [searchValue, setSearchValue] = useState(normalizedParams.name);

  useEffect(() => {
    setSearchValue(normalizedParams.name);
  }, [normalizedParams.name]);

  const {
    data: files,
    isLoading: filesLoading,
    error,
  } = useQuery({
    queryKey: ["uploadedRecords", normalizedParams],
    queryFn: query.debounced(routes.dashboard.listUploadedRecords, {
      queryParams: {
        file_type: "patient",
        associating_id: user?.abhaAddress || "",
        name: normalizedParams.name,
        limit: normalizedParams.limit,
        offset: ((normalizedParams.page || 1) - 1) * normalizedParams.limit,
        ordering: "-modified_date",
      },
    }),
  });

  const fileUpload = useFileUpload({
    type: "patient",
    multiple: true,
    allowedExtensions: BACKEND_ALLOWED_EXTENSIONS,
    uploadedFiles: files?.results?.slice().reverse() || [],
  });

  useEffect(() => {
    if (fileUpload.files.length > 0) {
      setOpenUploadDialog(true);
    } else {
      setOpenUploadDialog(false);
    }
  }, [fileUpload.files]);

  useEffect(() => {
    if (!openUploadDialog) {
      fileUpload.clearFiles();
    }
  }, [openUploadDialog]);

  const icons: Record<
    keyof typeof FILE_EXTENSIONS | "UNKNOWN",
    React.ElementType
  > = useMemo(
    () => ({
      IMAGE: ImageIcon,
      PRESENTATION: PresentationIcon,
      UNKNOWN: FileIcon,
      DOCUMENT: PaperclipIcon,
    }),
    [],
  );

  const getFileType = useCallback(
    (file: UploadedRecord) => {
      return fileUpload.getFileType(file);
    },
    [fileUpload],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      setQParams({
        ...normalizedParams,
        name: value,
        page: 1,
      });
    },
    [normalizedParams, setQParams],
  );

  const isEmpty =
    !filesLoading && (!files?.results || files.results.length === 0);
  const isError = !!error;

  const DetailButtons = ({ file }: { file: UploadedRecord }) => (
    <div className="flex flex-row gap-2 justify-end">
      {fileUpload.isPreviewable(file) && (
        <Button
          variant="secondary"
          onClick={() => fileUpload.viewFile(file)}
          size="sm"
        >
          <span className="flex flex-row items-center gap-1">
            <EyeIcon className="size-4" />
            <span className="hidden sm:inline">View</span>
          </span>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <EllipsisIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild className="text-primary-900">
            <Button
              size="sm"
              onClick={() => fileUpload.downloadFile(file)}
              variant="ghost"
              className="w-full flex flex-row justify-start items-center"
            >
              <ArrowDownIcon className="mr-2 size-4" />
              <span>Download</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-primary-900">
            <Button
              size="sm"
              onClick={() => fileUpload.editFile(file)}
              variant="ghost"
              className="w-full flex flex-row justify-start items-center"
            >
              <PencilIcon className="mr-2 size-4" />
              <span>Rename</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const RenderCard = () => (
    <div className="xl:hidden space-y-4 px-2">
      {files?.results && files.results.length > 0
        ? files.results.map((file) => {
            const filetype = getFileType(file);
            const fileName = file.name ? file.name + file.extension : "";
            const Icon = icons[filetype];

            return (
              <Card
                key={file.id}
                className="overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-full bg-gray-100 shrink-0">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-medium text-gray-900 truncate cursor-help">
                            {fileName}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="text-white">
                          <p>{fileName}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="mt-1 text-sm text-gray-500">
                        {filetype}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Created</div>
                      <div className="font-medium">
                        {dayjs(file.created_date).format(
                          "DD MMM YYYY, hh:mm A",
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <DetailButtons file={file} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        : null}
    </div>
  );

  const RenderTable = () => (
    <div className="hidden xl:block -mt-2">
      <Table className="border-separate border-spacing-y-3 mx-2 xl:max-w-[calc(100%-16px)]">
        <TableHeader>
          <TableRow className="shadow rounded overflow-hidden">
            <TableHead className="w-[40%] bg-white rounded-l">
              File Name
            </TableHead>
            <TableHead className="w-[20%] rounded-y bg-white">
              File Type
            </TableHead>
            <TableHead className="w-[25%] rounded-y bg-white">Date</TableHead>
            <TableHead className="w-[15%] text-center rounded-r bg-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files?.results && files.results.length > 0
            ? files.results.map((file) => {
                const filetype = getFileType(file);
                const fileName = file.name ? file.name + file.extension : "";
                const Icon = icons[filetype];

                return (
                  <TableRow
                    key={file.id}
                    className="shadow rounded-md overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <TableCell className="font-medium rounded-l-md group-hover:bg-gray-50 bg-white">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-full bg-gray-100 shrink-0">
                          <Icon className="size-4" />
                        </span>
                        {file.name && file.name.length > 25 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-gray-900 truncate block cursor-help">
                                {fileName}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="text-white">
                              {fileName}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-gray-900 truncate block">
                            {fileName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="group-hover:bg-gray-50 bg-white">
                      {filetype}
                    </TableCell>
                    <TableCell className="group-hover:bg-gray-50 bg-white">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {dayjs(file.created_date).format(
                              "DD MMM YYYY, hh:mm A",
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="text-white">
                          {dayjs(file.created_date).format(
                            "DD MMM YYYY, hh:mm A",
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right rounded-r-md group-hover:bg-gray-50 bg-white">
                      <DetailButtons file={file} />
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      {fileUpload.Dialogs}
      <FileUploadDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        fileUpload={fileUpload}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-72 sm:max-w-96 ml-2">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="search-by-filename"
            name="name"
            placeholder="Search files..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pointer-events-auto pl-10 bg-white"
          />
        </div>

        <div className="ml-auto">
          <Label
            htmlFor="file_upload"
            className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-primary-600 px-4 py-2.5 text-white font-medium shadow hover:bg-primary-700 transition"
          >
            <UploadIcon className="size-4" />
            <span>Upload Files</span>
          </Label>
          <input
            id="file_upload"
            title="Upload File"
            onChange={fileUpload.onFileChange}
            type="file"
            multiple={true}
            accept={BACKEND_ALLOWED_EXTENSIONS.map((e) => "." + e).join(",")}
            hidden={true}
          />
        </div>
      </div>

      {filesLoading && (
        <>
          <div className="space-y-4 xl:hidden">
            <CardGridSkeleton count={4} />
          </div>
          <div className="space-y-4 xl:block">
            <CardListSkeleton count={4} />
          </div>
        </>
      )}

      {(isEmpty || isError) && !filesLoading && (
        <EmptyState
          icon={FolderOpen}
          title={isError ? "Failed to load files" : "No files found"}
          description={
            isError
              ? "Please try again or contact support if the problem persists"
              : normalizedParams.name
                ? "Try adjusting your search criteria"
                : "Upload your first file to get started"
          }
        />
      )}

      {files?.results && files.results.length > 0 && !filesLoading && (
        <>
          <RenderTable />
          <RenderCard />
        </>
      )}

      <div className="flex">
        {filesLoading ? (
          <GlobalLoader />
        ) : // Pagination will be added here later
        null}
      </div>
    </div>
  );
};

export default UploadedRecords;
