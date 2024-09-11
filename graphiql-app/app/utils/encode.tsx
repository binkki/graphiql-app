export function encodeBase64(str: string) {
  return btoa(str);
}

export function decodeBase64(str: string) {
  return atob(str);
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
