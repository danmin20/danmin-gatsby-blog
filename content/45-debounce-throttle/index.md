---
emoji: ✋
title: '이벤트 멈춰! Debounce와 Throttle'
date: '2023-07-20'
categories: Dev
---

input 또는 scroll 이벤트를 아무 생각 없이 다루다보면 내 의도와 다르게 엄청나게 많은 요청이 발생하게 되곤 한다. 예를 들어, 스크롤 이벤트가 걸려있는 상태에서 스크롤을 몇 천 픽셀 내리게 되면 100개 이상의 스크롤 이벤트에 대한 콜백이 발생할 것이고, 이는 엄청난 리소스를 잡아먹을 것이다..!

![](0.gif)

바로 이때 `Debounce`나 `Throttle`을 사용하여 이벤트나 함수의 실행 빈도를 줄여 성능을 높일 수 있다. 이벤트 핸들러가 많은 연산을 수행할 때, 제약을 걸어 제어할 수 있는 수준으로 이벤트를 발생시키게끔 하는 것이다.

그렇다면 이 둘의 차이는 뭘까?

&nbsp;

## Debounce

`Debounce`는 이벤트를 그룹화하여 특정 시간이 지난 후 하나의 이벤트만 발생하도록 하는 것이다. 즉, 연이어 호출되는 함수들 중 마지막 또는 제일 처음만 호출하도록 하는 것이다. 따라서 일정 시간 내에 이벤트가 계속 발생하면 함수가 실행되지 않다가, 이후 일정 시간 동안 이벤트가 발생하지 않으면 함수가 실행된다.

특히 텍스트 인풋에 글자를 입력할 때 `Debounce`를 유용하게 사용할 수 있다. 사용자가 **크리스피크림**을 빠르게 입력한다고 해보자.

![](1.gif)
> 배고프다..

입력하는 중간에 만들어지는 'ㅋ', '크릿', '크리스핔' 등과 같은 글자에 대한 함수 요청은 우리가 바라는 게 단연코 아니다. 따라서 마지막에 입력되는 '크리스피크림'에 대한 함수 요청만 발생할 수 있도록 `Debounce`를 걸어주는 것이다.

&nbsp;

## Throttle

`Throttle`은 이벤트를 일정 주기마다 발생하도록 하는 것이다. 즉, 마지막 함수가 호출된 후 일정 시간이 지나기 전에는 다시 호출되지 않도록 하는 것이다. 실행 횟수에 제한을 거는 것이기에 스크롤과 같은 이벤트에서 많이 사용된다. 만일 스크롤 이벤트에 `Debounce`를 사용하게 되면 스크롤을 잠깐 멈출 때까지 어느 요청도 가지 않을 것이다. 반면 `Throttle`을 사용한다면 일정 주기마다의 함수 실행이 보장된다.

&nbsp;

## 훅을 만들어보자!

리액트 프로젝트를 할 때마다 만드는 공통 hook 중에 탑3에는 드는 것 같은 `useDebounce`와 `useThrottle`..

![](2.jpeg)
> 제가 직접 한번 해보겠습니다

&nbsp;

### useDebounce

```ts
export const useDebounce = <T extends unknown[]>(
  func: (...args: T) => void | Promise<void>,
  wait = 1000
) => {
  // useRef를 사용하여 timeout 값을 관리한다.
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  // useCallback을 이용하여 debouncedFn 함수를 메모이제이션한다.
  const debouncedFn = useCallback(
    (...args: T) => {
      // timeout.current는 현재 활성화된 setTimeout의 ID를 참조한다.
      if (timeout.current) {
        // 2. 이미 setTimeout이 설정된 상태라면 clearTimeout을 통해 취소한다.
        clearTimeout(timeout.current);
      }

      // 1. 최초 호출 시 setTimeout이 설정된다.
      // 3. 새로운 setTimeout을 설정한다.
      timeout.current = setTimeout(() => {
        func(...args);
      }, wait);
    },
    [wait]
  );

  // 컴포넌트가 언마운트될 때 이전에 설정된 setTimeout을 취소한다.
  // 따라서 컴포넌트가 해제될 때 불필요한 타임아웃이 실행되지 않는다.
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return debouncedFn;
};
```

```ts
export const Example = () => {
  const [text, setText] = useState('');

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = useDebounce((e) => {
    setText(e.target.value);
  }, 300);

  return <input onChange={handleTextChange} />;
};
```

&nbsp;

### useThrottle

```ts
export const useThrottle = <T extends unknown[]>(
  callback: (...params: T) => void,
  time = 1000
) => {
  // useRef를 사용하여 timeout 값을 관리한다.
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  // useRef를 사용하여 nextArgs를 관리한다. 다음으로 실행할 콜백 함수에 전달할 인수들을 저장한다.
  const nextArgs = useRef<T>();

  const throttledFn = (...args: T) => {
    if (!timeout.current) {
      // 1. 설정된 setTimeout이 없다면 즉시 콜백을 실행한다.
      callback(...args);
      
      const timeoutCallback = () => {
        if (nextArgs.current) {
          // 4. nextArgs에 저장된 인수들을 가지고 다시 콜백을 실행한다.
          callback(...nextArgs.current);
          nextArgs.current = undefined;

          // 5. 새로운 setTimeout을 설정한다.
          timeout.current = setTimeout(timeoutCallback, time);
          return;
        }
        timeout.current = undefined;
      };

      // 2. setTimeout에서 시간이 경과한다.
      timeout.current = setTimeout(timeoutCallback, time);
      return;
    }

    // 3. 이미 setTimeout이 설정된 상태라면 nextArgs를 저장한다.
    nextArgs.current = args;
  };

  // 컴포넌트가 언마운트될 때 이전에 설정된 setTimeout을 취소한다.
  // 따라서 컴포넌트가 해제될 때 불필요한 타임아웃이 실행되지 않는다.
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return throttledFn;
}
```

```ts
export const Example = (key: string) => {
  const storePosition = useThrottle(() => {
    sessionStorage.setItem(key, `${window.scrollY}`);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', storePosition);

    return () => {
      window.removeEventListener('scroll', storePosition);
    };
  }, []);
};
```

```toc
```