const youtubeToken = process.env.YOUTUBE;

import { Song } from "../../models";
import axios from "axios";
import ytsr from "ytsr";

const request = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: { key: youtubeToken },
});

const regex = /(youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/;

export default class Youtube {
  /**
   * Get information about a video on Youtube.
   * @param id
   */
  public static async video(id: string) {
    return (
      await request("videos", {
        params: {
          part: "snippet,statistics",
          id,
        },
      })
    ).data;
  }

  /**
   * Search for a set number of videos on Youtube.
   * @param query
   * @param limit
   */
  public static async search(query: string, limit: number) {
    let res = await ytsr(query, {
      limit,
    });

    return res;
  }

  /**
   * Get the video id from a youtube url.
   * @param url
   */
  public static id(url: string): string {
    let match = url.match(regex);

    if (match && match.length > 1) {
      return match[2];
    }

    return url;
  }

  /**
   * Get info about a song on Youtube.
   * @param input
   */
  public static async info(input: string): Promise<Song> {
    let id = this.id(input);
    let data = await this.video(id);

    let video = data.items[0];

    if (!video) throw "Could not find any information about this video.";

    let snippet = video.snippet;
    let statistics = video.statistics;

    return {
      platform: "youtube",
      title: snippet.title,
      author: snippet.channelTitle,
      image: snippet.thumbnails.high.url,
      date: new Date(snippet.publishedAt),
      views: parseInt(statistics.viewCount),
      likes: parseInt(statistics.likeCount),
      dislikes: parseInt(statistics.dislikeCount),
      url: `https://youtu.be/${video.id}`,
    };
  }
}
