import React from "react";

export interface SongI {
  _id?: string;
  name: string;
  artist: string;
  song: string;
  image: string;
  duration: string;
}

export interface AudioPlayerProps {
  song: SongI | null;
  activePlayer: boolean;
  setActivePlayer: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveSong: React.Dispatch<React.SetStateAction<SongI | null>>;
  songData: Array<SongI>;
}

export interface UpdateSongI {
  updatedSong: SongI;
  audioUpload: File | null;
  imageUpload: File | null;
}

export interface AddSongI {
  newSong: SongI;
  audioUpload: File | null;
  imageUpload: File | null;
}

export interface CheckCircleProps {
  playlistSongs: Array<SongI>;
  id: string;
}
