import { User } from "discord.js";

export interface Song {
  platform: string;
  title: string;
  author: string;
  image: string;
  date: Date;
  views?: number;
  likes?: number;
  dislikes?: number;
  url: string;
  download?: string;
  requested?: User;
}
