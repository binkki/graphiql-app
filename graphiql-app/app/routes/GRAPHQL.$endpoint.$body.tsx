import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { decodeBase64 } from "~/utils/encode";
import { getIntrospectionQuery } from "graphql";
import { i18nCookie } from "~/cookie";
import { useTranslation } from "react-i18next";

export const loader: LoaderFunction = async ({ params, request }) => {
  const endpoint = decodeBase64(params.endpoint || "");
  const body = decodeBase64(params.body || "");
  const { query, variables } = JSON.parse(body);
  const url = new URL(request.url);
  const headers = Object.fromEntries(
    [...url.searchParams.entries()].filter(
      ([key]) => key !== "sdl" && key !== "lng",
    ),
  );
  const sdlEncoded = url.searchParams.get("sdl");
  const sdlEndpointDiff = sdlEncoded ? decodeBase64(sdlEncoded) : "";
  const cookieHeader = request.headers.get("Cookie");
  const locale = (await i18nCookie.parse(cookieHeader)) || "en";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });

    const jsonResponse = await response.json();

    let sdlDocs: string | null = null;

    if (!jsonResponse.errors) {
      const sdlEndpoint = sdlEndpointDiff ? sdlEndpointDiff : `${endpoint}?sdl`;
      const sdlResponse = await fetch(sdlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ query: getIntrospectionQuery() }),
      });

      if (sdlResponse.ok) {
        sdlDocs = await sdlResponse.json();
      }
    }
    return json({ jsonResponse, sdlDocs, locale });
  } catch (err) {
    return json({ err, locale });
  }
};

export default function GraphiQLResponse() {
  const { jsonResponse, sdlDocs, err } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("GraphQLResponse")}</h1>
      <pre>
        {jsonResponse ? JSON.stringify(jsonResponse, null, 2) : err.message}
      </pre>
      {sdlDocs && (
        <div>
          <h2>{t("sdlDocs")}</h2>
          <pre>{JSON.stringify(sdlDocs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
