import { useEffect } from "react";

const useClickOutsideClose = (elementRef, show, setShow) => {
  useEffect(() => {
    if (!show) return;
    const handleClick = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [show, elementRef]);
};

export default useClickOutsideClose;
