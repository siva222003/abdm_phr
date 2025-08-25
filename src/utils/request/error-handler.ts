import { navigate } from "raviger";
import { toast } from "sonner";

import { HTTPError } from "@/utils/request/types";
import type { StructuredError } from "@/utils/request/types";

export function handleHttpError(error: Error) {
  if (("silent" in error && error.silent) || error.name === "AbortError") {
    return;
  }

  if (!(error instanceof HTTPError)) {
    toast.error(error.message || "An unexpected error occurred.");
    return;
  }

  const cause = error.cause;

  if (isNotFound(error)) {
    toast.error((cause?.detail as string) || "Resource not found.");
    return;
  }

  if (isSessionExpired(cause)) {
    handleSessionExpired();
    return;
  }

  if (isBadRequest(error)) {
    const errs = cause?.errors;
    if (isPydanticError(errs)) {
      handlePydanticErrors(errs);
      return;
    }

    if (isStructuredError(cause)) {
      handleStructuredErrors(cause);
      return;
    }
  }

  toast.error((cause?.detail as string) || "An unexpected error occurred.");
}

function isSessionExpired(error: HTTPError["cause"]) {
  return (
    error?.code === "token_not_valid" ||
    error?.detail === "Authentication credentials were not provided."
  );
}

function handleSessionExpired() {
  if (!location.pathname.startsWith("/session-expired")) {
    navigate(`/session-expired`);
  }
}

function isBadRequest(error: HTTPError) {
  return error.status === 400 || error.status === 406;
}

function isNotFound(error: HTTPError) {
  return error.status === 404;
}

function isStructuredError(err: HTTPError["cause"]): err is StructuredError {
  return typeof err === "object" && !Array.isArray(err);
}

function handleStructuredErrors(cause: StructuredError) {
  if ("detail" in cause && typeof cause.detail === "string") {
    toast.error(cause.detail);
    return;
  }

  const errorMessages = extractErrorMessages(cause);

  if (errorMessages.length > 0) {
    errorMessages.forEach((message) => toast.error(message));
  } else {
    toast.error("Validation error occurred");
  }
}

function extractErrorMessages(obj: any, path: string[] = []): string[] {
  const messages: string[] = [];

  if (typeof obj === "string") {
    return [obj];
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === "string") {
        messages.push(item);
      } else {
        messages.push(
          ...extractErrorMessages(item, [...path, index.toString()]),
        );
      }
    });
    return messages;
  }

  if (typeof obj === "object" && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      messages.push(...extractErrorMessages(value, [...path, key]));
    });
  }

  return messages;
}

type PydanticError = {
  type: string;
  loc?: string[];
  msg: string | Record<string, string>;
  input?: unknown;
  url?: string;
};

function isPydanticError(errors: unknown): errors is PydanticError[] {
  return (
    Array.isArray(errors) &&
    errors.every(
      (error) => typeof error === "object" && error !== null && "type" in error,
    )
  );
}

function handlePydanticErrors(errors: PydanticError[]) {
  errors.map(({ type, loc, msg }) => {
    const message = typeof msg === "string" ? msg : Object.values(msg)[0];
    if (!loc) {
      toast.error(message);
      return;
    }
    type = type
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    toast.error(message, {
      description: `${type}: '${loc.join(".")}'`,
      duration: 8000,
    });
  });
}
