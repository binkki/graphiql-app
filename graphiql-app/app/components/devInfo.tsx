import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function DevInfo() {
  const { t } = useTranslation();
  return (
    <>
      <div className="text-center text-xl font-small my-10">
        <span>{t("Developed_by")}</span>{" "}
        <Link to={"https://rs.school/courses/reactjs"}>{t("course")}</Link>{" "}
        <span>{t("by")}</span>
      </div>
      <div className="flex justify-center mb-[6.25rem] text-xl text-blue-500 gap-10">
        <Link to={"https://github.com/binkki"}>{t("Kate")}</Link>
        <Link to={"https://github.com/Jofetta"}>{t("Tania")}</Link>
        <Link to={"https://github.com/SpiriT-L"}>{t("Leonid")}</Link>
      </div>
    </>
  );
}
