export default interface Song {
  platform: string;
  title: string;
  author: string;
  image: string;
  date: Date;
  views?: number;
  likes?: number;
  dislikes?: number;
  url: string;
}
