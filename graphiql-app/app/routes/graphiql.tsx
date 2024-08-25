import CodeEditor from "~/components/CodeEditor";

const templateResponse = {
  response: {
    body: "some data",
  },
};

export default function Graphiql() {
  return (
    <>
      <CodeEditor
        title="Graphiql request editor"
        language="graphql"
        value="query { }"
        readonly={false}
        id="graphiql-request-editor"
      />
      <CodeEditor
        title="Graphiql response"
        language="json"
        readonly={true}
        value={JSON.stringify(templateResponse)}
        id="graphiql-response-editor"
      />
    </>
  );
}
