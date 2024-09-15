import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CodeEditor from "../components/Client/CodeEditor";
import { auth } from "../firebase";
import { buildGraphiQLUrl, decodeBase64 } from "../utils/encode";
import showToast from "../utils/toast";
import { saveToLocalStorage } from "../utils/localStorage";

export default function Graphiql() {
  const params = useParams();
  const decodedBody = decodeBase64(params.body || "");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const queryEditorRef = useRef<{
    getValue: () => string;
  } | null>(null);
  const variablesEditorRef = useRef<{ getValue: () => string } | null>(null);
  const [sdlEndpoint, setSdlEndpoint] = useState<string>("");
  const [showHeaders, setShowHeaders] = useState<{
    flag: boolean;
    text: string;
  }>({ flag: false, text: t("show_headers") });
  const [showVariables, setShowVariables] = useState<{
    flag: boolean;
    text: string;
  }>({ flag: false, text: t("show_variables") });

  let query = "query {}";
  let variables = "{}";

  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        return navigate("/");
      }
    });
    return () => listen();
  }, []);

  try {
    if (decodedBody) {
      const parsedBody = JSON.parse(decodedBody);
      query = parsedBody.query || "query {}";
      variables = parsedBody.variables || "{}";
    }
  } catch {
    query = "query {}";
    variables = "{}";
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => listen();
  }, []);

  useEffect(() => {
    if (params.endpoint) {
      const decodedEndpoint = decodeBase64(params.endpoint) || "";
      setEndpoint(decodedEndpoint);
    }
    const headersArray = Array.from(searchParams.entries()).map(
      ([key, value]) => ({
        key,
        value,
      }),
    );
    setHeaders(headersArray);
    const sdlEncoded = decodeBase64(searchParams.get("sdl") || "");
    setSdlEndpoint(sdlEncoded);
  }, []);

  const handleHeaderChange = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { key, value };
    setHeaders(newHeaders);
    changeURLonFocusOut();
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleExecuteQuery = async () => {
    const { graphiQLUrl } = getValuesForURL();
    if (!endpoint) {
      showToast("Please enter an endpoint URL", true);
    } else {
      saveToLocalStorage("GRAPHQL", graphiQLUrl);
      window.location.href = `${graphiQLUrl}`;
    }
  };

  function getValuesForURL() {
    const query = queryEditorRef.current?.getValue() || "";
    const variables = variablesEditorRef.current?.getValue() || "{}";
    const headersForQuery = {
      "Content-Type": "application/json",
      ...headers.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {},
      ),
    };
    const graphiQLUrl = buildGraphiQLUrl(
      endpoint,
      query,
      variables,
      headersForQuery,
      sdlEndpoint,
    );
    return { query, variables, headersForQuery, graphiQLUrl };
  }

  function changeURLonFocusOut() {
    const { graphiQLUrl } = getValuesForURL();
    window.history.replaceState(null, document.title, graphiQLUrl);
  }

  function toggleHeaders() {
    if (showHeaders.flag) {
      setShowHeaders({ flag: false, text: t("show_headers") });
    } else {
      setShowHeaders({ flag: true, text: t("hide_headers") });
    }
  }

  function toggleVariables() {
    if (showVariables.flag) {
      setShowVariables({ flag: false, text: t("show_variables") });
    } else {
      setShowVariables({ flag: true, text: t("hide_variables") });
    }
  }

  return (
    <>
      {authUser ? (
        <div className="my-8 mx-auto w-10/12 flex flex-col items-center py-2.5 px-4 gap-2">
          <div>
            <span className="block w-fit">{t("request")}</span>
            <div className="flex flex-col justify-start gap-2 py-2.5 px-4 border border-black  rounded-lg w-fit">
              <div>
                <label htmlFor="endpointInput">{t("EndpointURL")}</label>
                <input
                  type="text"
                  placeholder="Endpoint URL"
                  value={endpoint}
                  id="endpointInput"
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="ml-4 border border-gray-500 rounded-lg text-gray-600 text-base inline-block py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
                />
              </div>
              <div>
                <label htmlFor="sdlEndpointUrl">{t("sdlEndpointURL")}</label>
                <input
                  type="text"
                  placeholder="SDL Endpoint URL"
                  value={sdlEndpoint}
                  id="sdlEndpointUrl"
                  onChange={(e) => setSdlEndpoint(e.target.value)}
                  className="ml-4 border border-gray-500 rounded-lg text-gray-600 text-base inline-block py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
                />
              </div>
              <button
                className="inline-block bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
                onClick={toggleHeaders}
              >
                {showHeaders.text}
              </button>
              {showHeaders.flag && (
                <div>
                  {headers.map((header, index) => (
                    <div key={index}>
                      <input
                        placeholder="Header Key"
                        type="text"
                        value={header.key}
                        className="ml-4 border border-gray-500 rounded-lg text-gray-600 text-base inline-block py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
                        onChange={(e) =>
                          handleHeaderChange(
                            index,
                            e.target.value,
                            header.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        value={header.value}
                        placeholder="Header Value"
                        className="ml-4 border border-gray-500 rounded-lg text-gray-600 text-base inline-block py-2.5 px-4 w-auto focus:bg-gray-400 focus:text-white focus:outline-none focus:cursor-text hover:cursor-text"
                        onChange={(e) =>
                          handleHeaderChange(index, header.key, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    className="mt-4 bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
                    onClick={addHeader}
                  >
                    {t("add_header")}
                  </button>
                </div>
              )}
              <CodeEditor
                language="graphql"
                value={query}
                ref={queryEditorRef}
                readonly={false}
                id="graphiql-request-editor"
                onBlur={changeURLonFocusOut}
              />
              <button
                className="bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
                onClick={toggleVariables}
              >
                {showVariables.text}
              </button>
              {showVariables.flag && (
                <div className="mb-4">
                  <label htmlFor="graphiql-variables-editor">
                    {t("variables")}
                  </label>
                  <CodeEditor
                    language="json"
                    value={variables}
                    readonly={false}
                    id="graphiql-variables-editor"
                    ref={variablesEditorRef}
                  />
                </div>
              )}

              <button
                className="bg-blue-700 mx-auto rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
                onClick={handleExecuteQuery}
              >
                {t("execute")}
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      ) : (
        <h2 className="text-center mb-12 mt-12">
          {t("you_must_login_or_register")}
        </h2>
      )}
    </>
  );
}
