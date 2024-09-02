import CodeEditor from "~/components/CodeEditor";
import Header from "../components/Header";

const templateResponse = {
  response: {
    body: "some data",
  },
};

export default function Graphiql() {
  return (
    <>
      <Header />
      <CodeEditor
        language="graphql"
        value="query { }"
        readonly={false}
        id="graphiql-request-editor"
      />
      <CodeEditor
        language="json"
        readonly={true}
        value={JSON.stringify(templateResponse)}
        id="graphiql-response-editor"
      />
    </>
  );
}
