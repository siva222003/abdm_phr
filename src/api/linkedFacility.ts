import {
  UserInitLinkingBaseResponse,
  UserInitLinkingCheckStatusResponse,
  UserInitLinkingConfirmRequest,
  UserInitLinkingDiscoverRequest,
  UserInitLinkingInitRequest,
} from "@/types/linkedFacility";
import { API } from "@/utils/request/api";

export const linkedFacility = {
  discover: API<UserInitLinkingBaseResponse, UserInitLinkingDiscoverRequest>(
    "POST /phr/user_init_linking/discover",
  ),
  init: API<UserInitLinkingBaseResponse, UserInitLinkingInitRequest>(
    "POST /phr/user_init_linking/init",
  ),
  confirm: API<UserInitLinkingBaseResponse, UserInitLinkingConfirmRequest>(
    "POST /phr/user_init_linking/confirm",
  ),
  checkStatus: API<UserInitLinkingCheckStatusResponse>(
    "GET /phr/user_init_linking/status",
  ),
};
