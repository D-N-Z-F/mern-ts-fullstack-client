import React, { useState, useEffect, useRef, useCallback } from "react";
import { PlaylistPlayerProps } from "@/interfaces_and_types/PlaylistI";
import {
  MinusCircleIcon,
  MusicalNoteIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/outline";

export default function PlaylistPlayer({
  songs,
  activePlayer,
  setActivePlayer,
}: PlaylistPlayerProps) {
  const styles = {
    buttons:
      "w-10 h-10 cursor-pointer hover:text-white transition duration-100 ease-in-out rounded-md m-1",
  };
  const [progress, setProgress] = useState<number>(0);
  const [time, setTime] = useState<string>("0:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);

  const getSeconds = useCallback(() => {
    const minutes = parseInt(songs[index].duration[0]);
    const seconds = parseInt(
      songs[index].duration.slice(songs[index].duration.length - 2)
    );

    return minutes * 60 + seconds;
  }, [index, songs]);

  const updateProgressBar = useCallback(() => {
    const seconds = Math.round(audioRef.current?.currentTime as number);
    const duration = getSeconds();
    const percentage = (seconds / duration) * 100;
    setProgress(percentage);
  }, [getSeconds]);

  const updateTime = () => {
    const currentTime = Math.round(audioRef.current?.currentTime as number);
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);

    console.log(`${minutes}:${seconds.toString().padStart(2, "0")}`);

    setTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  const playNext = () => {
    const idx = index + 1;
    setIndex(idx);
    setTime("0:00");
    setProgress(0);
    setIsPlaying(false);
  };

  const playPrev = () => {
    const idx = index - 1;
    setIndex(idx);
    setTime("0:00");
    setProgress(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        updateTime();
        updateProgressBar();

        if (
          Math.round(audioRef.current?.currentTime as number) >= getSeconds()
        ) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          if (index === songs.length - 1) setIsPlaying(false);
          else {
            const idx = index + 1;
            setIsPlaying(false);
            setProgress(0);
            setTime("0:00");
            setIndex(idx);
            setTimeout(() => {
              setIsPlaying(true), audioRef.current?.play();
            }, 1000);
          }
        }
      }, 1000);
    };

    if (isPlaying) startInterval();

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [
    isPlaying,
    setIsPlaying,
    getSeconds,
    index,
    songs.length,
    updateProgressBar,
  ]);

  useEffect(() => {
    setIsPlaying(false);
    setTime("0:00");
    setProgress(0);
    setIndex(0);
  }, [activePlayer]);

  return (
    <div
      className="absolute bottom-0 w-1/2 h-1/5 rounded-tl-md rounded-tr-md p-2 text-black"
      style={{ backgroundColor: "#fb503b" }}
    >
      <div className="w-full h-1/3 flex justify-between">
        <MusicalNoteIcon className="w-6 h-6" />
        <h1>{`${songs[index].song.replace(/\.\w+$/, "").slice(14)}`}</h1>
        <MinusCircleIcon
          className="w-6 h-6 cursor-pointer hover:text-white transition duration-100 ease-in-out"
          onClick={() => setActivePlayer(false)}
        />
      </div>
      <div className="w-full h-1/3 flex justify-evenly">
        <BackwardIcon
          className={`${styles.buttons} ${
            index === 0 ? "text-gray-500 pointer-events-none" : ""
          }`}
          onClick={playPrev}
        />
        {!isPlaying ? (
          <PlayIcon
            className={`${styles.buttons}`}
            onClick={() => {
              setIsPlaying(!isPlaying);
              audioRef.current?.play();
            }}
          />
        ) : (
          <PauseIcon
            className={`${styles.buttons}`}
            onClick={() => {
              setIsPlaying(!isPlaying);
              audioRef.current?.pause();
            }}
          />
        )}
        <ForwardIcon
          className={`${styles.buttons} ${
            index === songs.length - 1
              ? "text-gray-500 pointer-events-none"
              : ""
          }`}
          onClick={playNext}
        />
        <audio
          ref={audioRef}
          src={`https://mern-ts-fullstack-server.onrender.com/${songs[index].song}`}
        ></audio>
      </div>
      <div className="w-full h-1/3 flex justify-center items-center">
        <small>{time}</small>
        <div className="w-3/4 h-1/6 bg-white rounded-md mx-2">
          <div
            className="h-full bg-gray-800 rounded-md"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <small>{songs[index].duration}</small>
      </div>
    </div>
  );
}
