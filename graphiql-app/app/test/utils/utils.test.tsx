import { describe, expect, it } from "vitest";
import {
  decodeFromBase64,
  decodeUrlFromBase64,
  generateRequest,
  generateRestfulUrl,
  isMethodBody,
  validateBodyIsJson,
  validateLink,
} from "../../utils/utils";
import { defaultHeaders } from "../../utils/constants";

describe("utils", () => {
  it("isMethodBody returns true for methods that required body, otherwise false", async () => {
    const dontNeedBody = ["GET", "CONNECT", "OPTIONS", "TRACE", "HEAD"];
    const needBody = ["POST", "PUT", "PATCH", "DELETE"];
    needBody.forEach((x: string) => {
      expect(isMethodBody(x)).toBe(true);
    });
    dontNeedBody.forEach((x: string) => {
      expect(isMethodBody(x)).toBe(false);
    });
  });

  it("validateLink returns true if string is link", async () => {
    const correctLink = "http://app.rs.school/";
    const unvalidLink = "unvalid-link";
    const emptyLink = "";
    expect(validateLink(correctLink)).toBe(true);
    expect(validateLink(unvalidLink)).toBe(false);
    expect(validateLink(emptyLink)).toBe(false);
  });

  it("validateBodyIsJson returns true if string can be parsed to json", async () => {
    const correctJson = JSON.stringify({ test: "test" });
    const unvalidJson = "unvalid-json";
    const emptyJson = "";
    expect(validateBodyIsJson(correctJson)).toBe(true);
    expect(validateBodyIsJson(unvalidJson)).toBe(false);
    expect(validateBodyIsJson(emptyJson)).toBe(false);
  });

  it("decodeFromBase64 returns valid result", async () => {
    const testString = "Hello World";
    const encodedString = btoa(testString);
    expect(decodeFromBase64(encodedString)).toBe(testString);
  });

  it("decodeUrlFromBase64 returns valid result", async () => {
    const encodedUrl =
      "http://localhost:5173/GET/aHR0cHM6Ly9zd2FwaS5kZXYvYXBpLw==/e30=?Content-Type=YXBwbGljYXRpb24vanNvbg==";
    const decodedUrl = JSON.parse(decodeUrlFromBase64(encodedUrl));
    expect(decodedUrl.method).toBe("GET");
    expect(decodedUrl.endpointUrl).toBe("https://swapi.dev/api/");
    expect(decodedUrl.body).toBe("");
  });

  it("generateRestfulUrl generate valid request link", async () => {
    const request = {
      method: "GET",
      body: "",
      endpointUrl: "https://swapi.dev/api/",
      headers: defaultHeaders,
    };
    const testUrl =
      "/GET/aHR0cHM6Ly9zd2FwaS5kZXYvYXBpLw==/e30=?Content-Type=YXBwbGljYXRpb24vanNvbg==";
    expect(generateRestfulUrl(request)).toBe(testUrl);
  });

  it("generateRequest returns valid request oprions", async () => {
    const dontNeedBody = ["GET", "CONNECT", "OPTIONS", "TRACE", "HEAD"];
    const needBody = ["POST", "PUT", "PATCH", "DELETE"];
    needBody.forEach((x: string) => {
      const optionsWithBody = {
        method: x,
        headers: {},
        body: "",
      };
      const request = {
        method: x,
        body: "",
        endpointUrl: "https://swapi.dev/api/",
        headers: defaultHeaders,
      };
      const options = generateRequest(request);
      expect(JSON.stringify(optionsWithBody)).toBe(
        JSON.stringify(options.body),
      );
    });
    dontNeedBody.forEach((x: string) => {
      const optionsWithBody = {
        method: x,
        headers: {},
      };
      const request = {
        method: x,
        body: "",
        endpointUrl: "https://swapi.dev/api/",
        headers: defaultHeaders,
      };
      const options = generateRequest(request);
      expect(JSON.stringify(optionsWithBody)).toBe(
        JSON.stringify(options.body),
      );
    });
  });
});
