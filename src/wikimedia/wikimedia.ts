import rp from "request-promise-native";

export class Wikimedia {
  endpoint = "https://en.wikipedia.org/w/api.php";

  constructor(options?: {endpoint?: string}) {
    this.endpoint = options && options.endpoint ? options.endpoint : this.endpoint;
  }

  search(query: string) {
    return rp.get({
      uri: this.endpoint,
      qs: {
        origin: "*",
        action: "query",
        list: "search",
        srsearch: query,
        format: "json"
      }
    });
  }

  getRevision(title: string, before: string) {
    return rp.get({
      uri: this.endpoint,
      qs: {
        origin: "*",
        action: "query",
        prop: "revisions",
        titles: title,
        rvprop: "ids",
        rvstart: before,
        rvlimit: 1,
        format: "json"
      }
    });
  }

  getPage(oldid: number) {
    return rp.get({
      uri: this.endpoint,
      qs: {
        origin: "*",
        action: "parse",
        format: "json",
        oldid
      }
    });
  }
}
