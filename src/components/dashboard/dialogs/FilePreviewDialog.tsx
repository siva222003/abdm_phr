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

import { PREVIEWABLE_FILE_EXTENSIONS } from "@/common/constants";
import CircularProgress from "@/common/loaders/CircularProgress";

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
  loadFile?: (file: UploadedRecord) => Promise<void>;
  currentIndex: number;
};

const getRotationClass = (rotation: number): string => {
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
};

const DOWNLOAD_STATES = {
  IDLE: "idle",
  DOWNLOADING: "downloading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

type DownloadState = (typeof DOWNLOAD_STATES)[keyof typeof DOWNLOAD_STATES];

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
  const [numPages, setNumPages] = useState(1);
  const [rotation, setRotation] = useState<number>(0);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [index, setIndex] = useState<number>(currentIndex);
  const [downloadState, setDownloadState] = useState<DownloadState>(
    DOWNLOAD_STATES.IDLE,
  );

  const fileName = file_state?.name
    ? `${file_state.name}.${file_state.extension}`
    : "";
  const fileNameTooltip =
    fileName.length > 30 ? `${fileName.slice(0, 30)}...` : fileName;

  useEffect(() => {
    if (uploadedFiles && show) {
      setIndex(currentIndex);
    }
  }, [uploadedFiles, show, currentIndex]);

  useEffect(() => {
    if (transformRef.current && show) {
      transformRef.current.resetTransform();
      setRotation(0);
    }
  }, [index, show]);

  useEffect(() => {
    if (file_state.extension === "pdf") {
      setPage(1);
    }
  }, [file_state.extension, fileUrl]);

  const handleNext = async (newIndex: number) => {
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

    try {
      await loadFile(nextFile);
      setIndex(newIndex);
    } catch (error) {
      console.error("Failed to load next file:", error);
      toast.error("Failed to load file");
    }
  };

  const handleClose = () => {
    setPage(1);
    setNumPages(1);
    setIndex(-1);
    setRotation(0);
    setDownloadState(DOWNLOAD_STATES.IDLE);
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
  }, [show, index, uploadedFiles?.length, handleNext, handleClose]);

  const handleZoomIn = () => {
    transformRef.current?.zoomIn(0.5);
  };

  const handleZoomOut = () => {
    transformRef.current?.zoomOut(0.5);
  };

  const handleRotate = (angle: number) => {
    setRotation((prev) => (prev + angle + 360) % 360);
  };

  const handleResetTransform = () => {
    setRotation(0);
    transformRef.current?.resetTransform();
  };

  const handleDownload = async () => {
    if (!downloadURL || downloadState === DOWNLOAD_STATES.DOWNLOADING) return;

    setDownloadState(DOWNLOAD_STATES.DOWNLOADING);
    let blobUrl: string | null = null;

    try {
      const response = await fetch(downloadURL);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const data = await response.blob();
      blobUrl = URL.createObjectURL(data);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = fileName || "downloaded-file";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadState(DOWNLOAD_STATES.SUCCESS);
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadState(DOWNLOAD_STATES.ERROR);
      toast.error("File download failed");
    } finally {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      setTimeout(() => setDownloadState(DOWNLOAD_STATES.IDLE), 2000);
    }
  };

  const renderImageViewer = () => (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      minScale={0.25}
      maxScale={4}
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
        wrapperClass={isPanning ? "cursor-grabbing" : "cursor-grab"}
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
          onError={() => toast.error("Failed to load image")}
        />
      </TransformComponent>
    </TransformWrapper>
  );

  const renderPDFViewer = () => (
    <div className="w-full h-full overflow-auto">
      <Suspense fallback={<Loading />}>
        <PDFViewer
          url={fileUrl}
          onDocumentLoadSuccess={(pages: number) => {
            setPage(1);
            setNumPages(pages);
          }}
          pageNumber={page}
          scale={1}
          className="max-md:max-w-[50vw]"
        />
      </Suspense>
    </div>
  );

  const renderGenericViewer = () => (
    <iframe
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="File preview"
      src={fileUrl}
      className="h-[50vh] md:h-[70vh] w-full"
      onError={() => toast.error("Failed to load file preview")}
    />
  );

  const renderUnsupportedFile = () => (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <FileIcon className="mb-4 text-5xl text-secondary-600" />
      <p className="text-gray-600">File preview not supported</p>
      <p className="text-sm text-gray-500 mt-1">
        Download the file to view its contents
      </p>
    </div>
  );

  const Loading = () => (
    <div className="flex h-[50vh] md:h-[70vh] items-center justify-center">
      <CircularProgress />
    </div>
  );

  const imageControls = [
    {
      label: "Zoom In",
      icon: ZoomIn,
      action: handleZoomIn,
      disabled: false,
    },
    {
      label: "Reset",
      icon: RefreshCcwIcon,
      action: handleResetTransform,
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
  ];

  const pdfControls = [
    {
      label: "Previous",
      icon: ArrowLeftIcon,
      action: () => setPage((prev) => Math.max(1, prev - 1)),
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
      action: () => setPage((prev) => Math.min(numPages, prev + 1)),
      disabled: page === numPages,
    },
  ];

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="h-full w-full max-w-[100vw] md:max-w-[80vw] flex-col gap-4 rounded-lg p-4 shadow-xl md:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm text-gray-600">
            File Preview
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
                {uploadedFiles?.[index]?.created_date && (
                  <p className="mt-1 text-sm text-gray-600">
                    Created on{" "}
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
                    onClick={() =>
                      window.open(fileUrl, "_blank", "noopener,noreferrer")
                    }
                  >
                    <ExternalLinkIcon className="size-4" />
                    <span>Open in browser</span>
                  </Button>
                )}
                {downloadURL && (
                  <Button
                    variant="primary"
                    data-cy="file-preview-download"
                    onClick={handleDownload}
                    disabled={downloadState === DOWNLOAD_STATES.DOWNLOADING}
                  >
                    {downloadState === DOWNLOAD_STATES.DOWNLOADING ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <DownloadIcon className="size-4" />
                    )}
                    <span>
                      {downloadState === DOWNLOAD_STATES.DOWNLOADING
                        ? "Downloading..."
                        : "Download"}
                    </span>
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
                {file_state.isImage
                  ? renderImageViewer()
                  : file_state.extension === "pdf"
                    ? renderPDFViewer()
                    : PREVIEWABLE_FILE_EXTENSIONS.includes(
                          file_state.extension as (typeof PREVIEWABLE_FILE_EXTENSIONS)[number],
                        )
                      ? renderGenericViewer()
                      : renderUnsupportedFile()}
              </div>

              {uploadedFiles && uploadedFiles.length > 1 && (
                <Button
                  variant="primary"
                  onClick={() => handleNext(index + 1)}
                  disabled={index >= uploadedFiles.length - 1}
                  aria-label="Next file"
                >
                  <ArrowRightIcon className="size-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center">
              {file_state.isImage && (
                <div className="mt-2 grid grid-cols-3 md:grid-cols-5 gap-4">
                  {imageControls.map((control, idx) => (
                    <Button
                      variant="ghost"
                      key={idx}
                      onClick={control.action}
                      className={cn(
                        "z-50 rounded bg-white/60 px-4 py-2 text-black backdrop-blur-sm transition hover:bg-white/70",
                        idx === 3 && "col-start-1 md:col-auto",
                        idx === 4 && "col-start-3 md:col-auto",
                      )}
                      disabled={control.disabled}
                    >
                      {control.icon && (
                        <control.icon className="mr-2 text-lg" />
                      )}
                      {control.label}
                    </Button>
                  ))}
                </div>
              )}

              {file_state.extension === "pdf" && (
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {pdfControls.map((control, idx) => (
                    <Button
                      variant="ghost"
                      key={idx}
                      onClick={control.action}
                      className="z-50 rounded bg-white/60 px-4 py-2 text-black backdrop-blur-sm transition hover:bg-white/70"
                      disabled={control.disabled}
                    >
                      {control.icon && (
                        <control.icon className="mr-2 text-lg" />
                      )}
                      {control.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </DialogContent>
    </Dialog>
  );
}
