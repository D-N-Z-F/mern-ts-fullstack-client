import { SongI } from "./SongI";

export interface PlaylistI {
  _id: string;
  name: string;
  user: string;
  description: string;
  songs: Array<SongI>;
  image: string;
}

export interface PlaylistPlayerProps {
  songs: Array<SongI>;
  activePlayer: boolean;
  setActivePlayer: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlaylistNewI {
  name: string;
  description: string;
}
