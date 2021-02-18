import { Song } from "./song";

export interface QueueList {
  songs: Array<Song>;
  playing?: Song;
}
