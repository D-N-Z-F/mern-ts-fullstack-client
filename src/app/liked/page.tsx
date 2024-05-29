"use client";

import {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "../AuthContextProvider";
import { getLiked, likeUnlike } from "../utils/likes";
import { useQuery, useQueryClient } from "react-query";
import {
  ArchiveBoxXMarkIcon,
  ArrowPathIcon,
  BookmarkSquareIcon,
  Cog8ToothIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SongI } from "@/interfaces_and_types/SongI";
import { deleteSong, editSong, getSong } from "../utils/songs";
import {
  addToPlaylist,
  getPlaylist,
  getPlaylists,
  removeFromPlaylist,
} from "../utils/playlists";
import { toast } from "react-toastify";
import { HeartIcon } from "@heroicons/react/24/solid";
import AudioPlayer from "@/components/AudioPlayer";
import { PlaylistI } from "@/interfaces_and_types/PlaylistI";
import CheckCircle from "@/components/CheckCircle";
import { permanentRedirect } from "next/navigation";

export default function LikedPage() {
  const { user } = useContext(AuthContext);
  const { data: likedData, isLoading: likedIsLoading } = useQuery(
    "likedSongs",
    getLiked
  );
  const { data: playlistData, isLoading: playlistsIsLoading } = useQuery(
    "playlists",
    getPlaylists
  );

  const [activePlayer, setActivePlayer] = useState(false);
  const [activeSong, setActiveSong] = useState<SongI | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingSong, setEditingSong] = useState<SongI | null>(null);
  const [updatedSong, setUpdatedSong] = useState<SongI | null>(null);
  const [audioUpload, setAudioUpload] = useState<File | null>(null);
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
  const [songToAddOrRemove, setSongToAddOrRemove] = useState("");

  const queryClient = useQueryClient();

  const styles = {
    inputs: "p-2 border rounded-md focus:outline-none focus:border-red-500",
    div: "flex flex-col",
    buttons:
      "w-1/3 h-full p-2 flex justify-center items-center rounded-md bg-gray-900 transition duration-100 ease-in-out lg:hover:bg-gray-700 lg:hover:transform lg:hover:scale-90",
  };

  const playAudio = (song: SongI) => {
    setActiveSong(song);
    setActivePlayer(true);
  };

  const triggerEdit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();

    setActiveSong(null);
    setActivePlayer(false);

    const songId = e.currentTarget.getAttribute("id") as string;
    const data = await getSong(songId);

    setEditingSong(data);
    setUpdatedSong(data);
    setIsEditing(true);
  };

  const triggerAddOrRemove: MouseEventHandler<HTMLDivElement> = async (e) => {
    const playlistId = e.currentTarget.getAttribute("id") as string;
    const playlistData = await getPlaylist(playlistId);
    const isAlreadyAdded = playlistData.songs.some(
      (song: SongI) => song._id === songToAddOrRemove
    );

    const data = isAlreadyAdded
      ? await removeFromPlaylist(playlistId, songToAddOrRemove)
      : await addToPlaylist(playlistId, songToAddOrRemove);

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      queryClient.invalidateQueries("playlists");
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    }
  };

  const unlikeHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    const songId = e.currentTarget.getAttribute("id");
    const data = await likeUnlike(songId as string);

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      queryClient.invalidateQueries("likedSongs");
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdatedSong({
      ...updatedSong,
      [e.target.name]: e.target.value,
    } as SongI);

  const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) setImageUpload(file);
  };

  const audioHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) setAudioUpload(file);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = await editSong({
      updatedSong: updatedSong as SongI,
      audioUpload,
      imageUpload,
    });

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      queryClient.invalidateQueries("songs");
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    }

    setAudioUpload(null);
    setImageUpload(null);
    setUpdatedSong(null);
    setEditingSong(null);
    setIsEditing(false);
  };

  const deleteHandler = async (id: string) => {
    const data = await deleteSong(id);

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      queryClient.invalidateQueries("likedSongs");
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    }

    setAudioUpload(null);
    setImageUpload(null);
    setUpdatedSong(null);
    setEditingSong(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("user") && !localStorage.getItem("token"))
      permanentRedirect("/login");
  }, [user]);

  return (
    <>
      <div className="relative w-3/4 h-full bg-gray-800 flex flex-wrap justify-center items-center p-2 pl-0">
        {!likedIsLoading && !playlistsIsLoading ? (
          <>
            <div className="w-full h-full bg-gray-900 rounded-md p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <div className="w-full h-full p-2 flex flex-wrap content-start">
                <h1 className="w-full pl-2 text-2xl font-bold">Liked Songs</h1>
                {!likedData || !likedData.songs || !likedData.songs.length ? (
                  <div className="w-full h-1/2 flex justify-center items-center">
                    <div className="animate-bounce">
                      <h1 className="text-2xl">Nothing To Show Yet!</h1>
                      <h2 className="text-md">Start Liking Songs!</h2>
                    </div>
                  </div>
                ) : (
                  likedData.songs.map((song: SongI) => (
                    <div
                      key={song._id}
                      onClick={() => playAudio(song)}
                      className="relative w-full sm:w-1/2 md:w-1/3 h-1/3 p-2 hover:transform hover:scale-105 hover:z-5 transition duration-100 ease-in-out cursor-pointer"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${
                          !song.image ? "MusicIcon.jpg" : song.image
                        }`}
                        alt={!song.image ? "SongImage" : song.image.slice(14)}
                        className="w-full h-full object-cover brightness-50 rounded-md"
                      />
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
                        <div className="w-full h-1/2 flex justify-end items-start p-4">
                          <PlusCircleIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              setSongToAddOrRemove(song._id as string);
                              setIsAddingToPlaylist(true);
                            }}
                            className="w-6 h-6 text-red-500 mr-2 hover:transform hover:scale-125 hover:shadow-black hover:shadow hover:bg-gray-500 hover:z-10 rounded-md transition duration-100 ease-in-out cursor-pointer"
                          />

                          <button
                            id={song._id}
                            onClick={unlikeHandler}
                            className={`hover:transform hover:scale-125 hover:shadow-black hover:shadow hover:bg-gray-500 hover:z-10 rounded-md transition duration-100 ease-in-out cursor-pointer ${
                              !user?.isAdmin ? "" : "mr-2"
                            }`}
                          >
                            <HeartIcon className="w-6 h-6" />
                          </button>
                          {!user?.isAdmin ? null : (
                            <button
                              id={song._id}
                              onClick={triggerEdit}
                              className="hover:transform hover:scale-125 hover:shadow-black hover:shadow hover:bg-gray-500 hover:z-10 rounded-md transition duration-100 ease-in-out cursor-pointer pointer-events-auto
                              "
                            >
                              <Cog8ToothIcon className="w-6 h-6" />
                            </button>
                          )}
                        </div>
                        <div className="w-full h-1/2 flex justify-between items-end p-4">
                          <div>
                            <h1 className="text-xl text-white">{song.name}</h1>
                            <p className="text-sm text-white">{song.artist}</p>
                          </div>
                          <div>
                            <p className="text-sm text-white">
                              {song.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {!activePlayer ? null : !activeSong ? null : (
              <AudioPlayer
                song={activeSong}
                activePlayer={activePlayer}
                setActivePlayer={setActivePlayer}
                setActiveSong={setActiveSong}
                songData={likedData.song}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 rounded-md flex justify-center items-center">
            <ArrowPathIcon className="w-12 h-12 animate-spin" />
          </div>
        )}
      </div>
      {isEditing && editingSong ? (
        <div
          className="absolute top-0 left-0 w-screen h-screen z-20 flex flex-col p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="w-full h-1/6 flex justify-end">
            <XMarkIcon
              className="w-16 h-16 md:w-24 md:h-24 cursor-pointer transition duration-100 ease-in-out hover:bg-gray-900 rounded-lg hover:transform hover:scale-90"
              onClick={() => {
                setAudioUpload(null);
                setImageUpload(null);
                setEditingSong(null);
                setUpdatedSong(null);
                setIsEditing(false);
              }}
            />
          </div>
          <div className="w-full h-5/6 flex justify-center">
            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-4/5 bg-gray-800 rounded-lg">
              <form
                method="POST"
                encType="multipart/form-data"
                onSubmit={onSubmitHandler}
                className="p-2"
              >
                <div className={`${styles.div}`}>
                  <label>Name</label>
                  <input
                    className={`${styles.inputs}`}
                    type="text"
                    name="name"
                    onChange={onChangeHandler}
                    value={updatedSong?.name}
                  />
                </div>
                <div className={`${styles.div}`}>
                  <label>Artist</label>
                  <input
                    className={`${styles.inputs}`}
                    type="text"
                    name="artist"
                    onChange={onChangeHandler}
                    value={updatedSong?.artist}
                  />
                </div>
                <div className={`${styles.div}`}>
                  <label>Song</label>
                  <input
                    className={`${styles.inputs} w-full`}
                    type="file"
                    name="song"
                    accept=".mp3, .wav"
                    onChange={audioHandler}
                  />
                </div>
                <div className={`${styles.div}`}>
                  <label>Image</label>
                  <input
                    className={`${styles.inputs} w-full`}
                    type="file"
                    name="image"
                    accept=".jpeg, .jpg, .png"
                    onChange={imageHandler}
                  />
                </div>
                <div className="flex w-full h-1/6 mt-2">
                  <button className={`${styles.buttons} mr-2`}>
                    <BookmarkSquareIcon className="w-6 h-6" />

                    <h1 className="text-lg ml-1 hidden sm:block">UPDATE</h1>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteHandler(updatedSong?._id as string)}
                    className={`${styles.buttons}`}
                  >
                    <ArchiveBoxXMarkIcon className="w-6 h-6" />
                    <h1 className="text-lg ml-1 hidden sm:block">DELETE</h1>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {!isAddingToPlaylist ? null : (
        <div
          className="absolute top-0 left-0 w-screen h-screen z-20 flex flex-col justify-start items-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="w-full h-1/6 flex justify-end">
            <XMarkIcon
              className="w-24 h-24 cursor-pointer transition duration-100 ease-in-out hover:bg-gray-900 rounded-lg hover:transform hover:scale-90"
              onClick={() => {
                setSongToAddOrRemove("");
                setIsAddingToPlaylist(false);
              }}
            />
          </div>
          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-4/5 bg-gray-800 rounded-lg p-4">
            <h1 className="text-2xl font-bold">Your Playlists</h1>
            {!playlistData || !playlistData.length ? (
              <div className="w-full h-5/6 flex justify-center items-center">
                <h1 className="animate-bounce">No Playlists Found...</h1>
              </div>
            ) : (
              <div className="w-full h-5/6 pt-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent">
                {playlistData.map((playlist: PlaylistI, i: number) => (
                  <div
                    key={playlist._id}
                    id={playlist._id}
                    onClick={triggerAddOrRemove}
                    className="w-full h-1/3 flex hover:transform hover:scale-90 hover:z-5 transition duration-100 ease-in-out cursor-pointer rounded-md"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${
                        playlist.songs.length
                          ? playlist.songs[0].image
                            ? playlist.songs[0].image
                            : "MusicIcon.jpg"
                          : "MusicIcon.jpg"
                      }`}
                      alt="PlaylistImage"
                      className={`w-1/3 h-full object-cover ${
                        i === 0 ? "rounded-tl-md" : ""
                      } ${i < playlistData.length - 1 ? "" : "rounded-bl-md"}`}
                    />
                    <div
                      className={`w-2/3 h-full flex justify-between items-end p-2 bg-gray-600 ${
                        i === 0 ? "rounded-tr-md" : ""
                      } ${i < playlistData.length - 1 ? "" : "rounded-br-md"}`}
                    >
                      <div className="h-full">
                        <h1 className="text-xl text-white">{playlist.name}</h1>
                        <small className="text-white">
                          {playlist.description}
                        </small>
                      </div>
                      <div className="flex justify-between items-center">
                        <small className="text-white mr-1">
                          {playlist.songs.length}
                          {playlist.songs.length === 1 ? " Song" : " Songs"}
                        </small>
                        <CheckCircle
                          playlistSongs={playlist.songs as Array<SongI>}
                          id={songToAddOrRemove as string}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
