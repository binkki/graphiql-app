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

export const defaultRestfulErrorsState = {
  methodError: "",
  endpointUrlError: "",
  bodyError: "",
};

export const defaultRestfulRequestState = {
  method: "",
  endpointUrl: "",
  headers: defaultHeaders,
  body: "",
};

export const defaultRestfulResponseState = {
  status: "",
  body: "",
};
