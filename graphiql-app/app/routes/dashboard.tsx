import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import UserSingOut from "~/components/UserSingOut/UserSingOut";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t("your_profile")}</h2>
      <Link to="/">{t("home_page")}</Link>
      <UserSingOut />
    </>
  );
}
