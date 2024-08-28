import CodeEditor from "~/components/CodeEditor";

const templateResponse = {
  response: {
    body: "some data",
  },
};

export default function Restful() {
  return (
    <>
      <CodeEditor
        language="json"
        readonly={false}
        value=""
        id="restful-request-editor"
      />
      <CodeEditor
        language="json"
        readonly={true}
        value={JSON.stringify(templateResponse)}
        id="restful-response-editor"
      />
    </>
  );
}
