import { Outlet } from "@remix-run/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

export default function AuthIndex() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <h1 className="text-4xl text-center m-4">{t("greeting")}</h1>
      <div className="flex flex-col mx-auto ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
