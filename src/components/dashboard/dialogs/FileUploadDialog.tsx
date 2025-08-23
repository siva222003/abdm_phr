import {
  AlertCircleIcon,
  CheckIcon,
  FileIcon,
  ImageIcon,
  PaperclipIcon,
  PresentationIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FileUploadReturn } from "@/hooks/useFileUpload";

import { FILE_EXTENSIONS } from "@/common/constants";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUpload: FileUploadReturn;
}

interface FilePreview {
  file: File;
  previewUrl: string | null;
  error: string | null;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const icons: Record<
  keyof typeof FILE_EXTENSIONS | "UNKNOWN",
  React.ElementType
> = {
  IMAGE: ImageIcon,
  PRESENTATION: PresentationIcon,
  UNKNOWN: FileIcon,
  DOCUMENT: PaperclipIcon,
};

const getFileTypeFromFile = (
  file: File,
): keyof typeof FILE_EXTENSIONS | "UNKNOWN" => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return "UNKNOWN";

  const fileType = (
    Object.keys(FILE_EXTENSIONS) as (keyof typeof FILE_EXTENSIONS)[]
  ).find((type) => FILE_EXTENSIONS[type].includes(extension as never));

  return fileType || "UNKNOWN";
};

const validateFileName = (name: string): string | null => {
  const trimmed = name.trim();
  if (!trimmed) return "File name is required";
  if (trimmed.length > 255) return "File name too long (max 255 characters)";
  return null;
};

export default function FileUploadDialog({
  open,
  onOpenChange,
  fileUpload,
}: FileUploadDialogProps) {
  const [isPdf, setIsPdf] = useState(false);
  const [individualErrors, setIndividualErrors] = useState<
    Record<number, string>
  >({});

  const filePreviews = useMemo(() => {
    return fileUpload.files.map((file): FilePreview => {
      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

      return {
        file,
        previewUrl,
        error: null,
      };
    });
  }, [fileUpload.files]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(({ previewUrl }) => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, [filePreviews]);

  const handleDialogClose = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsPdf(false);
        setIndividualErrors({});
        fileUpload.setError(null);
      }
      onOpenChange(open);
    },
    [onOpenChange, fileUpload],
  );

  const handleFileNameChange = useCallback(
    (value: string, index: number) => {
      fileUpload.setFileName(value, index);

      if (fileUpload.error) {
        fileUpload.setError(null);
      }

      const error = validateFileName(value);
      setIndividualErrors((prev) => {
        const newErrors = { ...prev };

        if (error) {
          newErrors[index] = error;
        } else {
          delete newErrors[index];
        }

        return newErrors;
      });
    },
    [fileUpload],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      fileUpload.removeFile(index);
      setIndividualErrors((prev) => {
        const { [index]: _, ...rest } = prev;
        return rest;
      });
    },
    [fileUpload],
  );

  const handleUpload = useCallback(async () => {
    const errors: Record<number, string> = {};
    fileUpload.fileNames.forEach((name, index) => {
      const error = validateFileName(name);
      if (error) {
        errors[index] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setIndividualErrors(errors);
      fileUpload.setError("Please fix the file name errors above");
      return;
    }

    setIndividualErrors({});
    await fileUpload.handleFileUpload(isPdf);
  }, [fileUpload, isPdf]);

  const canUpload =
    fileUpload.files.length > 0 &&
    !fileUpload.uploading &&
    !Object.values(individualErrors).some((error) => error && error.trim()) &&
    fileUpload.fileNames.every((name) => name.trim().length > 0);

  const totalSize = useMemo(() => {
    return fileUpload.files.reduce((total, file) => total + file.size, 0);
  }, [fileUpload.files]);

  const renderFileItem = (preview: FilePreview, index: number) => {
    const { file, previewUrl } = preview;
    const fileName = fileUpload.fileNames[index] || "";
    const hasError = individualErrors[index];
    const fileType = getFileTypeFromFile(file);

    return (
      <div
        key={`${file.name}-${index}`}
        className="rounded-lg p-4 border-2 border-primary-200 hover:border-primary-300 transition-colors relative"
      >
        <div className="flex gap-4 items-start w-full">
          {previewUrl && (
            <div className="mt-2 md:mt-0 rounded-lg border border-gray-300 shadow-sm overflow-hidden bg-gray-50">
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                className="size-16 md:size-20 object-cover"
                onError={() =>
                  console.warn(`Failed to load preview for ${file.name}`)
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 rounded-md bg-secondary-100 p-3 border border-gray-200">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <PaperclipIcon className="size-4 shrink-0 text-gray-500" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {file.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{fileType}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-white">
                    <div className="text-xs flex flex-col gap-[0.5px]">
                      <span>
                        <strong>Name: </strong> {file.name}
                      </span>
                      <span>
                        <strong>Size: </strong> {formatFileSize(file.size)}
                      </span>
                      <span>
                        <strong>Type: </strong> {file.type || "Unknown"}
                      </span>
                      <span>
                        <strong>Category: </strong> {fileType}
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                disabled={fileUpload.uploading}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                aria-label={`Remove ${file.name}`}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor={`upload-file-name-${index}`}
                className="text-sm font-medium"
              >
                Display Name
              </Label>
              <Input
                name={`file_name_${index}`}
                type="text"
                id={`upload-file-name-${index}`}
                data-cy={`upload-file-name-${index}`}
                value={fileName}
                disabled={fileUpload.uploading}
                onChange={(e) => handleFileNameChange(e.target.value, index)}
                placeholder="Enter display name for this file"
                className={
                  hasError ? "border-red-500 focus:border-red-500" : ""
                }
                aria-invalid={!!hasError}
                aria-describedby={hasError ? `error-${index}` : undefined}
              />
              {hasError && (
                <p
                  id={`error-${index}`}
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircleIcon className="size-4" />
                  {hasError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPdfMode = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Files to combine:</Label>
        {filePreviews.map((preview, index) => {
          const fileType = getFileTypeFromFile(preview.file);
          const FileIconComponent = icons[fileType];

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-2 rounded-md bg-secondary-100 px-3 py-2"
            >
              <div className="flex items-center text-sm truncate">
                <FileIconComponent className="size-4 mr-2 text-gray-500 shrink-0" />
                <span className="truncate">{preview.file.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({formatFileSize(preview.file.size)} • {fileType})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                disabled={fileUpload.uploading}
                className="text-red-500 hover:text-red-700"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="space-y-1">
        <Label htmlFor="upload-file-name-0" className="text-sm font-medium">
          Combined PDF Name
        </Label>
        <Input
          name="file_name_0"
          data-cy="upload-file-name"
          type="text"
          id="upload-file-name-0"
          value={fileUpload.fileNames[0] || ""}
          disabled={fileUpload.uploading}
          onChange={(e) => handleFileNameChange(e.target.value, 0)}
          placeholder="Enter name for the combined PDF"
          className={individualErrors[0] ? "border-red-500" : ""}
        />
        {individualErrors[0] && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircleIcon className="size-4" />
            {individualErrors[0]}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon className="size-5" />
            {fileUpload.files.length > 1
              ? `Upload ${fileUpload.files.length} Files`
              : "Upload File"}
            {totalSize > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({formatFileSize(totalSize)} total)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isPdf ? (
            renderPdfMode()
          ) : (
            <div className="space-y-4">
              {filePreviews.map((preview, index) =>
                renderFileItem(preview, index),
              )}
            </div>
          )}

          {fileUpload.files.length > 1 && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Checkbox
                id="file_upload_checkbox"
                checked={isPdf}
                onCheckedChange={(checked: boolean) => setIsPdf(checked)}
                disabled={fileUpload.uploading}
                className="mt-0.5 text-white"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="file_upload_checkbox"
                  className="cursor-pointer font-medium"
                >
                  Combine Files to PDF
                </Label>
                <p className="text-xs text-gray-600">
                  Merge all selected files into a single PDF document
                </p>
              </div>
            </div>
          )}

          {fileUpload.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircleIcon className="size-4" />
                {fileUpload.error}
              </p>
            </div>
          )}
        </div>

        {fileUpload.progress !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{fileUpload.progress}%</span>
            </div>
            <Progress value={fileUpload.progress} className="h-2" />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              fileUpload.clearFiles();
              setIsPdf(false);
              setIndividualErrors({});
            }}
            disabled={fileUpload.uploading}
            className="flex items-center gap-2"
          >
            <TrashIcon className="size-4" />
            Clear All
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!canUpload}
            className="flex items-center gap-2"
          >
            <CheckIcon className="size-4" />
            {fileUpload.uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
