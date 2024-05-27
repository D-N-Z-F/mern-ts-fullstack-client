import { PlaylistI, PlaylistNewI } from "@/interfaces_and_types/PlaylistI";
import axios from "axios";

export const getPlaylists = async () => {
  const res = await axios.get("http://localhost:8000/playlists", {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });
  return res.data;
};

export const getPlaylist = async (id: string) => {
  const res = await axios.get(`http://localhost:8000/playlists/${id}`, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

  return res.data;
};

export const editPlaylist = async (
  id: string,
  updatedPlaylist: PlaylistNewI
) => {
  const res = await axios.put(
    `http://localhost:8000/playlists/${id}`,
    updatedPlaylist,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const addPlaylist = async (newPlaylist: PlaylistNewI) => {
  const res = await axios.post("http://localhost:8000/playlists", newPlaylist, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

  return res.data;
};

export const addToPlaylist = async (playlistId: string, songId: string) => {
  const res = await axios.put(
    `http://localhost:8000/playlists/${playlistId}/${songId}`,
    null,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const removeFromPlaylist = async (
  playlistId: string,
  songId: string
) => {
  const res = await axios.patch(
    `http://localhost:8000/playlists/${playlistId}/${songId}`,
    null,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const deletePlaylist = async (id: string) => {
  const res = await axios.delete(`http://localhost:8000/playlists/${id}`, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

  return res.data;
};
