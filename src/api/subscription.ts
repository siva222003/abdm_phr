import {
  SubscriptionArtefactResponse,
  SubscriptionDenyRequest,
  SubscriptionEditAndApproveRequest,
  SubscriptionRequest,
  SubscriptionRequestResponse,
  SubscriptionStatusUpdateRequest,
  SubscriptionUpdateBaseResponse,
} from "@/types/subscription";
import { API } from "@/utils/request/api";

export const subscription = {
  listRequests: API<SubscriptionRequest[]>("GET /phr/subscription/requests"),
  getRequest: API<SubscriptionRequestResponse>(
    "GET /phr/subscription/request/{requestId}",
  ),
  getArtefact: API<SubscriptionArtefactResponse>(
    "GET /phr/subscription/artefact/{artefactId}",
  ),
  approve: API<
    SubscriptionUpdateBaseResponse,
    SubscriptionEditAndApproveRequest
  >("POST /phr/subscription/request/{requestId}/approve"),
  deny: API<SubscriptionUpdateBaseResponse, SubscriptionDenyRequest>(
    "POST /phr/subscription/request/{requestId}/deny",
  ),
  updateStatus: API<
    SubscriptionUpdateBaseResponse,
    SubscriptionStatusUpdateRequest
  >("POST /phr/subscription/{subscriptionId}/update_status"),
  edit: API<SubscriptionUpdateBaseResponse, SubscriptionEditAndApproveRequest>(
    "POST /phr/subscription/{subscriptionId}/edit",
  ),
};
