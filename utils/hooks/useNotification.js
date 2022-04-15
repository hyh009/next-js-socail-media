import { useState, useEffect, useCallback } from "react";

export const usePlayAudio = (source) => {
  const [audio] = useState(typeof Audio !== "undefined" && new Audio(source));
  const [playing, setPlaying] = useState(false);

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

export const useChangeTitle = (defaultTitle) => {
  const [pageTitle, setPageTitle] = useState(defaultTitle); //page title
  const changePageTitle = useCallback((tempTitle) => {
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
