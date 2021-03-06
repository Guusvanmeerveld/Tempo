const soundcloudToken = process.env.SOUNDCLOUD;

import { Song } from "../../models";
import axios from "axios";
import m3u8stream from "m3u8stream";

const request = axios.create({
  baseURL: "https://api-v2.soundcloud.com/",
  params: { client_id: soundcloudToken },
});

export default class SoundCloud {
  public static async track(url: string) {
    return (
      await request("/resolve", {
        params: {
          url,
        },
      })
    ).data;
  }

  public static async search(entry: string, limit: number) {
    return (
      await request("/search/tracks", {
        params: {
          q: entry,
          limit,
        },
      })
    ).data;
  }

  public static async download(url: string | undefined) {
    if (!url) throw "No url given";
    let downloadURL = (await request(url)).data.url;

    return m3u8stream(downloadURL);
  }

  public static async info(input: string): Promise<Song> {
    let data = await this.track(input);

    return {
      platform: "soundcloud",
      title: data.title,
      date: new Date(data.created_at),
      author: data.publisher_metadata?.artist ?? "Unknown artist",
      image: data.artwork_url,
      url: data.permalink_url,
      download: data.media.transcodings[0].url,
      likes: data.likes_count,
      views: data.playback_count,
    };
  }
}
