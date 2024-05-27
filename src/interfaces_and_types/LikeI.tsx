import { SongI } from "./SongI";
import { UserI } from "./UserI";

export interface LikeI {
  user: UserI;
  songs: Array<SongI>;
  status: number;
}

export interface LikeUnlikeI {
  song: SongI;
  liked: LikeI;
}
