import { RequestHeader } from "~/types";
import { linkRegexPattern } from "./constants";

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

export const saveToLocalStorage = (key: string, value: string) => {
  const requests = localStorage.getItem(key);
  if (!requests) {
    localStorage.setItem(key, JSON.stringify([value]));
  } else {
    const data = JSON.parse(requests);
    data.push(value);
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const encodeToBase64 = (value: string): string => btoa(value);

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
  const body = decodeFromBase64(bodyUrl[0]);
  const result = {
    method: url[3],
    endpointUrl: endpointUrl,
    body: body,
    headers: headers,
  };
  return JSON.stringify(result);
};

export const generateRestfulUrl = (
  method: string,
  url: string,
  body: string,
  headers: RequestHeader[],
): string => {
  if (
    method.length === 0 &&
    url.length === 0 &&
    body.length === 0 &&
    headers.length < 2
  )
    return "";
  let newUrl = "";
  if (method) {
    newUrl = `/${method}/`;
  }
  if (url) {
    newUrl = `${newUrl}${encodeToBase64(url)}/`;
  }
  if (body) {
    newUrl = `${newUrl}${encodeToBase64(body)}`;
  } else {
    if (method || url || headers.length > 0) {
      newUrl = `${newUrl}${encodeToBase64("{}")}`;
    }
  }
  if (headers.length > 0 && newUrl) {
    let headerSeparator = "?";
    for (let i = 0; i < headers.length; i += 1) {
      newUrl = `${newUrl}${headerSeparator}${headers[i].key}=${encodeToBase64(headers[i].value)}`;
      if (headerSeparator === "?") headerSeparator = "&";
    }
  }
  return newUrl;
};
