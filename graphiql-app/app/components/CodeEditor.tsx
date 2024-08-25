import React, { Suspense } from "react";
const Editor = React.lazy(() => import("@monaco-editor/react"));

type CodeEditorProps = {
  title: string;
  language: string;
  readonly: boolean;
  value: string;
  id: string;
};

export default function CodeEditor(props: CodeEditorProps) {
  return (
    <Suspense>
      <div>{props.title}</div>
      <Editor
        width="350px"
        height="100px"
        language={props.language}
        value={props.value ?? ""}
        loading
        options={{
          readOnly: props.readonly,
          minimap: {
            enabled: false,
          },
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </Suspense>
  );
}
