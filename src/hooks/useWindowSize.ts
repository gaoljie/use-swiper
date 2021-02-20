import { useState, useEffect, useCallback } from "react";
import isClient from "../utils/isClient";

export default function useWindowSize(): { width: number; height: number } {
  const getSize = useCallback(() => {
    return {
      width: isClient ? window.innerWidth : 0,
      height: isClient ? window.innerHeight : 0
    };
  }, []);

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [getSize]);

  return windowSize;
}
