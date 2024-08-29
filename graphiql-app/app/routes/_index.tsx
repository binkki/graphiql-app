import { type MetaFunction, json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  return json({
    lngs: {
      en: { nativeName: "English" },
      ru: { nativeName: "Русский" },
    },
  });
};

export default function Index() {
  const { t, ready } = useTranslation();

  if (!ready) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <h1>{t("greeting")}</h1>
      <Link to={"/signin"}>Sign In</Link>
      <Link to={"/signup"}>Sign Up</Link>
      <Link to={"/restful"}>Restful Client</Link>
      <Link to={"/graphiql"}>Graphiql Client</Link>
    </>
  );
}
