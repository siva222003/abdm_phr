import {
  FileIcon,
  ImageIcon,
  PaperclipIcon,
  PresentationIcon,
} from "lucide-react";

import { FILE_EXTENSIONS } from "@/common/constants";

export const FILE_ICONS: Record<
  keyof typeof FILE_EXTENSIONS | "UNKNOWN",
  React.ElementType
> = {
  IMAGE: ImageIcon,
  PRESENTATION: PresentationIcon,
  DOCUMENT: PaperclipIcon,
  UNKNOWN: FileIcon,
};

export interface LinkedRecord {
  data: Array<{
    content: string;
    care_context_reference: string;
  }>;
}

export interface UploadedRecord {
  id?: string;
  name?: string;
  associating_id?: string;
  created_date?: string;
  upload_completed?: boolean;
  read_signed_url?: string;
  extension?: string;
  mime_type?: string;
}

export interface UploadedRecordResponse {
  count: number;
  results: UploadedRecord[];
}

export interface CreateUploadedRecordRequest {
  file_data: string;
  original_name: string;
  name: string;
  associating_id: string;
  file_type: "patient";
  file_category: "unspecified" | string;
  mime_type: string;
}

export interface UpdateUploadedRecordRequest {
  name: string;
}
