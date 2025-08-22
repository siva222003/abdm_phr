import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  Loader2,
  RefreshCcwIcon,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { ReactNode, Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { UploadedRecord } from "@/types/dashboard";

const PDFViewer = lazy(() => import("@/components/dashboard/PdfViewer"));

export interface StateInterface {
  open: boolean;
  isImage: boolean;
  name: string;
  extension: string;
  isZoomInDisabled: boolean;
  isZoomOutDisabled: boolean;
  id?: string;
  associating_id?: string;
}
type FilePreviewProps = {
  title?: ReactNode;
  description?: ReactNode;
  show: boolean;
  onClose: () => void;
  file_state: StateInterface;
  downloadURL?: string;
  fileUrl: string;
  className?: string;
  titleAction?: ReactNode;
  fixedWidth?: boolean;
  uploadedFiles?: UploadedRecord[];
  loadFile?: (file: UploadedRecord, associating_id: string) => void;
  currentIndex: number;
};
const previewExtensions = [
  ".html",
  ".htm",
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
];

function getRotationClass(rotation: number) {
  const normalizedRotation = rotation % 360;
  switch (normalizedRotation) {
    case 90:
      return "rotate-90";
    case 180:
      return "rotate-180";
    case 270:
      return "-rotate-90";
    default:
      return "";
  }
}

export default function FilePreviewDialog(props: FilePreviewProps) {
  const {
    show,
    onClose,
    file_state,
    downloadURL,
    fileUrl,
    uploadedFiles,
    loadFile,
    currentIndex,
  } = props;
  const [page, setPage] = useState(1);
  const [rotation, setRotation] = useState<number>(0);
  const [numPages, setNumPages] = useState(1);
  const [index, setIndex] = useState<number>(currentIndex);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    if (uploadedFiles && show) {
      setIndex(currentIndex);
    }
  }, [uploadedFiles, show, currentIndex]);

  useEffect(() => {
    if (transformRef.current && show) {
      transformRef.current.resetTransform();
    }
  }, [index, show]);

  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn(0.5);
    }
  };

  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut(0.5);
    }
  };

  const handleRotate = (angle: number) => {
    setRotation((prev) => {
      const newRotation = (prev + angle + 360) % 360;
      return newRotation;
    });
  };

  const fileName = file_state?.name
    ? file_state.name + "." + file_state.extension
    : "";

  const fileNameTooltip =
    fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;

  const handleNext = (newIndex: number) => {
    if (
      !uploadedFiles?.length ||
      !loadFile ||
      newIndex < 0 ||
      newIndex >= uploadedFiles.length
    ) {
      return;
    }
    const nextFile = uploadedFiles[newIndex];
    if (!nextFile?.id) return;
    const associating_id = nextFile.associating_id || "";
    loadFile(nextFile, associating_id);
    setIndex(newIndex);
  };

  const handleClose = () => {
    setPage(1);
    setNumPages(1);
    setIndex(-1);
    setRotation(0);
    onClose?.();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!show) return;

      switch (event.key) {
        case "ArrowLeft":
          if (index > 0) {
            event.preventDefault();
            handleNext(index - 1);
          }
          break;
        case "ArrowRight":
          if (index < (uploadedFiles?.length || 0) - 1) {
            event.preventDefault();
            handleNext(index + 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, index, uploadedFiles?.length]);

  const handleDownload = async () => {
    if (!downloadURL) return;

    try {
      const response = await fetch(downloadURL);
      if (!response.ok) throw new Error();

      const data = await response.blob();
      const blobUrl = window.URL.createObjectURL(data);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${file_state.name}.${file_state.extension}`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch {
      toast.error("file_download_failed");
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="h-full w-full max-w-[100vw] md:max-w-[80vw] flex-col gap-4 rounded-lg p-4 shadow-xl md:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm text-gray-600">
            file_preview
          </DialogTitle>
        </DialogHeader>
        {fileUrl ? (
          <>
            <div className="mb-2 flex flex-col items-start md:justify-between md:flex-row gap-4">
              <div>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-xl font-bold text-gray-800 truncate">
                      {fileNameTooltip}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white">{fileName}</p>
                  </TooltipContent>
                </Tooltip>
                {uploadedFiles &&
                  uploadedFiles[index] &&
                  uploadedFiles[index].created_date && (
                    <p className="mt-1 text-sm text-gray-600">
                      created_on{" "}
                      {new Date(
                        uploadedFiles[index].created_date!,
                      ).toLocaleString("en-US", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
              </div>
              <div className="flex gap-2">
                {file_state.extension === "pdf" && fileUrl && (
                  <Button
                    variant="outline"
                    data-cy="file-preview-open-browser"
                    onClick={() => {
                      window.open(fileUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <ExternalLinkIcon className="size-4" />
                    <span>open_in_browser</span>
                  </Button>
                )}
                {downloadURL && downloadURL.length > 0 && (
                  <Button
                    variant="primary"
                    data-cy="file-preview-download"
                    onClick={handleDownload}
                  >
                    <DownloadIcon className="size-4" />
                    <span>download</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between gap-4">
              {uploadedFiles && uploadedFiles.length > 1 && (
                <Button
                  variant="primary"
                  onClick={() => handleNext(index - 1)}
                  disabled={index <= 0}
                  aria-label="Previous file"
                >
                  <ArrowLeftIcon className="size-4" />
                </Button>
              )}

              <div className="flex h-[50vh] md:h-[70vh] w-full items-center justify-center overflow-hidden rounded-lg border border-secondary-200">
                {file_state.isImage ? (
                  <TransformWrapper
                    ref={transformRef}
                    initialScale={1}
                    minScale={0.25}
                    maxScale={2}
                    centerOnInit
                    wheel={{ step: 0.5 }}
                    pinch={{ step: 5 }}
                    doubleClick={{ disabled: false, step: 0.7 }}
                    panning={{ velocityDisabled: true }}
                    onPanning={() => setIsPanning(true)}
                    onPanningStop={() => setIsPanning(false)}
                  >
                    <TransformComponent
                      wrapperStyle={{ width: "100%", height: "100%" }}
                      contentStyle={{ width: "100%", height: "100%" }}
                      wrapperClass={
                        isPanning ? "cursor-grabbing" : "cursor-grab"
                      }
                    >
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className={cn(
                          "h-full w-full select-none object-contain",
                          getRotationClass(rotation),
                        )}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </TransformComponent>
                  </TransformWrapper>
                ) : file_state.extension === "pdf" ? (
                  <div className="w-full h-full overflow-auto">
                    <Suspense
                      fallback={<Loader2 className="size-10 animate-spin" />}
                    >
                      <PDFViewer
                        url={fileUrl}
                        onDocumentLoadSuccess={(numPages: number) => {
                          setPage(1);
                          setNumPages(numPages);
                        }}
                        pageNumber={page}
                        scale={1}
                        className="max-md:max-w-[50vw]"
                      />
                    </Suspense>
                  </div>
                ) : previewExtensions.includes(file_state.extension) ? (
                  <iframe
                    sandbox=""
                    title="source_file"
                    src={fileUrl}
                    className="h-[50vh] md:h-[70vh] w-full"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <FileIcon className="mb-4 text-5xl text-secondary-600" />
                    file_preview_not_supported
                  </div>
                )}
              </div>
              {uploadedFiles && uploadedFiles.length > 1 && (
                <Button
                  variant="primary"
                  onClick={() => handleNext(index + 1)}
                  disabled={index >= uploadedFiles.length - 1}
                  aria-label="next_file"
                >
                  <ArrowRightIcon className="size-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-center">
              {file_state.isImage && (
                <div className="mt-2 grid grid-cols-3 md:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Zoom In",
                      icon: ZoomIn,
                      action: handleZoomIn,
                      disabled: false,
                    },
                    {
                      label: "Reset",
                      icon: RefreshCcwIcon,
                      action: () => {
                        setRotation(0);
                        transformRef.current?.resetTransform();
                      },
                      disabled: false,
                    },
                    {
                      label: "Zoom Out",
                      icon: ZoomOut,
                      action: handleZoomOut,
                      disabled: false,
                    },
                    {
                      label: "Rotate Left",
                      icon: RotateCcw,
                      action: () => handleRotate(-90),
                      disabled: false,
                    },
                    {
                      label: "Rotate Right",
                      icon: RotateCw,
                      action: () => handleRotate(90),
                      disabled: false,
                    },
                  ].map((button, index) => (
                    <Button
                      variant="ghost"
                      key={index}
                      onClick={button.action}
                      className={cn(
                        "z-50 rounded bg-white/60 px-4 py-2 text-black backdrop-blur-sm transition hover:bg-white/70",
                        index === 3 && "col-start-1 md:col-auto",
                        index === 4 && "col-start-3 md:col-auto",
                      )}
                      disabled={button.disabled}
                    >
                      {button.icon && <button.icon className="mr-2 text-lg" />}
                      {button.label}
                    </Button>
                  ))}
                </div>
              )}
              {file_state.extension === "pdf" && (
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Previous",
                      icon: ArrowLeftIcon,
                      action: () => setPage((prev) => prev - 1),
                      disabled: page === 1,
                    },
                    {
                      label: `${page}/${numPages}`,
                      icon: null,
                      action: () => {},
                      disabled: false,
                    },
                    {
                      label: "Next",
                      icon: ArrowRightIcon,
                      action: () => setPage((prev) => prev + 1),
                      disabled: page === numPages,
                    },
                  ].map((button, index) => (
                    <Button
                      variant="ghost"
                      key={index}
                      onClick={button.action}
                      className="z-50 rounded bg-white/60 px-4 py-2 text-black backdrop-blur-sm transition hover:bg-white/70"
                      disabled={button.disabled}
                    >
                      {button.icon && <button.icon className="mr-2 text-lg" />}
                      {button.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[50vh] md:h-[70vh] items-center justify-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
