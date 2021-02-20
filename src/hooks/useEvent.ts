import { useState, SetStateAction, useCallback } from "react";
import move from "../utils/move";
import useEventBinding from "./useEventBinding";

function getClientX(e: MouseEvent | TouchEvent) {
  return "touches" in e ? e.changedTouches[0].clientX : e.clientX;
}

export default function useEvent<T extends HTMLElement>(options: {
  container: T | null;
  curIndex: number;
  speed: number;
  setCurIndex: (value: SetStateAction<number>) => void;
  loop: boolean;
  slidesPerView: number;
  draggable: boolean;
}): void {
  const {
    container,
    curIndex,
    speed,
    setCurIndex,
    loop,
    slidesPerView,
    draggable
  } = options;

  const slideWidth = container ? container.clientWidth / slidesPerView : 0;

  const [startClientX, setStartClientX] = useState<number | null>(null);

  const dragStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggable) return;
      e.preventDefault();
      setStartClientX(getClientX(e));
    },
    [draggable]
  );

  const dragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggable) return;

      e.preventDefault();

      if (startClientX === null || !container) return;

      const clientX = getClientX(e);

      const deltaX = clientX - startClientX;

      let movedDelta = deltaX;
      let updatedIndex = curIndex;

      if (!loop && curIndex === 0 && deltaX > 0) {
        // if it is not loop and when it is first slide, movedDelta will be smaller than deltaX, create bounce back effect
        movedDelta = Math.pow(deltaX, 9 / 10);
      }

      const childrenNum = container.querySelectorAll(".swiper-slide").length;

      if (!loop && curIndex >= childrenNum - slidesPerView && deltaX < 0) {
        movedDelta = -Math.pow(-deltaX, 9 / 10);
      }

      if (deltaX > 0 && loop) {
        updatedIndex = curIndex - Math.floor(deltaX / slideWidth);

        while (updatedIndex <= 0) updatedIndex += childrenNum;
      }

      if (deltaX < 0 && loop) {
        updatedIndex =
          (curIndex + Math.floor(-deltaX / slideWidth)) % childrenNum;
      }

      move({
        slideWidth,
        slidesPerView,
        container,
        loop,
        speed,
        leftStart: -curIndex * slideWidth,
        deltaX: movedDelta,
        curIndex: updatedIndex,
        rightStart: (childrenNum - curIndex) * slideWidth,
        animate: false
      });
    },
    [
      draggable,
      container,
      loop,
      slideWidth,
      slidesPerView,
      speed,
      startClientX,
      curIndex
    ]
  );

  const dragEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggable) return;
      if (!container || startClientX === null) return;
      const clientX = getClientX(e);

      const deltaX = clientX - startClientX;

      if (deltaX === 0) {
        setStartClientX(null);
        return;
      }

      let movedDelta = deltaX;
      let updatedIndex = curIndex;
      let finalDelta = deltaX > 0 ? slideWidth - deltaX : -slideWidth - deltaX;

      let newIndex = curIndex;

      const childrenNum = container.querySelectorAll(".swiper-slide").length;

      if (deltaX < 0) {
        newIndex = (curIndex + 1) % childrenNum;
      } else if (deltaX > 0) {
        if (curIndex === 0) {
          newIndex = childrenNum - 1;
        } else {
          newIndex = curIndex - 1;
        }
      }

      if (!loop && curIndex === 0 && deltaX > 0) {
        movedDelta = Math.pow(deltaX, 9 / 10);
        finalDelta = -Math.pow(deltaX, 9 / 10);
        newIndex = curIndex;
      }

      if (!loop && curIndex >= childrenNum - slidesPerView && deltaX < 0) {
        movedDelta = -Math.pow(-deltaX, 9 / 10);
        finalDelta = Math.pow(-deltaX, 9 / 10);
        newIndex = curIndex;
      }

      if (deltaX > 0 && loop) {
        updatedIndex = curIndex - Math.floor(deltaX / slideWidth);

        while (updatedIndex <= 0) updatedIndex += childrenNum;

        newIndex = updatedIndex - 1;

        finalDelta = slideWidth - (deltaX % slideWidth);
      }

      if (deltaX < 0 && loop) {
        updatedIndex =
          (curIndex + Math.floor(-deltaX / slideWidth)) % childrenNum;

        newIndex = (updatedIndex + 1) % childrenNum;

        finalDelta = -slideWidth - (deltaX % slideWidth);
      }

      move({
        slideWidth,
        slidesPerView,
        container,
        loop,
        speed,
        leftStart: -curIndex * slideWidth + movedDelta,
        deltaX: finalDelta,
        curIndex: updatedIndex,
        rightStart: (childrenNum - curIndex) * slideWidth + movedDelta,
        animate: true
      });

      setCurIndex(newIndex);

      setStartClientX(null);
    },
    [
      draggable,
      container,
      curIndex,
      setCurIndex,
      slideWidth,
      slidesPerView,
      loop,
      speed,
      startClientX
    ]
  );

  useEventBinding(container, "mousedown", dragStart);
  useEventBinding(container, "touchstart", dragStart);

  useEventBinding(container, "mousemove", dragMove);
  useEventBinding(container, "touchmove", dragMove);

  useEventBinding(container, "mouseup", dragEnd);

  useEventBinding(container, "mouseleave", dragEnd);
  useEventBinding(container, "touchend", dragEnd);
}
