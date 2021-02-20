import { useState, useEffect } from "react";
import useWindowSize from "./useWindowSize";
import { OptionProps } from "../index";

export default function useResponsive(
  optionsSnapshot: OptionProps
): OptionProps {
  const [realOptions, setRealOptions] = useState<OptionProps>(optionsSnapshot);

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    const responsive = optionsSnapshot.responsive;
    if (!responsive) return;
    let responsiveIndex = 0;

    while (
      responsive[responsiveIndex] &&
      windowWidth > responsive[responsiveIndex][0]
    ) {
      responsiveIndex += 1;
    }

    if (!responsive[responsiveIndex]) {
      setRealOptions(optionsSnapshot);
      return;
    }

    setRealOptions(responsive[responsiveIndex][1]);
  }, [optionsSnapshot, windowWidth]);

  return realOptions;
}
