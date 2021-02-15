export default interface Song {
  platform: string;
  title: string;
  author: string;
  image: string;
  date: string;
  views?: number;
  likes?: number;
  dislikes?: number;
}
