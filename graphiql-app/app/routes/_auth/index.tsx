import { Outlet, useNavigate } from "@remix-run/react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "~/firebase";

export default function AuthIndex() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        return navigate("/");
      }
    });
    return () => listen();
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center m-4">{t("greeting")}</h1>
      <div className="flex flex-col mx-auto ">
        <Outlet />
      </div>
    </>
  );
}
