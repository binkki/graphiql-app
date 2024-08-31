import { Outlet } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function AuthIndex() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="text-4xl text-center m-4">{t("greeting")}</h1>
      <div className="flex flex-col mx-auto ">
        <Outlet />
      </div>
    </>
  );
}
