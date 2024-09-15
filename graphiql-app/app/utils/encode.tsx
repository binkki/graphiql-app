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
  sdlEndpoint: string,
) {
  const endpointBase64 = encodeBase64(endpoint);
  const bodyBase64 = encodeBase64(JSON.stringify({ query, variables }));
  const sdlEndpointBase64 =
    sdlEndpoint && sdlEndpoint !== endpoint ? encodeBase64(sdlEndpoint) : "";

  const headerParams = Object.keys(headers)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(headers[key])}`,
    )
    .join("&");

  return `/GRAPHQL/${endpointBase64}/${bodyBase64}${
    headerParams ? `?${headerParams}` : ""
  }${
    sdlEndpointBase64
      ? `${headerParams ? "&" : "?"}sdl=${sdlEndpointBase64}`
      : ""
  }`;
}
