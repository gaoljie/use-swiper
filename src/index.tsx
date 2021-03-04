import { useState, ReactElement, useCallback, useEffect } from "react";
import "./swiper.scss";
import move from "./utils/move";
import useAutoPlay from "./hooks/useAutoPlay";
import useEvent from "./hooks/useEvent";
import usePagination from "./hooks/usePagination";
import useNavigation from "./hooks/useNavigation";
import useResponsive from "./hooks/useResponsive";
import useInit from "./hooks/useInit";
import useWindowSize from "./hooks/useWindowSize";

export interface SlideProps<T> {
  ref: (instance: T) => void;
  prev: () => void;
  next: () => void;
  moveTo: (index: number) => void;
}

interface RawOptionProps {
  autoPlay?: boolean;
  initial?: number;
  duration?: number;
  slidesPerView?: number;
  speed?: number;
  loop?: boolean;
  pagination?: boolean;
  navigation?: boolean;
  draggable?: boolean;
  arrowLeft?: ReactElement;
  arrowRight?: ReactElement;
}

export type OptionProps = RawOptionProps & {
  responsive?: [number, RawOptionProps][];
};

export default function useSwiper<T extends HTMLElement>(
  options: OptionProps = {}
): SlideProps<T> {
  const [optionsSnapshot] = useState({
    ...options,
    responsive: options.responsive
      ? options.responsive.sort((a, b) => a[0] - b[0])
      : options.responsive
  });

  const realOptions = useResponsive(optionsSnapshot);

  const {
    speed = 300,
    initial = 0,
    autoPlay = false,
    duration = 3000,
    loop = false,
    slidesPerView = 1,
    pagination = false,
    navigation = false,
    draggable = true,
    arrowLeft,
    arrowRight
  } = realOptions;

  const [container, setContainer] = useState<T | null>(null);

  const callbackRef = useCallback((instance: T) => {
    setContainer(instance);
  }, []);

  const [curIndex, setCurIndex] = useState(initial);

  const { width: windowWidth } = useWindowSize();

  const prev = useCallback(() => {
    setCurIndex(prev => {
      if (!container) return prev;

      if (!loop && prev === 0) return prev;

      const slideWidth = container.clientWidth / slidesPerView;

      let newIndex;

      const childrenNum = container.querySelectorAll(".swiper-slide").length;

      if (prev === 0) {
        newIndex = childrenNum - 1;
      } else {
        newIndex = prev - 1;
      }

      let updatedIndex = prev;

      while (updatedIndex <= 0) updatedIndex += childrenNum;

      move({
        slideWidth,
        slidesPerView,
        container,
        loop,
        speed,
        leftStart: -prev * slideWidth,
        deltaX: slideWidth,
        curIndex: updatedIndex,
        rightStart: (childrenNum - prev) * slideWidth,
        animate: true
      });

      return newIndex;
    });
  }, [container, loop, slidesPerView, speed]);

  const next = useCallback(() => {
    setCurIndex(prev => {
      if (!container) return prev;

      const childrenNum = container.querySelectorAll(".swiper-slide").length;

      if (!loop && prev >= childrenNum - slidesPerView) return prev;

      const slideWidth = container.clientWidth / slidesPerView;

      move({
        slideWidth,
        slidesPerView,
        container,
        loop,
        speed,
        leftStart: -prev * slideWidth,
        deltaX: -slideWidth,
        curIndex: prev,
        rightStart: (childrenNum - prev) * slideWidth,
        animate: true
      });

      return (prev + 1) % childrenNum;
    });
  }, [container, loop, slidesPerView, speed]);

  const moveTo = useCallback(
    (index: number) => {
      setCurIndex(prev => {
        if (!container) return prev;

        const childrenNum = container.querySelectorAll(".swiper-slide").length;

        const slideWidth = container.clientWidth / slidesPerView;

        move({
          slideWidth,
          slidesPerView,
          container,
          loop,
          speed,
          leftStart: -prev * slideWidth,
          deltaX: (prev - index) * slideWidth,
          curIndex: prev,
          rightStart: (childrenNum - prev) * slideWidth,
          animate: true
        });

        return index;
      });
    },
    [container, loop, slidesPerView, speed]
  );

  useEffect(() => {
    moveTo(curIndex);
    // eslint-disable-next-line
  }, [windowWidth]);

  useInit({
    container,
    setCurIndex,
    slidesPerView
  });

  useEvent({
    container,
    curIndex,
    speed,
    setCurIndex,
    loop,
    slidesPerView,
    draggable
  });

  useAutoPlay({
    container,
    cb: next,
    duration,
    autoPlay
  });

  useNavigation({
    container,
    navigation,
    prev,
    next,
    arrowLeft,
    arrowRight
  });

  usePagination({
    container,
    pagination,
    curIndex,
    moveTo
  });

  const slide = {
    ref: callbackRef,
    prev,
    next,
    curIndex,
    moveTo
  };

  return slide;
}
