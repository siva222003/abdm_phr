import { useQuery } from "@tanstack/react-query";
import {
  EyeIcon,
  ImageIcon,
  PresentationIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import { EllipsisIcon } from "lucide-react";
import { ArrowDownIcon } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import routes from "@/api/";
import { UploadedRecord } from "@/types/dashboard";
import dayjs from "@/utils/dayjs";
import { query } from "@/utils/request/request";

const UploadedRecords = () => {
  const { user } = useAuthContext();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const [qParams, setQParams] = useState({
    name: "",
    limit: 15,
    page: 1,
    file: "all",
  });

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ["uploadedRecords", qParams],
    queryFn: query.debounced(routes.dashboard.listUploadedRecords, {
      queryParams: {
        file_type: "patient",
        associating_id: user?.abhaAddress || "",
        name: qParams.name,
        limit: qParams.limit,
        offset: ((qParams.page || 1) - 1) * qParams.limit,
        ...(qParams.file !== "all" && {
          file_category: qParams.file,
        }),
        ordering: "-modified_date",
      },
    }),
  });

  const fileUpload = useFileUpload({
    type: "patient",
    multiple: true,
    allowedExtensions: BACKEND_ALLOWED_EXTENSIONS,
    uploadedFiles: files?.results || [],
  });

  useEffect(() => {
    if (fileUpload.files.length > 0 && fileUpload.files[0] !== undefined) {
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

  const getFileType = (file: UploadedRecord) => {
    return fileUpload.getFileType(file);
  };

  const icons: Record<
    keyof typeof FILE_EXTENSIONS | "UNKNOWN",
    React.ReactNode
  > = {
    IMAGE: <ImageIcon />,
    PRESENTATION: <PresentationIcon />,
    UNKNOWN: <FileIcon />,
    DOCUMENT: <FileIcon />,
  };

  const DetailButtons = ({ file }: { file: UploadedRecord }) => {
    return (
      <>
        <div className="flex flex-row gap-2 justify-end">
          {fileUpload.isPreviewable(file) && (
            <Button
              variant="secondary"
              onClick={() => fileUpload.viewFile(file)}
            >
              <span className="flex flex-row items-center gap-1">
                <EyeIcon />
                View
              </span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="text-primary-900">
                <Button
                  size="sm"
                  onClick={() => fileUpload.downloadFile(file)}
                  variant="ghost"
                  className="w-full flex flex-row justify-stretch items-center"
                >
                  <ArrowDownIcon className="mr-1" />
                  <span>Download</span>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-primary-900">
                <Button
                  size="sm"
                  onClick={() => fileUpload.editFile(file)}
                  variant="ghost"
                  className="w-full flex flex-row justify-stretch items-center"
                >
                  <PencilIcon className="mr-1" />
                  <span>Rename</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  };

  const RenderCard = () => (
    <div className="xl:hidden space-y-4 px-2">
      {files?.results && files?.results?.length > 0
        ? files.results.map((file) => {
            const filetype = getFileType(file);
            const fileName = file.name ? file.name + file.extension : "";

            return (
              <Card key={file.id} className="overflow-hidden  bg-white">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-full bg-gray-100 shrink-0">
                      {icons[filetype]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {fileName}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {filetype}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Date</div>
                      <div className="font-medium">
                        {dayjs(file.created_date).format(
                          "DD MMM YYYY, hh:mm A",
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        : !filesLoading && (
            <div className="text-center py-4 text-gray-500">No files found</div>
          )}
    </div>
  );

  const RenderTable = () => (
    <div className="hidden xl:block -mt-2">
      <Table className="border-separate border-spacing-y-3 mx-2 lg:max-w-[calc(100%-16px)]">
        <TableHeader>
          <TableRow className="shadow rounded overflow-hidden">
            <TableHead className="w-[20%] bg-white rounded-l">
              File Name
            </TableHead>
            <TableHead className="w-[20%] rounded-y bg-white">
              File Type
            </TableHead>
            <TableHead className="w-[25%] rounded-y bg-white">Date</TableHead>
            <TableHead className="w-[15%] text-right rounded-r bg-white"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files?.results && files?.results?.length > 0
            ? files.results.map((file) => {
                const filetype = getFileType(file);
                const fileName = file.name ? file.name + file.extension : "";

                return (
                  <TableRow
                    key={file.id}
                    className="shadow rounded-md overflow-hidden group"
                  >
                    <TableCell className="font-medium rounded-l-md rounded-y-md group-hover:bg-transparent bg-white">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-full bg-gray-100 shrink-0">
                          {icons[filetype]}
                        </span>
                        {file.name && file.name.length > 20 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-gray-900 truncate block">
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
                    <TableCell className="rounded-y-md group-hover:bg-transparent bg-white">
                      {filetype}
                    </TableCell>
                    <TableCell className="rounded-y-md group-hover:bg-transparent bg-white">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            {dayjs(file.created_date).format("DD MMM YYYY ")}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="text-white">
                          {dayjs(file.created_date).format(
                            "DD MMM YYYY, hh:mm A",
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right rounded-r-md rounded-y-md group-hover:bg-transparent bg-white">
                      <DetailButtons file={file} />
                    </TableCell>
                  </TableRow>
                );
              })
            : !filesLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No files found
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="z-40">{fileUpload.Dialogs}</div>
      <FileUploadDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        fileUpload={fileUpload}
      />
      <div className="flex flex-wrap items-center gap-2 -mt-2 ">
        <div className="relative flex-1 min-w-72 max-w-96 ml-2">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="search-by-filename"
            name="name"
            placeholder="Search files"
            value={qParams.name || ""}
            onChange={(e) => setQParams({ ...qParams, name: e.target.value })}
            className="pointer-events-auto pl-10 bg-white focus-visible:ring-[1px]"
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="ml-auto">
          <Label
            htmlFor="file_upload"
            className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-primary-600 px-4 py-2.5 text-white font-medium shadow hover:bg-primary-700 transition"
          >
            <UploadIcon className="size-4" />
            <span>Upload File</span>
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
      <RenderTable />
      <RenderCard />

      <div className="flex">
        {filesLoading ? (
          <GlobalLoader />
        ) : // <Pagination totalCount={files?.count || 0} />
        null}
      </div>
    </div>
  );
};

export default UploadedRecords;
