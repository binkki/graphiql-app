import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../routes/_index";

export const handle = {
  i18n: ["common"],
};

export default function Header() {
  const { lngs } = useLoaderData<typeof loader>();
  const { ready, i18n } = useTranslation();

  if (!ready) return <div>Loading...</div>;
  return (
    <header className="flex justify-between h-16 p-4 sticky text-3xl text-white bg-gradient-to-t from-gray-300 to-black">
      <h1>Graphiql App</h1>
      <div>
        {Object.keys(lngs).map((lng) => (
          <Link
            key={lng}
            style={{
              marginRight: 5,
              fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
            }}
            to={`/?lng=${lng}`}
          >
            {lng.toUpperCase()}
          </Link>
        ))}
      </div>
    </header>
  );
}
