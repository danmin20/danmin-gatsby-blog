---
emoji: 🎨
title: '애니메이션을 그린다고요? setTimeout 싫어요! requestAnimationFrame 좋아요!'
date: '2023-06-01'
categories: Dev
---

`setTimeout`과 `setInterval`이 정확한 타이머 주기를 보장하지 않는다는 사실, 알고 계신가?  
`setTimeout`과 `setInterval`이 불필요한 리소스를 소비할 가능성이 있다는 사실, 알고 계신가?  
`setTimeout`과 `setInterval`이 비동기적으로 작업을 비동기적으로 예약한다는 사실, 알고 계신가?

&nbsp;

![](0.jpeg)

&nbsp;

## requestAnimationFrame이란?
`requestAnimationFrame`은 브라우저에서 제공하는 메서드로, 애니메이션과 그 외의 반복 작업을 수행하기 위해 사용된다. 이 메서드는 브라우저의 리페인트 주기에 맞게 콜백 함수를 실행하도록 예약한다. 콜백 함수는 화면이 갱신되기 전에 실행되므로, 부드럽고 성능이 좋은 애니메이션 효과를 구현할 수 있다.

&nbsp;

## requestAnimationFrame을 사용해보자!
```js
const animate = (timestamp) => {
  // 애니메이션 로직
  
  // 다음 프레임 요청
  requestAnimationFrame(animate);
}

// 첫 번째 프레임 요청
requestAnimationFrame(animate);
```

1. `requestAnimationFrame`을 호출할 때, 실행하고자 하는 콜백 함수를 전달한다. 이 콜백 함수는 브라우저에서 리페인트 주기에 따라 호출된다.
2. 콜백 함수는 브라우저에 의해 전달되는 단일 인수로 실행된다. 이 인수는 `DOMHighResTimeStamp` 형식으로 제공되며, 현재 프레임에서 콜백들이 실행되기 시작한 시각을 나타낸다. `performance.now()`처럼 페이지가 열린 시점을 기준으로 잰 값이라, 애니메이션을 시작한 뒤 얼마나 지났는지는 첫 콜백에서 받은 값을 저장해 두고 빼서 구해야 한다. 이 값을 활용하여 애니메이션을 제어할 수 있다.
3. 콜백 함수 내에서 원하는 애니메이션 또는 작업을 구현한다. 주로 `requestAnimationFrame`을 다시 호출하여 다음 리페인트 주기에 대한 콜백을 예약한다.
4. 애니메이션이 더 이상 필요하지 않을 때, 콜백 함수 내에서 `requestAnimationFrame`을 호출하는 대신 애니메이션을 중지시킬 수 있다.

&nbsp;

## (a.k.a)RAF가 setTimeout/setInterval보다 효율적인 이유?

### 1. 최적화된 리페인트 주기
`requestAnimationFrame`은 브라우저의 리페인트 주기에 맞게 콜백을 예약한다. 이는 브라우저가 화면을 갱신하는 주기와 동일하기 때문에 애니메이션을 매끄럽게 실행할 수 있다. 반면에 `setTimeout` 또는 `setInterval`은 정확한 타이머 주기를 보장하지 않기 때문에 애니메이션이 끊어지거나 부자연스러워질 수 있다.

### 2. 배터리 및 성능 최적화
`requestAnimationFrame`은 브라우저의 최적화된 애니메이션 처리 방식을 활용하여, 사용자의 디바이스 성능과 배터리 수명을 고려한다. 이는 애니메이션이 디바이스에서 더 효율적으로 실행되게 하고, 배터리 소모를 최소화하여 사용자 경험을 향상시킨다. 반면에 `setTimeout` 또는 `setInterval`은 고정된 타이머 주기를 사용하므로 불필요한 작업과 배터리 소모가 발생할 수 있다.

### 3. 백그라운드 탭의 처리 제한
브라우저는 비활성 상태의 탭 또는 백그라운드에서 실행되는 탭의 처리를 제한할 수 있다. `requestAnimationFrame`은 브라우저가 애니메이션에 대한 처리를 조절할 수 있는 기능을 제공하여, 비활성 상태에서 불필요한 계산을 줄이고 성능을 최적화할 수 있다. 반면에 `setTimeout` 또는 `setInterval`은 주어진 시간 간격에 관계없이 계속해서 작업을 실행하므로 백그라운드에서 불필요한 리소스를 소비할 가능성이 있다.

### 4. 동기화된 작업 처리
`requestAnimationFrame`은 다른 브라우저 작업과 동기화되어 실행된다. 즉, 애니메이션과 관련된 작업을 브라우저의 리페인트 주기에 맞추어 수행할 수 있다는 뜻이다. 반면에 `setTimeout` 또는 `setInterval`은 시간 간격에 따라 비동기적으로 작업을 예약하므로 다른 브라우저 작업과의 동기화가 보장되지 않을 수 있다.

&nbsp;

## 실제로 애니메이션을 구현해보자!

### 1. setTimeout
```jsx
const BoxSTO = () => {
  const boxRef = useRef(null);
  const startX = 0;
  const distance = 300;
  let startTime = null;

  const animateWithSTO = useCallback(() => {
    const moveBox = () => {
      if (!startTime) {
        startTime = Date.now();
      }

      const elapsed = Date.now() - startTime;
      const newX = startX + (elapsed / 1000) * distance;
      boxRef.current.style.transform = `translateX(${newX}px)`;

      if (newX < startX + distance) {
        setTimeout(moveBox, 16); // 16ms 간격으로 호출 (약 60fps)
      } else {
        // 애니메이션 완료 후 다시 애니메이션 시작
        startTime = null;
        setTimeout(moveBox, 16);
      }
    }

    moveBox();
  }, []);

  useEffect(() => {
    animateWithSTO();
  }, [animateWithSTO]);

  return <div ref={boxRef} className="box"></div>;
};
```

### 2. requestAnimationFrame
```jsx
const BoxRAF = () => {
  const boxRef = useRef(null);
  const startX = 0;
  const distance = 300;
  let startTime = null;

  const animateWithRAF = useCallback((timestamp) => {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const newX = startX + (elapsed / 1000) * distance;
    boxRef.current.style.transform = `translateX(${newX}px)`;

    if (newX < startX + distance) {
      requestAnimationFrame(animateWithRAF);
    } else {
      // 애니메이션 완료 후 다시 애니메이션 시작
      startTime = null;
      requestAnimationFrame(animateWithRAF);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(animateWithRAF);
  }, [animateWithRAF]);

  return <div ref={boxRef} className="box"></div>;
};
```

위 두 예시를 실제로 동작시켜보면, 눈으로도 그 차이를 느낄 수 있다.  
(위가 `setTimeout`, 아래가 `requestAnimationFrame`)

![](1.gif)

&nbsp;

> gif라 큰 차이가 느껴지지 않는데, 실제로 브라우저에서 확인해보면 차이가 크게 난다..! 🥲

![](2.jpeg)

&nbsp;

## 조금 더 자세히 알아보자면..

### 1. cancelAnimationFrame
requestAnimationFrame은 요청 ID를 반환하는데, 이 ID와 cancelAnimationFrame을 사용하여 애니메이션을 중지할 수 있다. 
```jsx
useEffect(() => {
  const requestId = requestAnimationFrame(animateWithRAF);

  return () => {
    cancelAnimationFrame(requestId);
  };
}, [animateWithRAF]);
```

&nbsp;

### 2. DOMHighResTimeStamp
애니메이션의 부드러운 동작을 위해 각 프레임에서 변화되는 속성을 애니메이션 이전의 상태에서 애니메이션 이후의 상태로 부드럽게 변화시키는 보간(interpolation)을 적용하는 것이 일반적인데, 이를 위해 `DOMHighResTimeStamp` 값을 이용하여 애니메이션 진행 상태를 계산하고 속성을 업데이트할 수 있다.

> **보간법이란?**  
> 주어진 값들 사이에서 새로운 값을 추정 또는 계산하는 기술이다. 애니메이션에서는 보간법을 사용하여 애니메이션 진행 상태에 따라 중간 값을 계산하여 부드러운 움직임을 만들어낸다. 일반적으로 선형 보간법(Linear Interpolation)이 가장 많이 사용되며, 시작 값과 끝 값 사이에서 일정한 비율에 따라 중간 값들을 계산한다. 이러한 보간법을 사용하면 애니메이션에 부드러운 전환 효과를 부여할 수 있다.

`DOMHighResTimeStamp`는 `requestAnimationFrame`의 콜백 함수에 전달되는 인수(위의 timestamp)로, 현재 프레임이 시작된 시간을 나타내는 고해상도 타임스탬프다. 이 값을 사용하여 애니메이션의 진행 상태를 계산하고 애니메이션 속성을 업데이트할 수 있다.

&nbsp;

### 3. 속도 조절
`requestAnimationFrame`은 브라우저의 리페인트 주기에 따라 호출된다. 만약 프레임 속도에 따라 애니메이션 속도를 조절하고 싶다면, 시간의 경과에 따라 애니메이션의 진행 상태를 조정하는 로직을 추가해야 할 수 있다.

이전의 예시 코드에 로직을 추가해보자.
```jsx
const BoxRAF = () => {
  const boxRef = useRef(null);
  const startX = 0;
  const distance = 300;
  let startTime = null;
  let prevTimestamp = null;
  const targetFPS = 60; // 목표 프레임 속도 (예: 60fps)
  const speedFactor = targetFPS / 60; // 목표 프레임 속도 대비 속도 계수

  const animateWithRAF = useCallback((timestamp) => {
    if (!startTime) {
      startTime = timestamp;
    }

    if (!prevTimestamp) {
      prevTimestamp = timestamp;
    }

    const elapsed = timestamp - startTime;
    prevTimestamp = timestamp;

    const newX = startX + (elapsed / 1000) * distance * speedFactor;
    boxRef.current.style.transform = `translateX(${newX}px)`;

    if (newX < startX + distance) {
      requestAnimationFrame(animateWithRAF);
    } else {
      // 애니메이션 완료 후 다시 애니메이션 시작
      startTime = null;
      prevTimestamp = null;
      requestAnimationFrame(animateWithRAF);
    }
  }, []);

  useEffect(() => {
    const requestId = requestAnimationFrame(animateWithRAF);

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [animateWithRAF]);

  return <div ref={boxRef} className="box"></div>;
};
```

&nbsp;

### 3. 물론, 단순 애니메이션 외에도...

`requestAnimationFrame`은 애니메이션 외에도 브라우저의 리페인트 주기와 동기화된 작업(예를 들어, 사용자 인터페이스의 상태를 업데이트하거나 렌더링을 수행하는 작업)을 수행할 수 있는 메서드다.

시계를 실시간으로 업데이트하는 예시를 들 수 있겠다.
```jsx
const Clock = () => {
  const [time, setTime] = useState(new Date());

  const updateClock = useCallback(() => {
    setTime(new Date());
    requestAnimationFrame(updateClock);
  }, []);

  useEffect(() => {
    const requestId = requestAnimationFrame(updateClock);

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [updateClock]);

  return (
    <div>
      <p>Current Time: {time.toLocaleTimeString()}</p>
    </div>
  );
};
```

```toc
```