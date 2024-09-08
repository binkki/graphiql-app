import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CodeEditor from "~/components/CodeEditor";
import { auth } from "~/firebase";

const templateResponse = {
  response: {
    body: "some data",
  },
};

export default function Graphiql() {
  const { t } = useTranslation();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  // const [query, setQuery] = useState<string>("query { }");
  const [response, setResponse] = useState<string>(
    JSON.stringify(templateResponse),
  );
  // const [variables, setVariables] = useState<string>("{}");
  const queryEditorRef = useRef<{ getValue: () => string } | null>(null);
  const variablesEditorRef = useRef<{ getValue: () => string } | null>(null);

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
      const json = await res.json();
      setResponse(JSON.stringify({ status: res.status, data: json }, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponse(
          JSON.stringify({ status: "Error", data: error.message }, null, 2),
        );
      }
    }
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
            <button onClick={addHeader}>Add a header</button>
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
          <button onClick={handleExecuteQuery}>Execute</button>
          <CodeEditor
            language="json"
            readonly={true}
            value={response}
            id="graphiql-response-editor"
          />
        </>
      ) : (
        <h2 className="text-center mb-12 mt-12">
          {t("you_must_login_or_register")}
        </h2>
      )}
    </>
  );
}
