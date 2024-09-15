import { json, LoaderFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { i18nCookie } from "../cookie";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const locale = (await i18nCookie.parse(cookieHeader)) || "en";
  return json({ locale });
};

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <span data-testid="404-error">{t("page-not-found")}</span>
    </div>
  );
}
