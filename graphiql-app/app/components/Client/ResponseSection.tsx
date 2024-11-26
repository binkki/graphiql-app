import { useTranslation } from "react-i18next";
import CodeEditor from "./CodeEditor";
import { RestfulResponseProps } from "~/types";

export default function ResponseSection(props: RestfulResponseProps) {
  const { t } = useTranslation();
  return (
    <div>
      <span>{t("response")}</span>
      <div className="flex flex-col justify-start gap-2 py-2.5 px-4 border border-black rounded-lg w-fit hover:cursor-default">
        <div
          className="hover:cursor-default"
          data-testid="restful-response-status"
        >
          {t("response-status")}: {props.status.length ? props.status : "-"}
        </div>
        <CodeEditor
          language="json"
          readonly={true}
          value={props.body}
          id="restful-response-editor"
        />
      </div>
    </div>
  );
}
