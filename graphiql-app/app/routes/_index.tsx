import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "~/firebase";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { t, ready } = useTranslation();
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
    <>
      {authUser ? (
        <>
          <h2 className="text-center text-2xl font-bold pt-12 mb-5">
            {t("greeting")},
          </h2>
          <div className="text-center text-2xl font-medium m-0 mb-12">
            {authUser.email}!
          </div>
          <div className="flex justify-center mb-[6.25rem]">
            <ul className="flex items-center justify-between h-24 gap-5">
              <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                <Link to={"/restful"}>Restful Client</Link>
              </li>
              <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                <Link to={"/graphiql"}>Graphiql Client</Link>
              </li>
              <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                <Link to={"/history"}>History</Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-center text-2xl my-5">{t("greeting")}</h1>
          <div className="flex flex-col items-center">
            <h2>{t("please_follow_the_links")}</h2>
            <div>
              <Link
                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                to={"/signin"}
              >
                {t("signin")}{" "}
              </Link>
              {t("or")}{" "}
              <Link
                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                to={"/signup"}
              >
                {t("signup")}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
