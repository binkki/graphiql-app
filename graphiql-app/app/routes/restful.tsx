import { useState } from "react";
import EndpointUrl from "~/components/Client/RestfulClient/EndpointUrl";
import MethodSelector from "~/components/Client/RestfulClient/MethodSelector";
import { defaultHeaders, restMethods } from "~/utils/constants";
import CodeEditor from "~/components/Client/CodeEditor";
import {
  generateRestfulUrl,
  isMethodBody,
  saveToLocalStorage,
  validateBodyIsJson,
  validateLink,
} from "~/utils/utils";
import RequestHeaders from "~/components/Client/RestfulClient/RequestHeaders";
import { RequestBody, RequestHeader } from "~/types";
import EditedURL from "~/components/Client/RestfulClient/EditedUrl";
import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function Restful() {
  const [restfulResponse, setResponse] = useState("");
  const [status, setStatus] = useState("");

  const [enspointError, setEndpointError] = useState("");
  const [methodError, setMethodError] = useState("");
  const [bodyError, setBodyError] = useState("");

  const [method, setMethod] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [headers, setHeaders] = useState<RequestHeader[]>(defaultHeaders);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const validate = (
    endpointUrl: string,
    method: string,
    requestBody: string,
  ): boolean => {
    if (method === "DEFAULT" || method === "") {
      setMethodError("Please choose request method");
      return false;
    }
    if (!validateLink(endpointUrl)) {
      setEndpointError("Please enter valid endpoint url");
      return false;
    }
    const isMethodHaveBody = !isMethodBody(method);
    if (method !== "DELETE") {
      if (isMethodHaveBody && requestBody) {
        setBodyError(t("wrong-body-no"));
        return false;
      }
      if (!isMethodHaveBody && !requestBody) {
        setBodyError(t("wrong-body-yes"));
        return false;
      }
    }
    if (!isMethodHaveBody && !validateBodyIsJson(requestBody)) {
      setBodyError("Please enter valid json body");
      return false;
    }
    return true;
  };

  const generateRequest = (
    endpointUrl: string,
    method: string,
    requestBody: string,
  ): boolean | RequestBody => {
    if (!validate(endpointUrl, method, requestBody)) return false;
    const isMethodHaveBody = !isMethodBody(method);
    const requestHeader = new Headers();
    const headerList: string[] = [];
    headers
      .filter((x: RequestHeader) => x.key.length > 0 && x.value.length > 0)
      .forEach((x: RequestHeader) => {
        headerList.push(x.key);
        requestHeader.append(x.key, x.value);
      });
    return !isMethodHaveBody
      ? {
          method: method,
          headers: requestHeader,
          body: requestBody,
        }
      : {
          method: method,
          headers: requestHeader,
        };
  };

  const resetErrors = () => {
    setResponse("");
    setStatus("");
    setBodyError("");
    setEndpointError("");
    setMethodError("");
  };

  const sendRequest = async () => {
    resetErrors();

    const options = generateRequest(endpointUrl, method, requestBody);

    if (typeof options === "boolean") {
      return;
    }

    await fetch(endpointUrl, options)
      .then((response) => {
        const responseStatus = `${response.status}`;
        setStatus(responseStatus);
        if (response.ok) {
          return response.json();
        } else {
          return;
        }
      })
      .then((value) => {
        setResponse(JSON.stringify(value));
        const link = generateRestfulUrl(
          method,
          endpointUrl,
          requestBody,
          headers,
        );
        saveToLocalStorage("restful", link);
        navigate(link);
      });
  };

  return (
    <div className="flex flex-col items-center py-2.5 px-4 gap-2">
      <div>
        <span className="block w-fit">Request</span>
        <div className="flex flex-col justify-start gap-2 py-2.5 px-4 border border-black  rounded-lg w-fit">
          <MethodSelector
            id="restful-method"
            methods={restMethods}
            setMethod={setMethod}
          />
          {methodError && (
            <div className="text-base text-red-500 w-fit">{methodError}</div>
          )}
          <EndpointUrl
            id="restful-url"
            placeholder="Endpoint URL"
            setEndpointUrl={setEndpointUrl}
          />
          {enspointError && (
            <div className="text-base text-red-500 w-fit">{enspointError}</div>
          )}
          <EditedURL
            id="restful-url-edited"
            url={generateRestfulUrl(method, endpointUrl, requestBody, headers)}
          />
          <RequestHeaders
            id="restful-headers"
            headers={headers}
            setHeader={setHeaders}
          />
          <CodeEditor
            language="json"
            readonly={false}
            value=""
            id="restful-request-editor"
            setRequestBody={setRequestBody}
          />
          {bodyError && (
            <div className="text-base text-red-500 w-fit">{bodyError}</div>
          )}
        </div>
      </div>
      <button
        className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
        onClick={sendRequest}
      >
        Send request
      </button>
      <div>
        <span>Response</span>
        <div className="flex flex-col justify-start gap-2 py-2.5 px-4 border border-black rounded-lg w-fit hover:cursor-default">
          <div className="hover:cursor-default">
            Response Status: {status.length ? status : "-"}
          </div>
          <CodeEditor
            language="json"
            readonly={true}
            value={restfulResponse}
            id="restful-response-editor"
          />
        </div>
      </div>
    </div>
  );
}
