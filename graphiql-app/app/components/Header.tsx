import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18nextOptions from "../i18nextOptions";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/firebase";
import { useState, useEffect } from "react";
import UserSingOut from "./UserSingOut/UserSingOut";

export const handle = {
  i18n: ["common"],
};

export default function Header() {
  const lngs = i18nextOptions.supportedLngs;
  const { t, ready, i18n } = useTranslation();
  const location = useLocation();
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

  if (!ready) return <div>Loading...</div>;
  return (
    <header className="flex flex-wrap justify-between content-center h-24 p-4 sticky text-3xl text-white bg-gradient-to-t from-gray-300 to-black">
      <h1 className="p-8">Graphiql App</h1>
      <div className="p-8">
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
      {!authUser ? (
        <div className="flex">
          <Link
            className="text-2xl m-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center hover:bg-gradient-to-tr hover:from-black hover:via-gray-500 hover:to-gray-300"
            to="/signin"
          >
            {t("signin")}
          </Link>
          <Link
            className="text-2xl m-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center hover:bg-gradient-to-tr hover:from-black hover:via-gray-500 hover:to-gray-300"
            to="/signup"
          >
            {t("signup")}
          </Link>
        </div>
      ) : (
        <div className="flex">
          <Link
            className="text-2xl m-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center hover:bg-gradient-to-tr hover:from-black hover:via-gray-500 hover:to-gray-300"
            to="/"
          >
            {t("home_page")}
          </Link>
          <UserSingOut />
        </div>
      )}
    </header>
  );
}
