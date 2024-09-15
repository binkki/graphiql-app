import { describe, it, expect } from "vitest";
import {
  getHistoryFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/localStorage";

describe("local storage", () => {
  it("should save to local storage and loads data succesfully", () => {
    const oldHistory = getHistoryFromLocalStorage();
    const newRequest = {
      method: "GET",
      url: "/GET/aHR0cHM6Ly9zd2FwaS5kZXYvYXBpLw==/e30=?Content-Type=YXBwbGljYXRpb24vanNvbg==",
    };

    saveToLocalStorage(newRequest.method, newRequest.url);

    const newHistory = getHistoryFromLocalStorage();

    expect(JSON.stringify(newHistory)).toBe(JSON.stringify([newRequest]));
    expect(oldHistory).toBe(null);
  });
});
