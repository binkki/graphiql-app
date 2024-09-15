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

  if (!ready) return <div>{t("loading")}</div>;
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
          <div className="text-center text-2xl font-small m-0 mb-12">
            {t("app_description")}
          </div>
          <div className="text-center text-2xl font-small">
            {t("try_it_now")}
          </div>
          <div className="flex justify-center mb-[6.25rem]">
            <ul className="flex items-center justify-between h-24 gap-5">
              <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                <Link to={"/restful"}>Restful Client</Link>
              </li>
              <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                <Link to={"/GRAPHQL"}>Graphiql Client</Link>
              </li>
              <li className="border border-solid p-1.5 rounded-lg w-36 bg-[#ffe4c4] font-semibold flex justify-center hover:bg-[#d4b362]">
                <Link to={"/history"}>History</Link>
              </li>
            </ul>
          </div>
          <div className="text-center text-xl font-small mb-5">
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
      ) : (
        <>
          <h1 className="text-center text-2xl my-5">{t("greeting")}!</h1>
          <div className="flex flex-col items-center">
            <div className="text-center text-2xl font-small m-0 mb-12">
              {t("app_description")}
            </div>
            <div>
              <span>{t("please_follow_the_links")}</span>
              <Link
                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                to={"/signin"}
              >
                {t("please_signin")}{" "}
              </Link>
              {t("or")}{" "}
              <Link
                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                to={"/signup"}
              >
                {t("please_signout")}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
