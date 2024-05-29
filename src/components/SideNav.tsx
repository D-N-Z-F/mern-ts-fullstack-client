"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/app/AuthContextProvider";
import {
  CursorArrowRippleIcon,
  HomeIcon,
  QueueListIcon,
  HeartIcon,
  UserCircleIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLiked } from "@/app/utils/likes";
import { SongI } from "@/interfaces_and_types/SongI";

export default function SideNav() {
  const { user, token, setUser, setToken } = useContext(AuthContext);
  const [likedSong, setLikedSong] = useState<SongI | null>(null);
  const [currentpath, setCurrentPath] = useState("");
  const { push } = useRouter();
  const styles = {
    linkCSS:
      "flex justify-center transition duration-300 ease-in-out lg:hover:bg-gray-700 rounded-md",
  };

  const joinDate = () => {
    if (user && user.joinedAt) {
      const joinedDate = user.joinedAt.toLocaleString().slice(0, 10);
      const day = joinedDate.slice(8, 10);
      const month = joinedDate.slice(5, 7);
      const year = joinedDate.slice(0, 4);

      return `Joined ${day}/${month}/${year}`;
    }
  };

  const logoutHandler = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    push("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && token) {
        const data = await getLiked();

        if (!data.status)
          setLikedSong(
            data.songs.length
              ? data.songs[Math.floor(Math.random() * data.songs.length)]
              : null
          );
      }
    };

    fetchData();
    setCurrentPath(window.location.pathname);
  }, [user, token, currentpath]);

  return (
    <div className="flex flex-wrap w-1/4 p-2 h-full bg-gray-800">
      <div className="w-full h-1/2 sm:h-1/3 bg-gray-900 p-2 rounded-md">
        <a
          href="/"
          className={`${styles.linkCSS} items-center h-1/3 hover:animate-pulse`}
        >
          <h1 className="text-xl mr-1 hidden md:block">Breathythm</h1>
          <CursorArrowRippleIcon className="w-6 h-6" />
        </a>
        <hr className="border-t border-black" />
        <div className="h-2/3 h-full">
          <a
            href="/"
            className={`${styles.linkCSS} py-2 ${
              currentpath === "/" ? "bg-gray-700" : ""
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <h1 className="text-md ml-1 hidden md:block">Home</h1>
          </a>
          <a
            href="/playlists"
            className={`${styles.linkCSS} py-2 ${
              currentpath === "/playlists" ? "bg-gray-700" : ""
            }`}
          >
            <QueueListIcon className="w-6 h-6" />
            <h1 className="text-md ml-1 hidden md:block">Playlists</h1>
          </a>
          <a
            href="/liked"
            className={`${styles.linkCSS} py-2 ${
              currentpath === "/liked" ? "bg-gray-700" : ""
            }`}
          >
            <HeartIcon className="w-6 h-6" />
            <h1 className="text-md ml-1 hidden md:block">Liked Songs</h1>
          </a>
          {/* <a href="/" className={`${styles.linkCSS} py-2`}>
            <MagnifyingGlassIcon className="w-6 h-6" />
            <h1 className="text-md ml-1 hidden md:block">Search</h1>
          </a> */}
        </div>
      </div>

      <div className="w-full h-1/2 sm:h-2/3 pt-2 rounded-md">
        <div className="w-full h-full bg-gray-900 rounded-md">
          {!user && !token ? (
            <div className="w-full h-full bg-gray-900 rounded-md flex justify-center items-center">
              <div className="animate-bounce">
                <CursorArrowRippleIcon className="w-12 h-12" />
              </div>
            </div>
          ) : (
            <>
              <div className="w-full h-full flex flex-wrap justify-between rounded-md hidden md:block">
                <div className="relative h-1/3 w-full rounded-tl-md rounded-tr-md">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${user?.image}`}
                    className="h-full w-full object-cover rounded-tl-md rounded-tr-md brightness-50"
                    alt="userIcon"
                  />
                  <div className="absolute top-0 left-0 w-full h-full p-2 flex justify-between items-end">
                    <div className="text-white">
                      <small>{user?.username}</small>
                      <h1 className="text-lg">{user?.name}</h1>
                    </div>
                    <div className="flex">
                      <UserCircleIcon
                        className={`w-6 h-6 ${
                          user?.gender === "male"
                            ? "text-blue-500"
                            : user?.gender === "female"
                            ? "text-pink-500"
                            : user?.gender === "non-binary"
                            ? "text-amber-500"
                            : "text-white"
                        }`}
                      />
                      {!user?.isVerified ? null : (
                        <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                      )}
                      {!user?.isPremium ? null : (
                        <CheckBadgeIcon className="w-6 h-6 text-rose-400" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full h-1/6 p-2">
                  <a
                    href="/profile"
                    className={`${
                      styles.linkCSS
                    } p-2 w-full h-full items-center ${
                      currentpath === "/profile" ? "bg-gray-700" : ""
                    }`}
                  >
                    <UserIcon className="w-6 h-6" />
                    <h1 className="text-xl">Profile</h1>
                  </a>
                </div>
                <div className="w-full h-1/3 p-2 pt-0 flex flex-col justify-between">
                  <div className="relative w-full h-5/6 flex justify-center items-center">
                    {!likedSong ? (
                      <div className="animate-bounce">
                        <h2>Nothing To Show Yet!</h2>
                        <small>Start Liking Songs!</small>
                      </div>
                    ) : (
                      <>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${
                            !likedSong.image ? "MusicIcon.jpg" : likedSong.image
                          }`}
                          className="w-full h-full object-cover brightness-50 rounded-md"
                          alt="likedSongImage"
                        />
                        <div className="absolute top-0 left-0 w-full h-full p-2 flex flex-col justify-end text-white">
                          <h1>{likedSong.name}</h1>
                          <small>{likedSong.artist}</small>

                          <div className="relative flex justify-end">
                            <HeartIcon className="absolute inline-flex h-6 w-6 text-red-800" />
                            <HeartSolidIcon className="relative animate-ping inline-flex h-6 w-6 text-red-800" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-full h-1/6 text-end text-neutral-500">
                    <small>{!user && !token ? "" : joinDate()}</small>
                  </div>
                </div>
                <div className="w-full h-1/6 p-2 rounded-md">
                  <button
                    className="w-full h-full bg-gray-800 flex justify-center items-center rounded-md hover:bg-gray-700 transition duration-100 ease-in-out"
                    onClick={logoutHandler}
                  >
                    <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                    <h1 className="text-md ml-1">Log Out</h1>
                  </button>
                </div>
              </div>

              <div className="w-full h-full flex flex-wrap justify-center rounded-md">
                <div className="w-full h-1/4 p-2">
                  <a
                    href="/profile"
                    className={`w-full h-full flex justify-center items-center rounded-md hover:bg-gray-700 transition duration-100 ease-in-out ${
                      currentpath === "/profile" ? "bg-gray-700" : "bg-gray-800"
                    }`}
                  >
                    <UserIcon className="w-6 h-6" />
                  </a>
                </div>

                <div className="flex flex-col w-full h-2/4 justify-center items-center p-2">
                  <UserCircleIcon className={`w-10 h-10 text-neutral-400`} />
                  {!user?.isVerified ? null : (
                    <CheckCircleIcon className="w-10 h-10 text-emerald-400" />
                  )}
                  {!user?.isPremium ? null : (
                    <CheckBadgeIcon className="w-10 h-10 text-rose-400" />
                  )}
                </div>

                <div className="w-full h-1/4 p-2">
                  <button
                    className="w-full h-full bg-gray-800 flex justify-center items-center rounded-md hover:bg-gray-700 transition duration-100 ease-in-out"
                    onClick={logoutHandler}
                  >
                    <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
