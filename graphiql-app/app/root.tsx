import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import "./tailwind.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthCheck from "./components/AuthCheck/AuthCheck";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "./i18n.server";
import { i18nCookie } from "./cookie";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  const t = await i18next.getFixedT(request, "common");
  const title = t("title");
  return json(
    { locale, title },
    {
      headers: { "Set-Cookie": await i18nCookie.serialize(locale) },
    },
  );
}

export const handle = {
  i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();

  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen">
        <AuthCheck>
          <Header />
          {children}
          <Footer />
        </AuthCheck>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  return <Outlet context={locale} />;
}
