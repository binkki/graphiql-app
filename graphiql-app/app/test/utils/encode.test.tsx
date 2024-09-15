import { describe, expect, it } from "vitest";
import {
  buildGraphiQLUrl,
  decodeBase64,
  encodeBase64,
} from "../../utils/encode";

describe("encodeBase64", () => {
  it("should correctly encode a string to base64", () => {
    const input = "test string";
    const encoded = encodeBase64(input);
    expect(encoded).toBe("dGVzdCBzdHJpbmc=");
  });
});

describe("decodeBase64", () => {
  it("should correctly decode a base64 string", () => {
    const encoded = "dGVzdCBzdHJpbmc=";
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe("test string");
  });
});

describe("buildGraphiQLUrl", () => {
  it("should correctly build a GraphiQL URL with all parameters", () => {
    const endpoint = "http://localhost:4000/graphql";
    const query = "{ users { id name } }";
    const variables = "{}";
    const headers = { Authorization: "Bearer token" };
    const sdlEndpoint = "http://localhost:4000/sdl";

    const expectedUrl = `/GRAPHQL/${encodeBase64(endpoint)}/${encodeBase64(JSON.stringify({ query, variables }))}?Authorization=${encodeURIComponent("Bearer token")}&sdl=${encodeBase64(sdlEndpoint)}`;
    const url = buildGraphiQLUrl(
      endpoint,
      query,
      variables,
      headers,
      sdlEndpoint,
    );

    expect(url).toBe(expectedUrl);
  });

  it("should correctly build a GraphiQL URL without SDL endpoint", () => {
    const endpoint = "http://localhost:4000/graphql";
    const query = "{ users { id name } }";
    const variables = "{}";
    const headers = { Authorization: "Bearer token" };
    const sdlEndpoint = "";

    const expectedUrl = `/GRAPHQL/${encodeBase64(endpoint)}/${encodeBase64(JSON.stringify({ query, variables }))}?Authorization=${encodeURIComponent("Bearer token")}`;
    const url = buildGraphiQLUrl(
      endpoint,
      query,
      variables,
      headers,
      sdlEndpoint,
    );

    expect(url).toBe(expectedUrl);
  });
});
