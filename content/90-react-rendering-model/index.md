---
emoji: 📸
title: '리액트의 state는 변수가 아니라 스냅샷이다'
date: '2026-09-23'
categories: Dev
---

> state, 클로저, ref, effect, 순수성, race condition. 따로따로 검색하게 되는 문제들이 사실 한 가지 모델에서 나온다는 이야기.

&nbsp;

리액트를 쓰다 보면 한 번씩 만나는 장면들이 있다.

`setInterval` 안에서 `count`를 찍었는데 버튼을 아무리 눌러도 0만 나온다.  
`ref.current`를 바꿨는데 화면이 안 바뀐다.  
검색창에 "react"를 쳤는데 결과 목록에는 "r"로 검색한 결과가 떠 있다.  
StrictMode를 켰더니 effect가 두 번 돈다.

보통 이럴 때 증상별로 검색해서 하나씩 해결한다. 의존성 배열에 넣고, ref 대신 state를 쓰고, AbortController를 붙이고, StrictMode는 원래 그렇다는 글을 읽고 넘어간다.  
그런데 넷 다 원인이 같다.  
리액트가 컴포넌트를 어떻게 실행하는지 하나만 제대로 알면 전부 정상 동작이다.

state는 변수가 아니라 스냅샷이다.  
이 한 문장이 어디까지 설명해주는지 따라가 볼 생각이다.

![](0.jpg)

&nbsp;

## 렌더링은 함수 호출이다

컴포넌트는 함수다. 그리고 그 함수를 호출하는 건 리액트다.

```tsx
const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

버튼을 누르면 리액트가 `Counter`를 다시 호출한다.  
다시 호출한다는 건 함수 본문이 처음부터 다시 실행된다는 뜻이다. `useState`도 다시 실행되고, `count`라는 이름도 새로 만들어진다.

```text
첫 번째 호출:  count = 0
두 번째 호출:  count = 1
세 번째 호출:  count = 2
```

여기서 `count`는 렌더마다 값이 바뀌는 변수가 아니다.  
호출마다 새로 만들어지는 지역 변수고, 리액트는 한 번 건네준 값을 그 호출 도중에 바꿔주지 않는다.  
우리가 `const`로 받는 건 그 사실을 문법으로 못 박아두는 것뿐이다. `let`으로 받아서 재할당해도 리액트는 모른다.  
리액트가 "이번 호출에서는 이 값을 써라"고 건네준 것이고, 우리는 그걸 받아서 JSX를 만들어 돌려준다.

그래서 `setCount`는 `count`를 바꾸는 함수가 아니다.  
"다음 호출에서는 이 값을 건네줘"라고 리액트에 요청하는 함수다.  
지금 실행 중인 함수 안의 `count`는 그대로다.

```tsx
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```

이걸 누르면 3이 아니라 1이 된다.  
세 줄 모두 이번 호출의 `count`인 0을 읽고 있어서, 리액트에는 "다음엔 1로"라는 요청이 세 번 들어간 것이다.  
`count`가 변수였다면 3이 됐을 것이다.

> 훅이 호출 순서에 의존하는 이유도 여기서 나온다. 매 호출마다 `useState`가 다시 실행되니, 리액트는 "몇 번째 훅인지"로 어느 값을 건네줄지 찾는다. [useState를 반복문과 조건문에서 사용할 수 없는 이유](https://www.jeong-min.com/75-use-state/)에서 다뤘다.

&nbsp;

## 핸들러는 자기가 태어난 렌더를 기억한다

함수 안에서 만들어진 함수는 그 시점의 변수를 기억한다. 클로저다.  
컴포넌트 안에서 만든 이벤트 핸들러도 예외가 아니다.

```tsx
const Counter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      alert(count);
    }, 3000);
  };

  return (
    <>
      <button onClick={handleClick}>3초 뒤 알림</button>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </>
  );
};
```

`count`가 0일 때 첫 버튼을 누르고, 3초 안에 두 번째 버튼을 다섯 번 누르면 알림에는 뭐가 뜰까.  
5가 아니라 0이다.

첫 버튼을 눌렀을 때 실행된 `handleClick`은 `count`가 0인 호출에서 만들어진 함수다.  
그 안의 `setTimeout` 콜백도 마찬가지다. 그 함수들이 아는 `count`는 0이고, 이후에 리액트가 `Counter`를 다섯 번 더 호출해서 새 `count`들이 생겨도 이미 만들어진 함수의 `count`는 바뀌지 않는다.  
새 호출에는 새 `handleClick`이 만들어질 뿐이다.

버그처럼 보이지만 리액트 입장에서는 당연한 결과다.  
렌더 하나는 그 시점의 props, state, 핸들러를 담은 사진 한 장이고, 그 안에서 만들어진 함수는 그 사진에 찍힌 값을 본다.

> 클로저 자체에 대해서는 [클로저와 더 가까워지기](https://www.jeong-min.com/50-closure/)에서 다뤘다.

&nbsp;

## 그래서 setInterval 안의 count는 0이다

이제 처음에 말한 `setInterval` 문제를 보자.

```tsx
const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

버튼을 눌러 화면의 숫자가 1, 2, 3으로 올라가도 콘솔에는 0만 찍힌다.

의존성 배열이 비어 있으니 effect는 첫 호출에서 한 번만 실행된다.  
그때 만들어진 `setInterval` 콜백은 첫 호출의 `count`, 즉 0을 기억한다.  
이후 호출들에는 1, 2, 3인 `count`가 있지만, 콘솔을 찍는 함수는 여전히 첫 호출에서 만들어진 그 함수다.

이렇게 옛 렌더의 값을 물고 있는 함수를 보통 stale closure라고 부른다.  
앞 절의 알림 예제와 같은 현상인데, 타이머가 계속 살아 있어서 더 눈에 띄는 것뿐이다.

&nbsp;

그럼 의존성에 `count`를 넣으면 되지 않나.

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);
  return () => clearInterval(id);
}, [count]);
```

최신 값이 찍히긴 한다. 하지만 `count`가 바뀔 때마다 이전 interval을 지우고 새 interval을 만든다.

```text
count = 0 → interval A 생성
count = 1 → A 정리, interval B 생성
count = 2 → B 정리, interval C 생성
```

1초 간격이 유지되는 게 아니라, 버튼을 누를 때마다 타이머가 0초부터 다시 시작된다.  
클릭 간격이 1초보다 짧으면 타이머가 첫 틱을 찍기 전에 지워지고 새로 시작되니, 연타하는 동안에는 로그가 한 번도 안 찍힌다. 손을 놓고 1초가 지나야 찍힌다.  
동작은 하지만 "interval 하나를 계속 돌리면서 최신 값을 읽는다"는 원래 의도와는 다르다.

의도를 그대로 살리려면 이번 렌더의 `count`를 캡처하지 않는 방법이 필요하다.  
interval 안에서 값을 바꾸는 게 목적이라면 `setCount((c) => c + 1)`처럼 함수형 업데이트로 최신 값을 받을 수 있지만, 지금은 값을 읽어야 하는 경우라 다른 통로가 필요하다.

&nbsp;

값을 읽어야 하면 ref를 사용해야 한다.

```tsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

리액트 19.2부터는 `useEffectEvent`가 이 패턴을 대신한다.

```tsx
const onTick = useEffectEvent(() => {
  console.log(count);
});

useEffect(() => {
  const id = setInterval(() => onTick(), 1000);
  return () => clearInterval(id);
}, []);
```

`onTick`은 항상 최신 렌더의 `count`를 보고, effect의 의존성에는 들어가지 않는다.  
"effect 자체는 한 번만 설정하되, 그 안에서 실행되는 로직은 최신 값을 본다"는 요구를 위해 만들어진 훅이다.

둘 다 스냅샷 밖에 있는 상자에서 최신 값을 읽어온다는 점은 같다.  
`useEffectEvent`도 안을 열어보면 렌더마다 새로 만들어진 콜백을 ref 같은 상자에 커밋 시점에 갈아 끼우는 구조다. 상자에 값이 아니라 함수를 넣어두는 것만 다르다.

&nbsp;

## state와 ref는 어디가 다른가

ref로 최신 값을 읽을 수 있다면, 처음부터 `count`를 ref에 두면 안 되는 걸까?

```tsx
const Counter = () => {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current += 1;
  };

  return <button onClick={handleClick}>{countRef.current}</button>;
};
```

버튼을 눌러도 화면은 0이다.

`countRef.current`는 정말로 1이 됐다. 콘솔에 찍어보면 올라간다.  
하지만 리액트에 다음 호출을 요청한 게 없다. `Counter`가 다시 실행되지 않았으니 JSX도 다시 만들어지지 않았고, DOM에는 첫 호출에서 계산된 0이 그대로 남아 있다.  
어쩌다 다른 이유로 리렌더가 일어나면 그때 갑자기 바뀐 값이 나타난다.

둘 다 렌더 사이에 값을 보존하지만, state를 바꾸면 리액트가 다음 호출을 예약하고 ref를 바꾸면 아무 일도 안 일어난다.  
그러니 이 값이 바뀌었을 때 화면도 다시 그려져야 하면 state, 아니면 ref다.  
화면에 보이는 `count`를 ref로 옮기면 안 되는 이유이고, 타이머 id나 DOM 노드, 이전 값, 스크롤 위치처럼 바뀌어도 화면과 상관없는 값을 ref에 두는 이유다.

ref는 스냅샷 모델 바깥에 있는 상자다.  
렌더마다 새로 만들어지지 않고 컴포넌트가 살아 있는 동안 하나만 존재하며, 어느 렌더에서 만들어진 함수든 같은 상자를 본다.  
그래서 stale closure를 피하는 통로가 될 수 있었던 것이고, 같은 이유로 렌더 중에 `ref.current`를 읽어서 JSX를 결정하면 안 된다.  
같은 props와 state로 불러도 결과가 달라질 수 있게 되어서, 스냅샷이라는 전제가 깨진다.

&nbsp;

## 리액트는 렌더를 버릴 수 있다

여기까지 렌더마다 자기 스냅샷을 본다는 전제로 이야기했는데, 이게 성립하려면 렌더가 순수해야 한다.  
같은 props와 state면 같은 JSX가 나와야 하고, 렌더 도중에 바깥을 건드리면 안 된다.

왜 이게 필요한지는 리액트가 렌더를 어떻게 다루는지 보면 알 수 있다.  
리액트는 컴포넌트를 한 번 호출했다고 그 결과를 반드시 화면에 반영하지 않는다.  
더 급한 업데이트가 들어오면 하던 렌더를 버리고 다시 시작한다. transition과 Suspense가 이렇게 동작한다.

```tsx
let renderCount = 0;

const Component = () => {
  renderCount++;
  return <div>{renderCount}</div>;
};
```

이 컴포넌트는 호출 횟수에 따라 결과가 달라진다.  
리액트가 렌더 하나를 버렸다고 해도 `renderCount++`는 되돌릴 수 없다.  
반대로 `props.count`를 그대로 보여주는 컴포넌트는 한 번 부르든 열 번 부르든 같은 결과고 바깥에 흔적도 없다.  
그래야 리액트가 마음 놓고 렌더를 재시도하거나 버릴 수 있다.

문제는 이런 일이 프로덕션에서 언제 일어날지 예측하기 어렵다는 점이다.  
transition으로 목록을 그리는 데 200ms가 걸린다면, 그 사이에 사용자가 글자를 하나 더 치면 렌더가 버려지고 다시 시작되며, 아무것도 치지 않으면 그대로 커밋된다.  
같은 코드가 사용자의 손 타이밍에 따라 한 번 실행되기도, 버려지고 두 번 실행되기도 한다. 이런 버그는 재현하려고 하면 안 나온다.  
그래서 개발 환경의 StrictMode는 컴포넌트를 일부러 두 번 호출하고 첫 번째 결과를 버린다.  
렌더가 버려지는 상황을 미리 만들어보는 것이다. 위의 `renderCount`는 StrictMode에서 2부터 시작하고, 그게 이 컴포넌트가 순수하지 않다는 신호다.  
렌더가 순수하면 두 번 불려도 아무 차이가 없으니, 차이가 나는 컴포넌트만 걸러진다.

렌더 중에 `setState`를 부르는 것도 같은 문제다.

```tsx
// ❌ 렌더 중에 상태 업데이트를 요청한다.
const Component = () => {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <div>{count}</div>;
};
```

렌더가 다음 렌더를 요청하고, 그 렌더가 또 다음 렌더를 요청한다. 리액트가 무한 루프를 감지해서 에러를 던진다.  
이벤트 핸들러 안의 `setCount`는 괜찮다. 렌더는 핸들러를 만들어서 넘기기만 하고, 실제 호출은 렌더가 끝난 뒤 사용자가 클릭했을 때 일어난다.  
`useEffect` 안의 `setCount`도 렌더 밖이라 순수성 문제는 없다. 다만 렌더 하나가 끝난 뒤 다음 렌더를 예약하는 것이라 렌더가 한 번 더 돌고, 의존성 없이 매번 새 객체를 넣으면 루프가 된다. 어디에 필요한지는 뒤의 effect 절에서 다룬다.

> 리액트가 순수성을 함수형의 원칙으로 가져온 이야기는 [객체지향 vs 함수형? 싸울 일이 아닙니다](https://www.jeong-min.com/88-programming-paradigms/)에서 다뤘다. 이 글은 그 원칙이 왜 필요한지를 실행 모델 쪽에서 본 것이다.

state를 직접 변경하지 말라는 규칙도 여기서 나온다.  
`todos.push(newTodo)`는 이번 렌더의 스냅샷을 제자리에서 고치는 일이다.  
이전 렌더가 들고 있던 배열이 새 값으로 덮어써지니, 리액트는 이전과 현재를 비교할 수 없고 `memo`와 `useMemo`는 바뀐 걸 모른다.  
기존 스냅샷을 고치는 게 아니라 다음 스냅샷을 새로 만들어야 한다.

> 어디까지 새로 만들어야 하는지는 [리액트의 핵심, 불변성](https://www.jeong-min.com/74-immutability/)에서 다뤘다.

&nbsp;

## effect는 렌더 뒤에 실행되는 함수가 아니다

`useEffect`를 "렌더가 끝나면 실행되는 콜백"으로 이해하면 대부분의 경우 맞긴 하다.  
하지만 그렇게 이해하면 effect를 어디에 써야 하는지가 안 보인다.

리액트 문서는 effect를 "외부 시스템과 동기화하는 것"이라고 설명한다.  
렌더는 props와 state로 JSX를 만드는 순수한 계산이고, 그 계산 바깥에 있는 것들이 있다. 서버, 브라우저 API, 구독, 타이머, 리액트가 관리하지 않는 DOM.  
effect는 렌더 결과와 그 바깥을 맞추는 자리다.

이렇게 보면 실행 순서도 이해가 된다.  
검색어를 props로 받아서 서버에 요청하는 컴포넌트를 예로 들면 이렇다.

```text
검색어가 "react"일 때
→ 컴포넌트 호출 (렌더)
→ DOM 반영 (커밋)
→ effect 실행: "react"로 서버에 요청

검색어가 "vue"로 바뀌면
→ 컴포넌트 호출
→ DOM 반영
→ 이전 effect의 cleanup: "react" 요청 뒷정리
→ 새 effect 실행: "vue"로 서버에 요청
```

cleanup은 언마운트 때만 실행되는 게 아니다.  
의존성이 바뀌어 effect가 다시 실행될 때, 새 effect보다 먼저 이전 effect의 cleanup이 실행된다.  
"react"로 걸어둔 것을 정리하고 "vue"로 다시 거는 것이다.  
의존성이 없으면 다시 실행될 일이 없으니 cleanup은 언마운트에서만 돈다.

개발 환경의 StrictMode가 마운트 직후 effect를 한 번 더 돌리는 것도 앞의 두 번 호출과 같은 종류의 검사다.  
setup, cleanup, setup을 연달아 실행해서 cleanup이 setup을 제대로 되돌리는지 본다.  
이 과정이 끝난 뒤에는 구독이든 타이머든 하나만 살아 있어야 정상이다. 둘이 살아 있다면 cleanup이 첫 setup을 되돌리지 못한 것이고, 그게 StrictMode가 잡아내려는 상황이다.

![](3.jpg)

&nbsp;

### effect가 필요 없는 경우

동기화라는 기준을 들고 보면 effect가 필요 없는 자리가 보인다.

```tsx
// ❌ props로 계산할 수 있는 값을 effect로 만든다.
const User = ({ firstName, lastName }: Props) => {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return <div>{fullName}</div>;
};
```

동작은 한다. 하지만 흐름을 따라가 보면 이렇다.

```text
props 변경
→ 렌더 (이전 fullName으로)
→ 커밋
→ effect → setFullName
→ 렌더 (새 fullName으로)
→ 커밋
```

한 번에 끝날 계산을 위해 state를 하나 더 만들고, 렌더를 한 번 더 돌렸다.  
그 사이에 화면에는 잠깐 이전 이름이 보인다.

```tsx
// ✅ 렌더 중에 계산한다.
const User = ({ firstName, lastName }: Props) => {
  const fullName = `${firstName} ${lastName}`;
  return <div>{fullName}</div>;
};
```

`firstName`이 바뀌면 리액트가 `User`를 다시 호출하고, 그 호출에서 `fullName`도 다시 계산된다.  
props와 state로 계산할 수 있는 값은 그냥 계산하면 된다. 외부 시스템이 없으니 동기화할 것도 없다.

사용자 이벤트에 반응하는 로직도 effect 자리가 아니다.  
"제출 버튼을 누르면 요청을 보낸다"는 핸들러에 쓰는 것이고, `isSubmitted` state를 만들어서 effect에서 감시하는 건 이벤트를 상태로 우회한 것이다.

effect에 남는 건 정말로 바깥과 맞춰야 하는 것들이다.  
`query`가 바뀌면 서버에 물어봐야 하고, 마운트되면 구독을 걸어야 하고, 언마운트되면 풀어야 한다.

&nbsp;

### 검색 결과가 뒤바뀌는 이유

그 "바깥과 맞추는" 대표적인 경우가 데이터 요청이다.

```tsx
const SearchPage = ({ query }: { query: string }) => {
  const [results, setResults] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then(setResults);
  }, [query]);

  return <SearchResults results={results} />;
};
```

사용자가 "r", "re", "rea", "react"를 빠르게 입력했다.  
요청은 네 개가 나갔고, 네트워크는 순서를 보장하지 않는다.  
"react" 응답이 먼저 오고 "r" 응답이 마지막에 오면, 화면에는 "r"의 결과가 남는다.

```text
요청 "r"      ──────────────────────→  응답 (마지막 도착)
요청 "re"     ─────────────→
요청 "react"  ───────→  응답 (먼저 도착)

setResults(react의 결과)  // 최신
setResults(r의 결과)      // 옛 요청이 덮어쓴다
```

여러 비동기 작업의 완료 순서에 따라 최종 상태가 달라지는 문제다. race condition이라고 부른다.

![](2.jpg)

여기서 디바운스를 떠올릴 수 있는데, 디바운스는 다른 문제를 푼다.  
디바운스는 "r", "re", "rea"에 대한 요청이 나가지 않게 막아서 요청 횟수를 줄인다.  
하지만 300ms 안에 "react"를 다 치지 못해 "rea"와 "react" 두 요청이 나갔다면, 그 둘 사이의 순서 문제는 여전히 남는다.  
요청을 줄이는 것과 이미 나간 요청의 응답 순서를 다루는 것은 별개다.

> 디바운스와 쓰로틀은 [이벤트 멈춰! Debounce와 Throttle](https://www.jeong-min.com/45-debounce-throttle/)에서 다뤘다.

&nbsp;

effect가 동기화라는 걸 떠올리면 어디서 고쳐야 하는지 보인다.  
이 effect는 현재 `query`와 `results`를 맞추는 일이다.  
`query`가 "r"에서 "re"로 바뀌면 "r"과 맞춰둔 건 더 이상 유효하지 않고, 그걸 푸는 자리는 cleanup이다.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setResults)
    .catch((err) => {
      if (err.name !== 'AbortError') throw err;
    });

  return () => controller.abort();
}, [query]);
```

`query`가 바뀌면 앞에서 본 순서대로 이전 effect의 cleanup이 먼저 실행된다.  
"r" 요청이 취소되고, 그다음 "re" 요청이 나간다.  
응답이 늦게 도착하더라도 이미 취소된 요청이라 `setResults`에 닿지 않는다.

요청을 취소할 수 없는 API라면 응답을 무시하는 것으로도 충분하다.

```tsx
useEffect(() => {
  let ignore = false;

  fetch(`/api/search?q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      if (!ignore) setResults(data);
    });

  return () => {
    ignore = true;
  };
}, [query]);
```

`ignore`는 effect 함수 본문 안에서 선언된 변수라서, effect가 실행될 때마다 그 회차만의 `ignore`가 새로 만들어진다.  
같은 회차에서 만들어진 `.then` 콜백과 cleanup은 그 변수를 공유하고, 다른 회차의 변수는 모른다.  
`query`가 "r"에서 "re"로 바뀌면 "r" 회차의 cleanup이 그 회차의 `ignore`만 true로 바꾸고, "re" 회차는 새 `ignore`를 false로 시작한다.  
그래서 "r" 응답이 늦게 와도 그 콜백이 보는 `ignore`는 이미 true고, "re" 응답은 false인 자기 `ignore`를 보고 정상 반영된다.  
앞에서 문제를 일으켰던 클로저가 여기서는 이 응답이 어느 회차의 것인지 구별하는 데 쓰인다.

&nbsp;

실무에서는 이걸 직접 쓸 일이 별로 없다.  
Tanstack Query 같은 라이브러리가 `queryKey`가 바뀔 때 이전 요청의 결과를 무시하는 일을 대신한다.  
다만 `useEffect`에 `fetch`를 직접 쓴 코드는 대개 이 cleanup이 없다.  
라이브러리가 대신해주던 게 무엇이었는지 모르면 그 코드가 왜 가끔 옛 결과를 보여주는지도 알 수 없다.

![](1.jpg)

&nbsp;

## 마무리

처음의 네 현상을 다시 봐보자.

- `setInterval` 안의 `count`가 0인 건, 그 콜백이 첫 렌더에서 만들어져 그 렌더의 스냅샷을 기억하는 함수라서다.
- `ref.current`를 바꿔도 화면이 안 바뀌는 건, ref가 스냅샷 바깥에 있어서 리액트에 다음 렌더를 요청하지 않아서다.
- 검색 결과가 뒤바뀌는 건, `query`가 바뀌었을 때 이전 동기화를 풀지 않아서다. cleanup이 그 자리다.
- StrictMode가 두 번 호출하는 건, 리액트가 실제로 렌더를 버릴 수 있으니 그 상황을 개발 중에 미리 만들어보는 것이다. 렌더가 순수하면 두 번 불려도 차이가 없다.

렌더는 리액트가 컴포넌트 함수를 호출해서 UI를 계산하는 일이고, 그 계산은 그 시점의 props와 state를 기준으로 한다.  
한 번의 렌더가 바라보는 값과 거기서 나온 UI가 하나의 스냅샷이다.  
state는 그 스냅샷에 찍힌 값이고, 핸들러와 effect는 그 렌더에서 만들어져 그 스냅샷의 값을 클로저로 기억한다.  
스냅샷 바깥으로 나가는 통로는 ref와 effect로 정해져 있고, 통로를 쓸 때는 들어가면서 걸어둔 것을 나오면서 풀어야 한다.

```toc

```
