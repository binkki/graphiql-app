import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserSingOut from "~/components/UserSingOut/UserSingOut";
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
          <h1>
            {t("greeting")}, {authUser.email}!
          </h1>
          <div>
            <div>
              <Link to={"/restful"}>Restful Client</Link>
            </div>
            <div>
              <Link to={"/GRAPHQL"}>Graphiql Client</Link>
            </div>
          </div>
          <UserSingOut />
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
