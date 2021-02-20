export default function move<T extends HTMLElement>(options: {
  slidesPerView: number;
  slideWidth: number;
  container: T;
  animate?: boolean;
  speed: number;
  deltaX: number;
  leftStart: number;
  rightStart: number;
  curIndex: number;
  loop: boolean;
}): void {
  const {
    slidesPerView,
    slideWidth,
    container,
    loop,
    animate = true,
    speed,
    leftStart,
    deltaX,
    rightStart,
    curIndex
  } = options;

  if (!container) return;

  let startTime: number;

  const childrenNum = container.querySelectorAll(".swiper-slide").length;

  function moveAnimation(timestamp: number) {
    if (!startTime) startTime = timestamp;

    // elapsed: [0, 1], if it is not animated, elapsed always equals to 1
    const elapsed = animate ? Math.min((timestamp - startTime) / speed, 1) : 1;

    // transformX value
    let transform = leftStart + elapsed * deltaX;

    while (transform <= -childrenNum * slideWidth && loop)
      transform += childrenNum * slideWidth;
    while (transform > 0 && loop) transform -= childrenNum * slideWidth;

    const transformStrLeft = `translateX(${transform}px)`;

    // use it when we have multiple slide in one view with last slide and first slide in the same view
    let transformRight =
      (rightStart + elapsed * deltaX) % (childrenNum * slideWidth);

    while (transformRight < 0) transformRight += childrenNum * slideWidth;

    const transformStrRight = `translateX(${transformRight}px)`;

    for (let i = 0; i < childrenNum; i += 1) {
      const child = container.children[i] as HTMLElement;

      if (loop) {
        // when you swipe from left to right
        if (deltaX > 0) {
          if (i >= curIndex + slidesPerView - childrenNum) {
            child.style.transform = transformStrLeft;
          } else {
            child.style.transform = transformStrRight;
          }
        } else {
          if (i >= curIndex) {
            child.style.transform = transformStrLeft;
          } else {
            child.style.transform = transformStrRight;
          }
        }
      } else {
        // if there is no loop, transform value = transformStrLeft
        child.style.transform = transformStrLeft;
      }
    }

    if (elapsed < 1) {
      window.requestAnimationFrame(moveAnimation);
    }
  }

  window.requestAnimationFrame(moveAnimation);
}
