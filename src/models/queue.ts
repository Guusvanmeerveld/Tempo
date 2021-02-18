import { Song } from "./song";

export interface Queue {
  songs: Array<Song>;
  playing?: Song;
}
