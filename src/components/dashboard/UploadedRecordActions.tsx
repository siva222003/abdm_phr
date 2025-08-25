import { DownloadIcon, EllipsisIcon, EyeIcon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FileUploadReturn } from "@/hooks/useFileUpload";

import { UploadedRecord } from "@/types/dashboard";

interface UploadedRecordActionsProps {
  file: UploadedRecord;
  fileUpload: FileUploadReturn;
}

const UploadedRecordActions = ({
  file,
  fileUpload,
}: UploadedRecordActionsProps) => (
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
            <DownloadIcon className="mr-1 size-4" />
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
            <PencilIcon className="mr-1 size-3" />
            <span>Rename</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default UploadedRecordActions;
