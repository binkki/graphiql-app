import { RemixI18Next } from "remix-i18next/server";
import i18nextOptions from "./i18nextOptions";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { i18nCookie } from "./cookie";

export default new RemixI18Next({
  detection: {
    cookie: i18nCookie,
    supportedLanguages: i18nextOptions.supportedLngs,
    fallbackLanguage: i18nextOptions.fallbackLng,
  },
  i18next: {
    backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: Backend,
});