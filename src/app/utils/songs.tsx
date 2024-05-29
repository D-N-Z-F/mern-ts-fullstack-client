import { AddSongI, SongI, UpdateSongI } from "@/interfaces_and_types/SongI";
import axios from "axios";

export const getSongs = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs`);

  return res.data;
};

export const getSong = async (id: string) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs/${id}`);

  return res.data;
};

export const addSong = async ({
  newSong,
  audioUpload,
  imageUpload,
}: AddSongI) => {
  const formData = new FormData();
  formData.append("name", newSong.name);
  formData.append("artist", newSong.artist);
  formData.append("duration", newSong.duration);
  if (audioUpload) formData.append("song", audioUpload);
  if (imageUpload) formData.append("image", imageUpload);

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/songs/`,
    formData,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const editSong = async ({
  updatedSong,
  audioUpload,
  imageUpload,
}: UpdateSongI) => {
  const formData = new FormData();
  formData.append("name", updatedSong.name);
  formData.append("artist", updatedSong.artist);
  if (audioUpload) formData.append("song", audioUpload);
  if (imageUpload) formData.append("image", imageUpload);

  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/songs/${updatedSong._id}`,
    formData,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};

export const deleteSong = async (id: string) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/songs/${id}`,
    {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    }
  );

  return res.data;
};
