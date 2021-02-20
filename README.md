### Installation

#### yarn

`yarn add use-swiper`

#### npm

`npm install use-swiper`

#### include css

```js
import "use-swiper/lib/swiper.min.css";
```

### Basic Usage

```tsx
import React from "react";
import useSwiper from "use-swiper";

const App = () => {
  const { ref } = useSwiper();
  const list = [1, 2, 3, 4, 5];
  return (
    <div ref={ref}>
      {list.map(item => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};
```

### Documentation

[Doc](https://gaoljie.github.io/use-swiper/)
