import { cloneElement, ReactElement, useEffect } from "react";
import ReactDOM from "react-dom";

function initPagination<T extends HTMLElement>(
  container: T,
  pagination: true | ((index: number) => ReactElement) | ReactElement,
  curIndex: number,
  moveTo: (index: number) => void
): void {
  const oldPaginationNode = container.querySelector(
    ".swiper-pagination-container"
  );

  if (oldPaginationNode) container.removeChild(oldPaginationNode);

  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("swiper-pagination-container");
  const paginationList = [];

  for (
    let i = 0;
    i < container.querySelectorAll(".swiper-slide").length;
    i += 1
  ) {
    if (pagination === true) {
      const paginationItem = document.createElement("span");
      paginationItem.classList.add("swiper-pagination-dot");
      paginationItem.classList.add("swiper-pagination-dot__default");

      if (curIndex === i) paginationItem.classList.add("active");

      paginationItem.addEventListener("click", () => moveTo(i));
      paginationContainer.appendChild(paginationItem);
    } else {
      const renderedComponent =
        typeof pagination === "function" ? pagination(i) : pagination;
      paginationList.push(
        cloneElement(renderedComponent, {
          onClick: () => moveTo(i),
          className: `${
            renderedComponent.props.className
              ? renderedComponent.props.className
              : ""
          } swiper-pagination-dot ${curIndex === i ? "active" : ""}`
        })
      );
    }
  }

  if (paginationList.length) {
    ReactDOM.render(paginationList, paginationContainer);
  }

  container.appendChild(paginationContainer);
}

export default function usePagination<T extends HTMLElement>(options: {
  container: T | null;
  pagination: boolean | ((index: number) => ReactElement) | ReactElement;
  curIndex: number;
  moveTo: (index: number) => void;
}): void {
  const { container, pagination, curIndex, moveTo } = options;

  useEffect(() => {
    if (!container || !pagination) return;

    const observer = new MutationObserver(mutationList => {
      if (
        mutationList.every(
          mutationRecord =>
            Array.from(mutationRecord.addedNodes).every(
              node =>
                !(node as HTMLElement).classList.contains(
                  "swiper-pagination-container"
                )
            ) &&
            Array.from(mutationRecord.removedNodes).every(
              node =>
                !(node as HTMLElement).classList.contains(
                  "swiper-pagination-container"
                )
            )
        )
      ) {
        initPagination(container, pagination, curIndex, moveTo);
      }
    });

    observer.observe(container, {
      childList: true,
      attributes: false,
      subtree: false
    });

    initPagination(container, pagination, curIndex, moveTo);

    return () => observer.disconnect();
  }, [container, curIndex, pagination, moveTo]);

  useEffect(() => {
    if (!container || !pagination) return;

    const paginationContainer = container.querySelector(
      ".swiper-pagination-container"
    );

    if (!paginationContainer) return;

    for (let i = 0; i < paginationContainer.children.length; i += 1) {
      const child = paginationContainer.children[i] as HTMLElement;

      if (i === curIndex) {
        child.classList.add("active");
      } else {
        child.classList.remove("active");
      }
    }
  }, [container, curIndex, pagination]);
}
