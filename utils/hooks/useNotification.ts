import { useState, useEffect, useCallback } from "react";

export const usePlayAudio = (source:string):{playing:boolean,startPlaying:()=>void} => {
  const [audio] = useState<HTMLAudioElement>(typeof Audio !== "undefined" && new Audio(source));
  const [playing, setPlaying] = useState<boolean>(false);

  const startPlaying = useCallback(() => setPlaying((prev) => !prev), []);

  useEffect(() => {
    try {
      playing ? audio.play() : audio.pause();
    } catch (err) {
      console.log(err);
    }
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return { playing, startPlaying };
};

export const useChangeTitle = (defaultTitle:string):[pageTitle:string,changePageTitle:(tempTitle:string)=>void] => {
  const [pageTitle, setPageTitle] = useState<string>(defaultTitle); //page title
  const changePageTitle = useCallback((tempTitle:string) => {
    setPageTitle(() => tempTitle);
  }, []);
  // change back to default title after 5s
  useEffect(() => {
    let timer = setTimeout(() => {
      setPageTitle(defaultTitle);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [pageTitle]);
  return [pageTitle, changePageTitle];
};
