import { PlaylistI, PlaylistNewI } from "@/interfaces_and_types/PlaylistI";
import axios from "axios";

export const getPlaylists = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists`, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });
  return res.data;
};

export const getPlaylist = async (id: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${id}`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${id}`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/playlists`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}/${songId}`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}/${songId}`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${id}`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};
