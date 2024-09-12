import { Link, useLocation } from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "~/firebase";
import signOutImgWhite from "../../public/sing-out-white.svg";
import signOutImgBlack from "../../public/sing-out.svg";
import i18nextOptions from "../i18nextOptions";
import UserSingOut from "./UserSingOut/UserSingOut";

export const handle = {
  i18n: ["common"],
};

export default function Header() {
  const lngs = i18nextOptions.supportedLngs;
  const { t, ready, i18n } = useTranslation();
  const location = useLocation();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("h-[60px]");
          setIsScrolled(true);
        } else {
          header.classList.remove("h-[60px]");
          setIsScrolled(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!ready) return <div>Loading...</div>;
  return (
    <header
      id="header"
      className="flex flex-wrap justify-between content-center h-24 p-4 sticky text-3xl text-white bg-gradient-to-t from-gray-300 to-black top-0 transition-all duration-300"
    >
      <h1>
        <Link
          className={`font-bold text-[24px] text-lg text-center self-center transition-colors duration-300 mr-5 ${isScrolled ? "text-white hover:text-[#b4b3b3]" : "text-black hover:text-white"}`}
          to="/"
        >
          Graphiql App
        </Link>
      </h1>
      <div>
        {lngs.map((lng) => (
          <Link
            key={lng}
            className={`font-normal text-xl mr-2 last:mr-0 transition-colors duration-300 ${
              i18n.resolvedLanguage === lng
                ? `font-extrabold ${isScrolled ? "text-white hover:text-[#c3c3c3]" : "text-black hover:text-white"}`
                : `text-lg font-semibold text-center self-center transition-colors duration-300 mr-5 ${
                    isScrolled
                      ? "text-white hover:text-[#c3c3c3]"
                      : "text-black hover:text-white"
                  }`
            }`}
            to={`${location.pathname}?lng=${lng}`}
          >
            {lng.toUpperCase()}
          </Link>
        ))}
      </div>

      {!authUser ? (
        <div className="flex items-center">
          <Link
            className={`text-lg font-semibold text-center self-center transition-colors duration-300 mr-5 ${isScrolled ? "text-white hover:text-[#b4b3b3]" : "text-black hover:text-white"}`}
            to="/signin"
          >
            {t("signin")}
          </Link>
          <Link
            className={`text-lg font-semibold text-center self-center transition-colors duration-300 mr-5 ${isScrolled ? "text-white hover:text-[#b4b3b3]" : "text-black hover:text-white"}`}
            to="/signup"
          >
            {t("signup")}
          </Link>
        </div>
      ) : (
        <div className="flex items-center">
          <Link
            className={`text-lg font-semibold text-center self-center transition-colors duration-300 mr-5 ${isScrolled ? "text-white hover:text-[#b4b3b3]" : "text-black hover:text-white"}`}
            to="/restful"
          >
            Restful Client
          </Link>
          <Link
            className={`text-lg font-semibold text-center self-center transition-colors duration-300 mr-5 ${isScrolled ? "text-white hover:text-[#b4b3b3]" : "text-black hover:text-white"}`}
            to="/GRAPHQL"
          >
            Graphiql Client
          </Link>
          <Link
            className={`text-lg font-semibold text-center self-center transition-colors duration-300 mr-5 ${isScrolled ? "text-white hover:text-[#b4b3b3]" : "text-black hover:text-white"}`}
            to="/history"
          >
            History
          </Link>
          <UserSingOut
            src={isScrolled ? signOutImgWhite : signOutImgBlack}
            alt={"Sign Out"}
            title={"Sign Out"}
          />
        </div>
      )}
    </header>
  );
}
