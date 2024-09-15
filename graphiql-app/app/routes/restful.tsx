import { useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { i18nCookie } from "~/cookie";
import RestfulClient from "~/components/Client/RestfulClient/RestfulClient";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "~/firebase";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const locale = (await i18nCookie.parse(cookieHeader)) || "en";
  return json({ locale });
};

export default function Restful() {
  useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user) {
        return navigate("/");
      }
    });
    return () => listen();
  }, []);

  return <RestfulClient />;
}
