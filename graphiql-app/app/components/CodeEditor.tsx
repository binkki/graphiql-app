import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { useTranslation } from "react-i18next";

type CodeEditorProps = {
  language: string;
  readonly: boolean;
  value: string;
  id: string;
  onBlur?: () => void;
};

const CodeEditor = forwardRef((props: CodeEditorProps, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { t } = useTranslation();

  const formatInput = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue(),
  }));

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
        monacoEditor.onDidBlurEditorText(() => {
          if (!props.readonly && props.onBlur) {
            props.onBlur();
          }
        });
        setTimeout(() => {
          monacoEditor
            .getAction("editor.action.formatDocument")
            ?.run()
            .then(() => {
              monacoEditor.updateOptions({ readOnly: props.readonly });
            });
        }, 1);
        if (monacoEditor) editorRef.current = monacoEditor;
      }
    });
  }, []);

  return (
    <>
      <div>
        {!props.readonly && (
          <button
            className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
            onClick={formatInput}
          >
            {t("format")}
          </button>
        )}
      </div>
      <div id={props.id} />
    </>
  );
});

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
