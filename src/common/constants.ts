export const DOMAIN = "@sbx";
export const OTP_LENGTH = 6;
export const RESEND_OTP_DURATION = 60;

export const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  switchProfileEnabled: "switch_profile_enabled",
} as const;

export const REFRESH_TOKEN_REFETCH_INTERVAL = 1000 * 60 * 5;

export const DEFAULT_AUTH_METHOD = "abdm";

export const AUTH_METHOD_CHOICES = [
  {
    id: "abdm",
    label: "Mobile OTP",
  },
  {
    id: "aadhaar",
    label: "Aadhaar OTP",
  },
  {
    id: "password",
    label: "Password",
  },
] as const;

export const AUTH_METHODS = AUTH_METHOD_CHOICES.map(
  (choice) => choice.id,
) as (typeof AUTH_METHOD_CHOICES)[number]["id"][];

export const GENDER_CHOICES = [
  {
    id: "M",
    label: "Male",
  },
  {
    id: "F",
    label: "Female",
  },
  {
    id: "O",
    label: "Other",
  },
] as const;

export const GENDERS = GENDER_CHOICES.map(
  (choice) => choice.id,
) as (typeof GENDER_CHOICES)[number]["id"][];

export const DEFAULT_MAX_FILE_SIZE = 5; // FOR INTERNAL API IN MB
export const MAX_FILE_SIZE_KB = 100; // FOR ABDM API
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CONSENT_LIST_LIMIT = 8;

export const BACKEND_ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "txt",
  "csv",
  "rtf",
  "doc",
  "odt",
  "pdf",
  "xls",
  "xlsx",
  "ods",
];

export const FILE_EXTENSIONS = {
  IMAGE: ["jpeg", "jpg", "png", "gif", "svg", "bmp", "webp", "jfif"],
  PRESENTATION: ["pptx"],
  DOCUMENT: ["pdf", "docx"],
} as const;

export const PREVIEWABLE_FILE_EXTENSIONS = [
  "html",
  "htm",
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
] as const;
