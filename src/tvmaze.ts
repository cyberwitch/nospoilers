import request from "request";
import { Tvmaze } from "tvmaze-api-ts";

class PatchedTvmaze extends Tvmaze {
  static apiEndpoint = "https://api.tvmaze.com";

  constructor() {
    super();

    this.shows.episodes = (id: string, specials?: boolean) => {
      let queryString = `/shows/${id}/episodes`;

      if (specials) {
        queryString += "?specials=1";
      }

      return new Promise((resolve, reject) => {
        request.get(`${PatchedTvmaze.apiEndpoint}${queryString}`, { json: true }, (err, response) => {
          if (err) {
            return reject(err);
          } else {
            resolve(response.body);
          }
        })
      });
    }
  }
}

export const tvmaze = new PatchedTvmaze();
