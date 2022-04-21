import { useEffect,RefObject, Dispatch, SetStateAction } from "react";


const useClickOutsideClose = (elementRef:RefObject<HTMLDivElement | HTMLUListElement>, setShow:Dispatch<SetStateAction<boolean>>):void => {
  useEffect(() => {
    const handleClick = (e:MouseEvent):void => {
      if (elementRef.current && !elementRef.current.contains(e.target  as Node)) {
        setShow(false);
      }
    };
    window.addEventListener("click", handleClick, { capture: true });

    return () =>
      window.removeEventListener("click", handleClick, { capture: true });
  }, [setShow, elementRef]);
};

export default useClickOutsideClose;
