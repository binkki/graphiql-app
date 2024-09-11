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
  }>({ flag: false, text: "Show Headers" });
  const [showVariables, setShowVariables] = useState<{
    flag: boolean;
    text: string;
  }>({ flag: false, text: "Show Variables" });

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
    const { query, variables, headersForQuery, graphiQLUrl } =
      getValuesForURL();
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { ...headersForQuery },
        body: JSON.stringify({
          query,
          variables: variables ? JSON.parse(variables) : undefined,
        }),
      });
      if (res.ok) {
        window.location.href = `${graphiQLUrl}`;
      }
    } catch (err) {
      console.log(err);
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
    );
    return { query, variables, headersForQuery, graphiQLUrl };
  }

  function changeURLonFocusOut() {
    const { graphiQLUrl } = getValuesForURL();
    window.history.replaceState(null, document.title, graphiQLUrl);
  }

  function toggleHeaders() {
    if (showHeaders.flag) {
      setShowHeaders({ flag: false, text: "Show Headers" });
    } else {
      setShowHeaders({ flag: true, text: "Hide Headers" });
    }
  }

  function toggleVariables() {
    if (showVariables.flag) {
      setShowVariables({ flag: false, text: "Show Variables" });
    } else {
      setShowVariables({ flag: true, text: "Hide Variables" });
    }
  }

  return (
    <>
      {authUser ? (
        <>
          <div>
            <label htmlFor="endpointInput">Endpoint URL:</label>
            <input
              type="text"
              placeholder="Endpoint URL"
              value={endpoint}
              id="endpointInput"
              onChange={(e) => setEndpoint(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="sdlEndpointUrl">SDL Endpoint URL</label>
            <input
              type="text"
              placeholder="SDL Endpoint URL"
              value={sdlEndpoint}
              id="sdlEndpointUrl"
              onChange={(e) => setSdlEndpoint(e.target.value)}
            />
          </div>
          <button onClick={toggleHeaders}>{showHeaders.text}</button>
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
                Add a header
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
          <button onClick={toggleVariables}>{showVariables.text}</button>
          {showVariables.flag && (
            <div className="mb-4">
              <label htmlFor="graphiql-variables-editor">Variables:</label>
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
            className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
            onClick={handleExecuteQuery}
          >
            Execute
          </button>
          <Outlet />
        </>
      ) : (
        <h2 className="text-center mb-12 mt-12">
          {t("you_must_login_or_register")}
        </h2>
      )}
    </>
  );
}
