import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { decodeBase64 } from "~/utils/encode";
import { getIntrospectionQuery } from "graphql";
import showToast from "~/utils/toast";
type LoaderData = {
  jsonResponse: unknown;
  sdlDocs: string | null;
};

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
    return json<LoaderData>({ jsonResponse, sdlDocs });
  } catch (err) {
    if (err instanceof Error) showToast(err.message, true);
  }
};

export default function GraphiQLResponse() {
  const { jsonResponse, sdlDocs } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>GraphiQL Response</h1>
      <pre>{JSON.stringify(jsonResponse, null, 2)}</pre>
      {sdlDocs && (
        <div>
          <h2>SDL Documentation</h2>
          <pre>{JSON.stringify(sdlDocs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
