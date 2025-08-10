import {
  AutoApprovalUpdateRequest,
  ConsentApproveRequest,
  ConsentArtefact,
  ConsentArtefactResponse,
  ConsentDenyRequest,
  ConsentRequest,
  ConsentRequestResponse,
  ConsentRevokeRequest,
  ConsentUpdateBaseResponse,
} from "@/types/consent";
import { API } from "@/utils/request/api";

export const consent = {
  listRequests: API<ConsentRequest[]>("GET /phr/consent/requests"),
  getRequest: API<ConsentRequestResponse>(
    "GET /phr/consent/request/{requestId}",
  ),
  listArtefacts: API<ConsentArtefact[]>("GET /phr/consent/artefacts"),
  getArtefact: API<ConsentArtefactResponse>(
    "GET /phr/consent/artefact/{artefactId}",
  ),
  getRequestArtefacts: API<ConsentArtefact[]>(
    "GET /phr/consent/request/{requestId}/artefacts",
  ),
  approve: API<ConsentUpdateBaseResponse, ConsentApproveRequest>(
    "POST /phr/consent/request/{requestId}/approve",
  ),
  deny: API<ConsentUpdateBaseResponse, ConsentDenyRequest>(
    "POST /phr/consent/request/{requestId}/deny",
  ),
  revoke: API<ConsentUpdateBaseResponse, ConsentRevokeRequest>(
    "POST /phr/consent/revoke",
  ),
  updateAutoApproval: API<ConsentUpdateBaseResponse, AutoApprovalUpdateRequest>(
    "POST /phr/consent/auto_approve/{autoApprovalId}/update",
  ),
};
