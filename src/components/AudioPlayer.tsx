import React, { useState, useEffect, useRef, useCallback } from "react";
import { AudioPlayerProps, SongI } from "@/interfaces_and_types/SongI";
import {
  MinusCircleIcon,
  MusicalNoteIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/outline";

export default function AudioPlayer({
  song,
  activePlayer,
  setActivePlayer,
  setActiveSong,
  songData,
}: AudioPlayerProps) {
  const styles = {
    buttons:
      "w-10 h-10 cursor-pointer hover:text-white transition duration-100 ease-in-out rounded-md m-1",
  };
  const [progress, setProgress] = useState<number>(0);
  const [time, setTime] = useState<string>("0:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevSongs, setPrevSongs] = useState<Array<SongI>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getSeconds = useCallback(() => {
    const minutes = parseInt(song.duration[0]);
    const seconds = parseInt(song.duration.slice(song.duration.length - 2));

    return minutes * 60 + seconds;
  }, [song.duration]);

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

  const randomizeNext = useCallback((): SongI | null => {
    const randomSong = Math.floor(Math.random() * songData?.length);
    const nextSong = songData[randomSong];

    if (nextSong._id === song._id) return randomizeNext();

    prevSongs.push(song);
    setPrevSongs([...prevSongs]);
    return nextSong;
  }, [prevSongs, song, songData]);

  const playPrev = () => {
    const prevSong = prevSongs[prevSongs.length - 1];

    prevSongs.pop();
    setPrevSongs([...prevSongs]);
    return prevSong;
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
          setIsPlaying(false);
          prevSongs.push(song);
          setActiveSong(randomizeNext());
          setProgress(0);
          setTime("0:00");
          setTimeout(() => {
            setIsPlaying(true), audioRef.current?.play();
          }, 1000);
        }
      }, 1000);
    };

    if (isPlaying) startInterval();

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [
    isPlaying,
    getSeconds,
    prevSongs,
    randomizeNext,
    setActiveSong,
    song,
    updateProgressBar,
  ]);

  useEffect(() => {
    setIsPlaying(false);
    setTime("0:00");
    setProgress(0);
  }, [song, activePlayer]);

  return (
    <div
      className="absolute bottom-0 w-full sm:w-2/3 md:w-1/2 h-1/5 rounded-tl-md rounded-tr-md p-2 text-black"
      style={{ backgroundColor: "#fb503b" }}
    >
      <div className="w-full h-1/3 flex justify-between">
        <MusicalNoteIcon className="w-6 h-6" />
        <h1 className="text-sm sm:text-md md:text-lg">{`${song.song
          .replace(/\.\w+$/, "")
          .slice(14)}`}</h1>
        <MinusCircleIcon
          className="w-6 h-6 cursor-pointer hover:text-white transition duration-100 ease-in-out"
          onClick={() => setActivePlayer(false)}
        />
      </div>
      <div className="w-full h-1/3 flex justify-evenly">
        <BackwardIcon
          className={`${styles.buttons} ${
            !prevSongs.length ? "text-gray-500 pointer-events-none" : ""
          }`}
          onClick={() => setActiveSong(playPrev())}
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
          className={`${styles.buttons}`}
          onClick={() => setActiveSong(randomizeNext())}
        />
        <audio
          ref={audioRef}
          src={`${process.env.NEXT_PUBLIC_API_URL}/${song.song}`}
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
        <small>{song.duration}</small>
      </div>
    </div>
  );
}
