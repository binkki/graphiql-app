import { beforeEach, describe, expect, it, vi } from "vitest";
import { i18nCookie } from "../cookie";

describe("i18nCookie", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("handling of cookies", async () => {
    const request = new Request("http://localhost");
    const parsedCookie = await i18nCookie.parse(request.headers.get("Cookie"));
    expect(parsedCookie).toBeNull();
  });
});
