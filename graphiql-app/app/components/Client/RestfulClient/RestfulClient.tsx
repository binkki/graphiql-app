import EndpointUrl from "./EndpointUrl";
import MethodSelector from "./MethodSelector";
import {
  defaultRestfulErrorsState,
  defaultRestfulRequestState,
  defaultRestfulResponseState,
  restMethods,
} from "../../../utils/constants";
import CodeEditor from "../CodeEditor";
import { generateRequest, generateRestfulUrl } from "../../../utils/utils";
import RequestHeaders from "./RequestHeaders";
import EditedURL from "./EditedUrl";
import { useTranslation } from "react-i18next";
import {
  RestfulClientErrors,
  RestfulClientProps,
  RestfulRequestProps,
  RestfulResponseProps,
} from "~/types";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { saveToLocalStorage } from "../../../utils/localStorage";
import ResponseSection from "../ResponseSection";

export default function RestfulClient(props: RestfulClientProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [restfulRequest, setRestfulRequest] = useState<RestfulRequestProps>(
    defaultRestfulRequestState,
  );
  const [restfulResponse, setRestfulResponse] = useState<RestfulResponseProps>(
    defaultRestfulResponseState,
  );
  const [restfulErrors, setRestfulErrors] = useState<RestfulClientErrors>(
    defaultRestfulErrorsState,
  );
  const [requestBody, setRequestBody] = useState(
    props.restfulRequest?.body ?? "",
  );
  const [requestUrl, setRequestUrl] = useState(
    props.restfulRequest?.endpointUrl ?? "",
  );
  const [requestMetod, setRequestMetod] = useState(
    props.restfulRequest?.method ?? "",
  );

  useEffect(() => {
    setRestfulRequest({
      ...restfulRequest,
      body: requestBody,
    });
  }, [requestBody]);

  useEffect(() => {
    setRestfulRequest({
      ...restfulRequest,
      method: requestMetod,
    });
  }, [requestMetod]);

  useEffect(() => {
    setRestfulRequest({
      ...restfulRequest,
      endpointUrl: requestUrl,
    });
  }, [requestUrl]);

  useEffect(() => {
    if (props.restfulRequest) setRestfulRequest(props.restfulRequest);
    if (props.restfulResponse) setRestfulResponse(props.restfulResponse);
  }, []);

  const sendRequest = async () => {
    resetErrors();
    const options = generateRequest(restfulRequest);
    if (
      options.errors.bodyError ||
      options.errors.endpointUrlError ||
      options.errors.methodError
    ) {
      setRestfulErrors(options.errors);
      return;
    }

    await fetch(restfulRequest.endpointUrl, options.body)
      .then((response) => {
        setRestfulResponse({
          ...restfulResponse,
          status: `${response.status}`,
        });
        return response.text();
      })
      .then((value) => {
        setRestfulResponse({
          ...restfulResponse,
          body: value,
        });
        const link = generateRestfulUrl(restfulRequest);
        saveToLocalStorage(requestMetod, link);
        navigate(link);
      })
      .catch(() => {
        return;
      });
  };

  const resetErrors = () => {
    setRestfulResponse({
      status: "",
      body: "",
    });
    setRestfulErrors({
      methodError: "",
      endpointUrlError: "",
      bodyError: "",
    });
  };

  return (
    <div className="flex flex-col items-center py-2.5 px-4 gap-2">
      <div>
        <span className="block w-fit">{t("request")}</span>
        <div className="flex flex-col justify-start gap-2 py-2.5 px-4 border border-black  rounded-lg w-fit">
          <MethodSelector
            id="restful-method"
            methods={restMethods}
            setMethod={setRequestMetod}
            defaultValue={restfulRequest.method}
          />
          {restfulErrors.methodError && (
            <div className="text-base text-red-500 w-fit">
              {restfulErrors.methodError}
            </div>
          )}
          <EndpointUrl
            id="restful-url"
            setEndpointUrl={setRequestUrl}
            defaultValue={restfulRequest.endpointUrl}
          />
          {restfulErrors.endpointUrlError && (
            <div className="text-base text-red-500 w-fit">
              {restfulErrors.endpointUrlError}
            </div>
          )}
          <EditedURL
            id="restful-url-edited"
            url={generateRestfulUrl(restfulRequest)}
          />
          <RequestHeaders
            id="restful-headers"
            setRequest={setRestfulRequest}
            request={restfulRequest}
          />
          <CodeEditor
            language="json"
            readonly={false}
            value={restfulRequest.body}
            id="restful-request-editor"
            setRequestBody={setRequestBody}
          />
          {restfulErrors.bodyError && (
            <div className="text-base text-red-500 w-fit">
              {restfulErrors.bodyError}
            </div>
          )}
        </div>
      </div>
      <button
        className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
        onClick={sendRequest}
        data-testid="restful-submit"
      >
        {t("request-send")}
      </button>
      <ResponseSection
        body={restfulResponse.body}
        status={restfulResponse.status || "-"}
      />
    </div>
  );
}
