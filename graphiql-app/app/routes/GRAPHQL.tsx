import { Outlet } from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CodeEditor from "~/components/CodeEditor";
import { auth } from "~/firebase";
import { buildGraphiQLUrl } from "~/utils/encode";

export default function Graphiql() {
  const { t } = useTranslation();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const queryEditorRef = useRef<{ getValue: () => string } | null>(null);
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
    window.location.href = `${graphiQLUrl}`;
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
        <div className="my-8 mx-auto w-10/12 flex flex-col gap-2">
          <div>
            <label htmlFor="endpointInput">{t("EndpointURL")}</label>
            <input
              type="text"
              placeholder="Endpoint URL"
              value={endpoint}
              id="endpointInput"
              onChange={(e) => setEndpoint(e.target.value)}
              className="ml-2 inline-block w-1/2"
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
              className="ml-2 inline-block w-1/2"
            />
          </div>
          <button className="inline-block w-64" onClick={toggleHeaders}>
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
                    onChange={(e) =>
                      handleHeaderChange(index, e.target.value, header.value)
                    }
                  />
                  <input
                    type="text"
                    value={header.value}
                    placeholder="Header Value"
                    onChange={(e) =>
                      handleHeaderChange(index, header.key, e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                onClick={addHeader}
              >
                {t("add_header")}
              </button>
            </div>
          )}

          <CodeEditor
            language="graphql"
            value=""
            ref={queryEditorRef}
            readonly={false}
            id="graphiql-request-editor"
            onBlur={changeURLonFocusOut}
          />
          <button className="inline-block w-64" onClick={toggleVariables}>
            {showVariables.text}
          </button>
          {showVariables.flag && (
            <div className="mb-4">
              <label htmlFor="graphiql-variables-editor">
                {t("variables")}
              </label>
              <CodeEditor
                language="json"
                value="{}"
                readonly={false}
                id="graphiql-variables-editor"
                ref={variablesEditorRef}
              />
            </div>
          )}

          <button
            className="h-10 px-5 m-2 inline-block w-48 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
            onClick={handleExecuteQuery}
          >
            {t("execute")}
          </button>
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
