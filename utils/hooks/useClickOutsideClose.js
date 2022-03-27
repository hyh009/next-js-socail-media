import { useEffect } from "react";

const useClickOutsideClose = (elementRef, setShow) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    window.addEventListener("click", handleClick, { capture: true });

    return () =>
      window.removeEventListener("click", handleClick, { capture: true });
  }, [setShow, elementRef]);
};

export default useClickOutsideClose;
