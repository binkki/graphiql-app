import { Outlet } from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
// import { getIntrospectionQuery } from "graphql";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CodeEditor from "~/components/CodeEditor";
import { auth } from "~/firebase";
import { buildGraphiQLUrl } from "~/utils/encode";

// const templateResponse = {
//   response: {
//     body: "some data",
//   },
// };

export default function Graphiql() {
  const { t } = useTranslation();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  // const [response, setResponse] = useState<string>(
  //   JSON.stringify(templateResponse),
  // );
  const queryEditorRef = useRef<{ getValue: () => string } | null>(null);
  const variablesEditorRef = useRef<{ getValue: () => string } | null>(null);
  const [sdlEndpoint, setSdlEndpoint] = useState<string>("");

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
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleExecuteQuery = async () => {
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
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers.reduce(
            (acc, { key, value }) => ({ ...acc, [key]: value }),
            {},
          ),
        },
        body: JSON.stringify({
          query,
          variables: variables ? JSON.parse(variables) : undefined,
        }),
      });
      if (res.ok) window.location.href = `${graphiQLUrl}`;
    } catch (err) {
      console.log(err);
    }
    // Redirect the user to the URL, so the query is executed
    // try {
    //   const res = await fetch(endpoint, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       ...headers.reduce(
    //         (acc, { key, value }) => ({ ...acc, [key]: value }),
    //         {},
    //       ),
    //     },
    //     body: JSON.stringify({
    //       query,
    //       variables: variables ? JSON.parse(variables) : undefined,
    //     }),
    //   });
    //   const json = await res.json();
    //   setResponse(JSON.stringify({ status: res.status, data: json }, null, 2));
    //   if (res.ok) {
    //     const sdlRes = await fetch(sdlEndpoint || `${endpoint}?sdl`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         query: getIntrospectionQuery(),
    //       }),
    //     });
    //     const sdlText = await sdlRes.json();
    //     if (sdlRes.ok) {
    //       setDocumentation(JSON.stringify(sdlText, null, 2));
    //       setShowDocs(true);
    //     }
    //   }
    // } catch (error: unknown) {
    //   if (error instanceof Error) {
    //     setResponse(
    //       JSON.stringify({ status: "Error", data: error.message }, null, 2),
    //     );
    //   }
    // }
  };

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
          <div>
            <label htmlFor="headers">Headers:</label>
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
          <CodeEditor
            language="graphql"
            value=""
            ref={queryEditorRef}
            readonly={false}
            id="graphiql-request-editor"
          />
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
          <button
            className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
            onClick={handleExecuteQuery}
          >
            Execute
          </button>
          {/* <CodeEditor
            language="json"
            readonly={true}
            value={response}
            id="graphiql-response-editor"
          /> */}
          {/* <pre>{response}</pre> */}
          <Outlet />
          {/* {showDocs && (
            <div className="mt-4">
              <h3>Documentation</h3>
              <pre>{documentation}</pre>
            </div>
          )} */}
        </>
      ) : (
        <h2 className="text-center mb-12 mt-12">
          {t("you_must_login_or_register")}
        </h2>
      )}
    </>
  );
}
