import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18nextOptions from "../i18nextOptions";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "~/firebase";

export const handle = {
  i18n: ["common"],
};

export default function Header() {
  const lngs = i18nextOptions.supportedLngs;
  const { ready, i18n } = useTranslation();
  const location = useLocation();

  if (!ready) return <div>Loading...</div>;
  return (
    <header className="flex justify-between h-16 p-4 sticky text-3xl text-white bg-gradient-to-t from-gray-300 to-black">
      <h1>Graphiql App</h1>
      <div>
        {lngs.map((lng) => (
          <Link
            key={lng}
            style={{
              marginRight: 5,
              fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
            }}
            to={`${location.pathname}?lng=${lng}`}
          >
            {lng.toUpperCase()}
          </Link>
        ))}
      </div>
    </header>
  );
}
