export const restMethods = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTION",
  "TRACE",
  "PATCH",
];

export const linkRegexPattern = "https?:/{2}(?:[/-w.]|(?:%[da-fA-F]{2}))+";

export const defaultHeaders = [
  {
    key: "Content-Type",
    value: "application/json",
  },
];

export const defaultHeaders1 = [
  {
    key: "Content-Type",
    value: "application/json",
  },
  {
    key: "access-control-allow-origin",
    value: "*",
  },
  {
    key: "Access-Control-Allow-Methods",
    value: restMethods.join(","),
  },
];
