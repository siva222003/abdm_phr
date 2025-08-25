import { ConsentListResponse } from "@/types/consent";
import {
  SubscriptionApproveRequest,
  SubscriptionArtefactResponse,
  SubscriptionDenyRequest,
  SubscriptionEditRequest,
  SubscriptionRequest,
  SubscriptionRequestResponse,
  SubscriptionStatusUpdateRequest,
  SubscriptionUpdateBaseResponse,
} from "@/types/subscription";
import { API } from "@/utils/request/api";

export const subscription = {
  listRequests: API<ConsentListResponse<SubscriptionRequest>>(
    "GET /phr/subscription/requests",
  ),
  getRequest: API<SubscriptionRequestResponse>(
    "GET /phr/subscription/request/{requestId}",
  ),
  getArtefact: API<SubscriptionArtefactResponse>(
    "GET /phr/subscription/artefact/{artefactId}",
  ),
  approve: API<SubscriptionUpdateBaseResponse, SubscriptionApproveRequest>(
    "POST /phr/subscription/request/{requestId}/approve",
  ),
  deny: API<SubscriptionUpdateBaseResponse, SubscriptionDenyRequest>(
    "POST /phr/subscription/request/{requestId}/deny",
  ),
  updateStatus: API<
    SubscriptionUpdateBaseResponse,
    SubscriptionStatusUpdateRequest
  >("POST /phr/subscription/{subscriptionId}/update_status"),
  edit: API<SubscriptionUpdateBaseResponse, SubscriptionEditRequest>(
    "PUT /phr/subscription/{subscriptionId}/edit",
  ),
};
