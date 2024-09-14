import { useEffect, useRef } from "react";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { CodeEditorProps } from "~/types";
import { useTranslation } from "react-i18next";

const CodeEditor = (props: CodeEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { t } = useTranslation();

  const formatInput = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      const wrapper = document.getElementById(props.id);
      if (wrapper && !wrapper.children.length) {
        const monacoEditor = monaco.editor.create(wrapper, {
          value: props.value,
          language: props.language,
          minimap: {
            enabled: false,
          },
          overviewRulerBorder: false,
          formatOnPaste: true,
          formatOnType: true,
          contextmenu: false,
        });
        monacoEditor.layout({ width: 400, height: 200 });
        setTimeout(() => {
          monacoEditor
            .getAction("editor.action.formatDocument")
            ?.run()
            .then(() => {
              monacoEditor.updateOptions({ readOnly: props.readonly });
            });
        }, 1);
        if (monacoEditor) editorRef.current = monacoEditor;
        monacoEditor.onDidBlurEditorWidget(() => {
          if (props.setRequestBody)
            props.setRequestBody(monacoEditor.getValue());
        });
      } else {
        try {
          editorRef.current
            ?.getModel()
            ?.setValue(
              props.value
                ? JSON.stringify(JSON.parse(props.value), null, 4)
                : "",
            );
          editorRef.current?.revealLine(1);
        } catch {
          return;
        }
      }
    });
  }, [props.value]);

  return (
    <>
      <div id={props.id} />
      <div>
        {!props.readonly && (
          <button
            className="inline-flex items-center bg-blue-500 rounded-lg text-white text-base h-10 px-4 w-fit hover:bg-blue-600"
            onClick={formatInput}
          >
            {t("format")}
          </button>
        )}
      </div>
    </>
  );
};

export default CodeEditor;
