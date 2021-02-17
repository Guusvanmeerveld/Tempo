const { youtubeToken } = require("../../config/tokens.json");

import Song from "../../models/song";
import axios from "axios";
import ytsr, { Video } from "ytsr";

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
    let res = await request("videos", {
      params: {
        part: "snippet,statistics",
        id,
      },
    });

    return res.data;
  }

  /**
   * Search for a set number of videos on Youtube.
   * @param query
   * @param limit
   */
  public static async search(query: string, limit: number): Promise<Video> {
    let res = await ytsr(query, {
      limit,
    });

    return res.items[0] as Video;
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
