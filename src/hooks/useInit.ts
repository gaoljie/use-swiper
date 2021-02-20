import { SetStateAction, useEffect } from "react";

function init<T extends HTMLElement>(container: T, slidesPerView: number) {
  container.classList.add("swiper-container");

  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i] as HTMLElement;

    if (
      child.classList.contains("swiper-pagination-container") ||
      child.classList.contains("swiper-navigation-container")
    )
      continue;

    child.classList.add("swiper-slide");

    child.style.width = `${(1 / slidesPerView) * 100}%`;
  }
}

export default function useInit<T extends HTMLElement>(options: {
  container: T | null;
  setCurIndex: (value: SetStateAction<number>) => void;
  slidesPerView: number;
}): void {
  const { container, setCurIndex, slidesPerView } = options;

  useEffect(() => {
    if (!container) return;
    setCurIndex(0);

    const observer = new MutationObserver(() => {
      init(container, slidesPerView);
    });

    observer.observe(container, {
      childList: true,
      attributes: false,
      subtree: false
    });

    init(container, slidesPerView);

    return () => observer.disconnect();
  }, [setCurIndex, container, slidesPerView]);
}
