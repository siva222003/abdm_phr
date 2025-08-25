import {
  CreateUploadedRecordRequest,
  LinkedRecord,
  UpdateUploadedRecordRequest,
  UploadedRecord,
  UploadedRecordResponse,
} from "@/types/dashboard";
import { API } from "@/utils/request/api";

export const dashboard = {
  getLinkedRecord: API<LinkedRecord>("GET /phr/health_records/linked/{id}"),
  listUploadedRecords: API<UploadedRecordResponse>("GET /phr/health_records"),
  getUploadedRecord: API<UploadedRecord>("GET /phr/health_records/{id}"),
  createUploadedRecord: API<void, CreateUploadedRecordRequest>(
    "POST /phr/health_records/upload/file",
  ),
  updateUploadedRecord: API<void, UpdateUploadedRecordRequest>(
    "PUT /phr/health_records/{id}",
  ),
};
