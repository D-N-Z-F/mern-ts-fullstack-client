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
import { useQuery, useQueryClient } from "react-query";
import {
  addPlaylist,
  deletePlaylist,
  editPlaylist,
  getPlaylist,
  getPlaylists,
} from "../utils/playlists";
import {
  ArchiveBoxXMarkIcon,
  ArrowPathIcon,
  BookmarkSquareIcon,
  Cog8ToothIcon,
  FolderPlusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlaylistI, PlaylistNewI } from "@/interfaces_and_types/PlaylistI";
import { SongI } from "@/interfaces_and_types/SongI";
import PlaylistPlayer from "@/components/PlaylistPlayer";
import { toast } from "react-toastify";
import { permanentRedirect } from "next/navigation";
import Image from "next/image";

export default function Playlists() {
  const { user, token, setUser, setToken } = useContext(AuthContext);
  const { data, isLoading } = useQuery("playlists", getPlaylists);
  const [activePlayer, setActivePlayer] = useState(false);
  const [songs, setSongs] = useState<Array<SongI> | null>(null);

  const [adding, setAdding] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
  });

  const [editing, setEditing] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistI | null>(
    null
  );
  const [updatedPlaylist, setUpdatedPlaylist] = useState<PlaylistNewI | null>(
    null
  );
  const queryClient = useQueryClient();

  const styles = {
    inputs: "p-2 border rounded-md focus:outline-none focus:border-red-500",
    div: "flex flex-col",
    buttons:
      "w-1/3 h-full p-2 flex justify-center items-center rounded-md bg-gray-900 transition duration-100 ease-in-out lg:hover:bg-gray-700 lg:hover:transform lg:hover:scale-90",
  };

  const playAudio = (songs: Array<SongI>) => {
    setSongs(songs);
    setActivePlayer(true);
  };

  const triggerEdit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();

    setSongs(null);
    setActivePlayer(false);

    const playlistId = e.currentTarget.getAttribute("id") as string;
    const data = await getPlaylist(playlistId);

    setEditingPlaylist(data);
    setUpdatedPlaylist({
      name: data.name,
      description: data.description,
    });
    setEditing(true);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (adding)
      setNewPlaylist({
        ...newPlaylist,
        [e.target.name]: e.target.value,
      });
    else
      setUpdatedPlaylist({
        ...updatedPlaylist,
        [e.target.name]: e.target.value,
      } as PlaylistNewI);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = !adding
      ? await editPlaylist(
          editingPlaylist?._id as string,
          updatedPlaylist as PlaylistNewI
        )
      : await addPlaylist(newPlaylist as PlaylistNewI);

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

    setUpdatedPlaylist(null);
    setEditingPlaylist(null);
    setNewPlaylist({
      name: "",
      description: "",
    });
    setEditing(false);
    setAdding(false);
  };

  const deleteHandler = async (id: string) => {
    const data = await deletePlaylist(id);

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

    setEditingPlaylist(null);
    setUpdatedPlaylist(null);
    setEditing(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("user") && !localStorage.getItem("token"))
      permanentRedirect("/login");
  }, [user]);

  return (
    <>
      <div className="relative w-3/4 h-full bg-gray-800 flex flex-wrap justify-center items-center p-2 pl-0">
        {!isLoading ? (
          <>
            <div className="w-full h-full bg-gray-900 rounded-md p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <div className="w-full h-full p-2 flex flex-wrap content-start">
                <h1 className="w-full pl-2 text-2xl font-bold">
                  Your Playlists
                </h1>
                {data.map((playlist: PlaylistI) => (
                  <div
                    key={playlist._id}
                    onClick={() => playAudio(playlist.songs)}
                    className={`relative w-full sm:w-1/2 md:w-1/3 h-1/3 p-2 transition duration-100 ease-in-out cursor-pointer ${
                      !playlist.songs.length
                        ? "pointer-events-none"
                        : "hover:transform hover:scale-105 hover:z-5"
                    }`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${
                        !playlist.songs.length
                          ? "MusicIcon.jpg"
                          : !playlist.songs[0].image
                          ? "MusicIcon.jpg"
                          : playlist.songs[0].image
                      }`}
                      alt="PlaylistImage"
                      className="w-full h-full object-cover brightness-50 rounded-md"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-end p-4">
                      <button
                        id={playlist._id}
                        onClick={triggerEdit}
                        className="hover:transform hover:scale-125 hover:shadow-black hover:shadow hover:bg-gray-500 hover:z-10 rounded-md transition duration-100 ease-in-out cursor-pointer pointer-events-auto"
                      >
                        <Cog8ToothIcon className="w-6 h-6" />
                      </button>

                      <div className="w-full flex justify-between items-end">
                        <div>
                          <h1 className="text-xl text-white">
                            {playlist.name}
                          </h1>
                          <p className="text-xs text-white">
                            {playlist.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-white">
                            {playlist.songs.length}
                            {playlist.songs.length === 1 ? " Song" : " Songs"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="w-full sm:w-1/2 md:w-1/3 h-1/3 p-2">
                  <button
                    className="w-full h-full flex justify-center items-center rounded-md bg-gray-800 hover:transform hover:scale-105 hover:z-5 transition duration-100 ease-in-out cursor-pointer"
                    onClick={() => {
                      setSongs(null);
                      setActivePlayer(false);
                      setAdding(true);
                    }}
                  >
                    <div className="w-1/2 h-1/2 flex justify-center items-center hover:transform hover:rotate-90 transition duration-300 ease-in-out rounded-full">
                      <PlusIcon className="w-12 h-12" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {!activePlayer ? null : (
              <PlaylistPlayer
                songs={songs as Array<SongI>}
                activePlayer={activePlayer}
                setActivePlayer={setActivePlayer}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 rounded-md flex justify-center items-center">
            <ArrowPathIcon className="w-12 h-12 animate-spin" />
          </div>
        )}
      </div>
      {(editing && editingPlaylist) || adding ? (
        <div
          className="absolute top-0 left-0 w-screen h-screen z-20 flex flex-col p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="w-full h-1/6 flex justify-end">
            <XMarkIcon
              className="w-16 h-16 md:w-24 md:h-24 cursor-pointer transition duration-100 ease-in-out hover:bg-gray-900 rounded-lg hover:transform hover:scale-90"
              onClick={() => {
                setEditingPlaylist(null);
                setUpdatedPlaylist(null);
                setNewPlaylist({
                  name: "",
                  description: "",
                });
                setEditing(false);
                setAdding(false);
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
                    value={adding ? newPlaylist?.name : updatedPlaylist?.name}
                  />
                </div>
                <div className={`${styles.div}`}>
                  <label>Description</label>
                  <input
                    className={`${styles.inputs}`}
                    type="text"
                    name="description"
                    onChange={onChangeHandler}
                    value={
                      adding
                        ? newPlaylist?.description
                        : updatedPlaylist?.description
                    }
                  />
                </div>
                <div className="flex w-full h-1/6 mt-2">
                  <button className={`${styles.buttons} mr-2`}>
                    {adding ? (
                      <FolderPlusIcon className="w-6 h-6" />
                    ) : (
                      <BookmarkSquareIcon className="w-6 h-6" />
                    )}
                    <h1 className="text-lg ml-1 hidden sm:block">
                      {adding ? "ADD" : "UPDATE"}
                    </h1>
                  </button>
                  {!adding ? (
                    <button
                      onClick={() =>
                        deleteHandler(editingPlaylist?._id as string)
                      }
                      type="button"
                      className={`${styles.buttons}`}
                    >
                      <ArchiveBoxXMarkIcon className="w-6 h-6" />
                      <h1 className="text-lg ml-1 hidden sm:block">DELETE</h1>
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
