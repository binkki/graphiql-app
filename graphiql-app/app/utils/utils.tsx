import {
  RequestBody,
  RequestHeader,
  RestfulClientErrors,
  RestfulRequestProps,
} from "~/types";
import { defaultRestfulErrorsState, linkRegexPattern } from "./constants";
import { t } from "i18next";
import { encodeBase64 } from "./encode";

export const isMethodBody = (method: string): boolean => {
  return ["GET", "CONNECT", "OPTIONS", "TRACE", "HEAD"].indexOf(method) === -1;
};

export const validateLink = (url: string): boolean => {
  const linkRegex = new RegExp(linkRegexPattern);
  return linkRegex.test(url);
};

export const validateBodyIsJson = (body: string): boolean => {
  try {
    return JSON.parse(body) && !!body;
  } catch (e) {
    return false;
  }
};

export const decodeFromBase64 = (value: string): string => {
  let result = "";
  try {
    result = atob(value);
  } catch {
    return "";
  }
  return result;
};

export const decodeUrlFromBase64 = (value: string): string => {
  const url = value.replaceAll("%3D", "=").split("/");
  const bodyUrl = url[5].split("?");
  const headers =
    bodyUrl.length === 2
      ? bodyUrl[1].split("&").map((x: string) => {
          const header = x.split("=");
          return {
            key: header[0],
            value: decodeFromBase64(header[1]),
          };
        })
      : [];
  const endpointUrl = decodeFromBase64(url[4]);
  let body = decodeFromBase64(bodyUrl[0]);
  if (body === "{}") {
    body = "";
  }
  const result = {
    method: url[3],
    endpointUrl: endpointUrl,
    body: body,
    headers: headers,
  };
  return JSON.stringify(result);
};

export const generateRestfulUrl = (request: RestfulRequestProps): string => {
  if (
    request.method.length === 0 &&
    request.endpointUrl.length === 0 &&
    request.body.length === 0 &&
    request.headers.length < 2
  )
    return "";
  let newUrl = "";
  if (request.method) {
    newUrl = `/${request.method}/`;
  }
  if (request.endpointUrl) {
    newUrl = `${newUrl}${encodeBase64(request.endpointUrl)}/`;
  }
  if (request.body) {
    newUrl = `${newUrl}${encodeBase64(request.body)}`;
  } else {
    if (request.method || request.endpointUrl || request.headers.length > 0) {
      newUrl = `${newUrl}${encodeBase64("{}")}`;
    }
  }
  if (request.headers.length > 0 && newUrl) {
    let headerSeparator = "?";
    for (let i = 0; i < request.headers.length; i += 1) {
      newUrl = `${newUrl}${headerSeparator}${request.headers[i].key}=${encodeBase64(request.headers[i].value)}`;
      if (headerSeparator === "?") headerSeparator = "&";
    }
  }
  return newUrl;
};

export const generateRequest = (
  request: RestfulRequestProps,
): { errors: RestfulClientErrors; body: RequestBody } => {
  const errors = validateRequest(request);
  const isMethodHaveBody = !isMethodBody(request.method);
  const requestHeader = new Headers();
  const headerList: string[] = [];
  request.headers
    .filter((x: RequestHeader) => x.key.length > 0 && x.value.length > 0)
    .forEach((x: RequestHeader) => {
      headerList.push(x.key);
      requestHeader.append(x.key, x.value);
    });
  const body = !isMethodHaveBody
    ? {
        method: request.method,
        headers: requestHeader,
        body: request.body,
      }
    : {
        method: request.method,
        headers: requestHeader,
      };
  return { errors: errors, body: body };
};

const validateRequest = (request: RestfulRequestProps): RestfulClientErrors => {
  let errors: RestfulClientErrors = defaultRestfulErrorsState;
  if (request.method === "DEFAULT" || request.method === "") {
    errors = {
      ...errors,
      methodError: t("wrong-method"),
    };
  }
  if (!validateLink(request.endpointUrl)) {
    errors = {
      ...errors,
      endpointUrlError: t("wrong-endpoint"),
    };
  }
  const isMethodHaveBody = !isMethodBody(request.method);
  if (request.method !== "DELETE") {
    if (isMethodHaveBody && request.body) {
      errors = {
        ...errors,
        bodyError: t("wrong-body-no"),
      };
    }
    if (!isMethodHaveBody && !request.body) {
      errors = {
        ...errors,
        bodyError: t("wrong-body-yes"),
      };
    }
    if (!isMethodHaveBody && !validateBodyIsJson(request.body)) {
      errors = {
        ...errors,
        bodyError: t("wrong-body-content"),
      };
    }
  } else {
    if (request.body.length > 0 && !validateBodyIsJson(request.body)) {
      errors = {
        ...errors,
        bodyError: t("wrong-body-content"),
      };
    }
  }
  return errors;
};
