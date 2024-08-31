import CodeEditor from "~/components/CodeEditor";
import Header from "../components/Header";
import Footer from "../components/Footer";

const templateResponse = {
  response: {
    body: "some data",
  },
};

export default function Restful() {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
