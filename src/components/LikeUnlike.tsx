"use client";

import { AuthContext } from "@/app/AuthContextProvider";
import { likeUnlike } from "@/app/utils/likes";
import { LikeUnlikeI } from "@/interfaces_and_types/LikeI";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function LikeUnlike({ song, liked }: LikeUnlikeI) {
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const likeUnlikeHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    const data = await likeUnlike(song._id as string);

    if (data.status) {
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    } else {
      queryClient.invalidateQueries("liked");
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: false,
      });
    }

    setIsLiked(!isLiked);
  };

  useEffect(() => {
    if (!liked.status) {
      const likedSongs = liked.songs;
      for (let i = 0; i < likedSongs.length; i++)
        if (liked.songs[i]._id === song._id) setIsLiked(true);
    }
  }, []);

  const styles = {
    button:
      "hover:transform hover:scale-125 hover:shadow-black hover:shadow hover:bg-gray-500 hover:z-10 rounded-md transition duration-100 ease-in-out cursor-pointer",
    icon: "h-6 w-6 text-red-800",
  };

  return (
    <button
      onClick={likeUnlikeHandler}
      className={`${styles.button} ${!user?.isAdmin ? "" : "mr-2"}`}
    >
      {!isLiked ? (
        <HeartIcon className={styles.icon} />
      ) : (
        <HeartSolidIcon className={styles.icon} />
      )}
    </button>
  );
}
