export function encodeBase64(str: string) {
  return Buffer.from(str).toString("base64");
}

export function decodeBase64(str: string) {
  return Buffer.from(str, "base64").toString("utf-8");
}

export function buildGraphiQLUrl(
  endpoint: string,
  query: string,
  variables: string,
  headers: Record<string, string>,
) {
  const endpointBase64 = encodeBase64(endpoint);
  const bodyBase64 = encodeBase64(JSON.stringify({ query, variables }));

  const headerParams = Object.keys(headers)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(headers[key])}`,
    )
    .join("&");

  return `/GRAPHQL/${endpointBase64}/${bodyBase64}${headerParams ? `?${headerParams}` : ""}`;
}
