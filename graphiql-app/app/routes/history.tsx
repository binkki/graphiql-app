import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "~/firebase";

export default function History() {
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
          <h1>History</h1>
        </>
      ) : (
        <h2 className="text-center mb-12 mt-12">
          {t("you_must_login_or_register")}
        </h2>
      )}
    </>
  );
}
