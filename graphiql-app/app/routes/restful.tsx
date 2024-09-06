import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CodeEditor from "~/components/CodeEditor";
import { auth } from "~/firebase";

const templateResponse = {
  response: {
    body: "some data",
  },
};

export default function Restful() {
  const [authUser, setAuthUser] = useState<User | null>(null);
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
  const { t } = useTranslation();

  return (
    <>
      {authUser ? (
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
      ) : (
        <>
          <h2 className="text-center mb-12 mt-12">
            {t("you_must_login_or_register")}
          </h2>
        </>
      )}
    </>
  );
}
