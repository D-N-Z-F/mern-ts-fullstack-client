import { CheckCircleProps } from "@/interfaces_and_types/SongI";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckedCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function CheckCircle({ playlistSongs, id }: CheckCircleProps) {
  const [songId, setSongId] = useState(id);
  const [isInPlaylist, setIsInPlaylist] = useState(false);

  useEffect(() => {
    setSongId(id);
    setIsInPlaylist(playlistSongs.some((song) => song._id === songId));
  }, [id, playlistSongs]);

  return (
    <>
      {!isInPlaylist ? (
        <CheckCircleIcon className="w-6 h-6" />
      ) : (
        <CheckedCircleIcon className="w-6 h-6" />
      )}
    </>
  );
}
