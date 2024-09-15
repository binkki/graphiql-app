export function saveToLocalStorage(method: string, url: string) {
  let requests: Requests[] = [];
  const ls = localStorage.getItem("requests");
  if (ls) {
    requests = JSON.parse(ls);
  }
  requests.push({ method: method, url: url });
  localStorage.setItem("requests", JSON.stringify(requests));
}

export function getHistoryFromLocalStorage() {
  const ls = localStorage.getItem("requests");
  if (ls) return JSON.parse(ls);
  return null;
}

export type Requests = {
  method: string;
  url: string;
};
