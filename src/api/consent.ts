import {
  ConsentApproveRequest,
  ConsentArtefact,
  ConsentArtefactsResponse,
  ConsentDenyRequest,
  ConsentRequest,
  ConsentRequestsResponse,
  ConsentRevokeRequest,
  ConsentUpdateBaseResponse,
} from "@/types/consent";
import { API } from "@/utils/request/api";

export const consent = {
  listRequests: API<ConsentRequestsResponse>("GET /phr/consent/requests"),
  getRequest: API<ConsentRequest>("GET /phr/consent/request/{requestId}"),
  listArtefacts: API<ConsentArtefactsResponse>("GET /phr/consent/artefacts"),
  getArtefact: API<ConsentArtefact>("GET /phr/consent/artefact/{artefactId}"),
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
};
