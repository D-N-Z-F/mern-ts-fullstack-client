import { PlaylistI, PlaylistNewI } from "@/interfaces_and_types/PlaylistI";
import axios from "axios";

export const getPlaylists = async () => {
  const res = await axios.get(
    `https://mern-ts-fullstack-server.onrender.com/playlists`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );
  return res.data;
};

export const getPlaylist = async (id: string) => {
  const res = await axios.get(
    `https://mern-ts-fullstack-server.onrender.com/playlists/${id}`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const editPlaylist = async (
  id: string,
  updatedPlaylist: PlaylistNewI
) => {
  const res = await axios.put(
    `https://mern-ts-fullstack-server.onrender.com/playlists/${id}`,
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
  const res = await axios.post(
    `https://mern-ts-fullstack-server.onrender.com/playlists`,
    newPlaylist,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const addToPlaylist = async (playlistId: string, songId: string) => {
  const res = await axios.put(
    `https://mern-ts-fullstack-server.onrender.com/playlists/${playlistId}/${songId}`,
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
    `https://mern-ts-fullstack-server.onrender.com/playlists/${playlistId}/${songId}`,
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
  const res = await axios.delete(
    `https://mern-ts-fullstack-server.onrender.com/playlists/${id}`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};
