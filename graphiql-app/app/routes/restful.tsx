import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { i18nCookie } from "~/cookie";
import RestfulClient from "~/components/Client/RestfulClient/RestfulClient";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const locale = (await i18nCookie.parse(cookieHeader)) || "en";
  return json({ locale });
};

export default function Restful() {
  useLoaderData<typeof loader>();

  return <RestfulClient />;
}
