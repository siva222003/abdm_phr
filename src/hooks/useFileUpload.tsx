import { useMutation, useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import FilePreviewDialog, {
  StateInterface,
} from "@/components/dashboard/dialogs/FilePreviewDialog";
import FileRenameDialog from "@/components/dashboard/dialogs/FileRenameDialog";

import { useAuthContext } from "@/hooks/useAuth";

import {
  FILE_EXTENSIONS,
  PREVIEWABLE_FILE_EXTENSIONS,
} from "@/common/constants";

import routes from "@/api";
import { UploadedRecord } from "@/types/dashboard";
import { mutate, query } from "@/utils/request/request";

export type FileUploadOptions = {
  multiple?: boolean;
  type: string;
  category?: string;
  allowedExtensions?: string[];
  uploadedFiles?: UploadedRecord[];
};

export type FileUploadReturn = {
  progress: null | number;
  error: null | string;
  setError: (error: string | null) => void;
  getFileType: (
    file: UploadedRecord,
  ) => keyof typeof FILE_EXTENSIONS | "UNKNOWN";
  isPreviewable: (file: UploadedRecord) => boolean;
  validateFiles: () => boolean;
  handleFileUpload: (combineToPDF?: boolean) => Promise<void>;
  fileNames: string[];
  files: File[];
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setFileName: (names: string, index?: number) => void;
  setFileNames: (names: string[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  uploading: boolean;
  viewFile: (file: UploadedRecord) => Promise<void>;
  downloadFile: (file: UploadedRecord) => Promise<void>;
  editFile: (file: UploadedRecord) => void;
  Dialogs: React.ReactNode;
};

export default function useFileUpload(
  options: FileUploadOptions,
): FileUploadReturn {
  const { uploadedFiles } = options;
  const { user } = useAuthContext();

  const [uploadFileNames, setUploadFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<null | number>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [file_state, setFileState] = useState<StateInterface>({
    open: false,
    isImage: false,
    name: "",
    extension: "",
    isZoomInDisabled: false,
    isZoomOutDisabled: false,
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [downloadURL, setDownloadURL] = useState<string>("");

  const [editDialogueOpen, setEditDialogueOpen] =
    useState<UploadedRecord | null>(null);

  const queryClient = useQueryClient();

  const generatePDF = async (files: File[]): Promise<File | null> => {
    try {
      toast.info("File conversion in progress");
      const pdf = new jsPDF();
      const totalFiles = files.length;

      for (const [index, file] of files.entries()) {
        const imgData = URL.createObjectURL(file);
        pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
        URL.revokeObjectURL(imgData);
        if (index < files.length - 1) pdf.addPage();
        const progress = Math.round(((index + 1) / totalFiles) * 100);
        setProgress(progress);
      }
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], "combined.pdf", {
        type: "application/pdf",
      });
      setProgress(0);
      toast.success("File conversion success");
      return pdfFile;
    } catch (_) {
      toast.error("Failed to generate PDF");
      setError("Failed to generate PDF");
      setProgress(0);
      return null;
    }
  };
  const onFileChange = (e: ChangeEvent<HTMLInputElement>): any => {
    if (!e.target.files?.length) {
      return;
    }
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  useEffect(() => {
    const blanks = Array(files.length).fill("");
    setUploadFileNames((names) => [...names, ...blanks].slice(0, files.length));
  }, [files]);

  const getFileType: (
    f: UploadedRecord,
  ) => keyof typeof FILE_EXTENSIONS | "UNKNOWN" = (file: UploadedRecord) => {
    if (!file.extension) return "UNKNOWN";
    const ftype = (
      Object.keys(FILE_EXTENSIONS) as (keyof typeof FILE_EXTENSIONS)[]
    ).find((type) =>
      FILE_EXTENSIONS[type].includes((file.extension?.slice(1) || "") as never),
    );
    return ftype || "UNKNOWN";
  };

  const isPreviewable = (file: UploadedRecord) =>
    !!file.extension &&
    PREVIEWABLE_FILE_EXTENSIONS.includes(
      file.extension.slice(1) as (typeof PREVIEWABLE_FILE_EXTENSIONS)[number],
    );

  const getExtension = (url: string) => {
    const div1 = url.split("?")[0].split(".");
    const ext: string = div1[div1.length - 1].toLowerCase();
    return ext;
  };

  const handleFilePreviewClose = () => {
    setDownloadURL("");
    setFileState({
      ...file_state,
      open: false,
      isZoomInDisabled: false,
      isZoomOutDisabled: false,
    });
  };

  const validateFileUpload = () => {
    if (files.length === 0) {
      setError("Please choose a file");
      return false;
    }

    for (const file of files) {
      const filenameLength = file.name.trim().length;
      if (filenameLength === 0) {
        setError("File name is required");
        return false;
      }
      if (file.size > 10e7) {
        setError("File size is too large");
        return false;
      }
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        "allowedExtensions" in options &&
        !options.allowedExtensions
          ?.map((extension) => extension.replace(".", "").toLowerCase())
          ?.includes(extension || "")
      ) {
        setError(
          `File type ${extension} is not allowed. Allowed types are ${options.allowedExtensions?.join(", ")}`,
        );
        return false;
      }
    }
    return true;
  };

  const { mutateAsync: createUpload } = useMutation({
    mutationFn: mutate(routes.dashboard.createUploadedRecord),
    onSuccess: () => {
      toast.success("File uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["uploadedRecord"],
      });
      setError(null);
    },
  });

  const handleUpload = async (combineToPDF?: boolean) => {
    if (combineToPDF && "allowedExtensions" in options) {
      options.allowedExtensions = ["jpg", "png", "jpeg"];
    }
    if (!validateFileUpload()) return;

    setProgress(0);
    const errors: File[] = [];
    if (combineToPDF) {
      if (!uploadFileNames.length || !uploadFileNames[0]) {
        setError("File name is required");
        return;
      }
    } else {
      for (const [index, _] of files.entries()) {
        if (!uploadFileNames[index].trim()) {
          setError("File name is required");
          return;
        }
      }
    }

    if (combineToPDF && files.length > 1) {
      const pdfFile = await generatePDF(files);
      if (pdfFile) {
        files.splice(0, files.length, pdfFile);
      } else {
        clearFiles();
        setError("Failed to generate PDF");
        return;
      }
    }

    setUploading(true);

    for (const [index, file] of files.entries()) {
      try {
        await createUpload({
          original_name: file.name,
          name: uploadFileNames[index],
          associating_id: user?.abhaAddress || "",
          file_type: "patient",
          file_category: "unspecified",
          mime_type: file.type,
        });
      } catch {
        errors.push(file);
      }
    }

    setUploading(false);
    setFiles(errors);
    setUploadFileNames(errors?.map((f) => f.name) ?? []);
    setError("Network error");
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
    setUploadFileNames([]);
  };

  const getUploadedRecord = async (file: UploadedRecord) => {
    return queryClient.fetchQuery({
      queryKey: ["uploadedRecord", file.id],
      queryFn: query(routes.dashboard.getUploadedRecord, {
        queryParams: {
          file_type: "patient",
          associating_id: user?.abhaAddress || "",
        },
        pathParams: { id: file.id || "" },
      }),
    });
  };

  const viewFile = async (file: UploadedRecord) => {
    const index = uploadedFiles?.findIndex((f) => f.id === file.id) ?? -1;
    setCurrentIndex(index);
    setFileUrl("");
    setFileState({ ...file_state, open: true });

    const data = await getUploadedRecord(file);

    if (!data) return;

    const signedUrl = data.read_signed_url as string;
    const extension = getExtension(signedUrl);

    setFileState({
      ...file_state,
      open: true,
      name: data.name as string,
      extension,
      isImage: FILE_EXTENSIONS.IMAGE.includes(
        extension as (typeof FILE_EXTENSIONS.IMAGE)[number],
      ),
    });
    setDownloadURL(signedUrl);
    setFileUrl(signedUrl);
  };

  const downloadFile = async (file: UploadedRecord) => {
    try {
      if (!file.id) return;
      toast.success("File download started");
      const fileData = await getUploadedRecord(file);
      const response = await fetch(fileData?.read_signed_url || "");
      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.blob();
      const blobUrl = window.URL.createObjectURL(data);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.name || "file";
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      toast.success("File download completed");
    } catch {
      toast.error("File download failed");
    }
  };

  const editFile = (file: UploadedRecord) => {
    setEditDialogueOpen(file);
  };

  const Dialogs = (
    <>
      <FileRenameDialog
        editedFile={editDialogueOpen}
        setEditedFile={setEditDialogueOpen}
      />
      <FilePreviewDialog
        show={file_state.open}
        fileUrl={fileUrl}
        file_state={file_state}
        downloadURL={downloadURL}
        uploadedFiles={uploadedFiles}
        onClose={handleFilePreviewClose}
        className="h-[80vh] w-full md:h-screen"
        loadFile={viewFile}
        currentIndex={currentIndex}
      />
    </>
  );

  return {
    progress,
    error,
    setError,
    validateFiles: validateFileUpload,
    handleFileUpload: handleUpload,
    fileNames: uploadFileNames,
    files: files,
    onFileChange,
    setFileNames: setUploadFileNames,
    setFileName: (name: string, index = 0) => {
      setUploadFileNames((prev) =>
        prev.map((n, i) => (i === index ? name : n)),
      );
    },
    removeFile: (index = 0) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadFileNames((prev) => prev.filter((_, i) => i !== index));
    },
    clearFiles,
    uploading,
    getFileType,
    isPreviewable,
    viewFile,
    downloadFile,
    editFile,
    Dialogs,
  };
}
