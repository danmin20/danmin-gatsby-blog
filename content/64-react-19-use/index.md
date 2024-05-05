---
emoji: 🤙
title: 'React 19의 새로운 API, use'
date: '2024-05-05'
categories: Dev
---

[저번 글](https://www.jeong-min.com/63-react-19-hooks/)에서는 리액트 19의 새로운 훅들에 대해서 알아보았다.  
이외에도, 리액트 19에서는 리소스를 렌더링 시점에 읽기 위한 api로 use가 새롭게 등장했다.  

이번 글에서는 use의 대표적인 쓰임새 두 가지를 알아보도록 하자!

![](0.jpeg)

&nbsp;

## use(Context) : use로 context 읽기

use는 기존의 useContext를 대체할 수 있다.  
useContext는 컴포넌트의 최상위 레벨에서 호출해야 하는 반면,  
use는 if와 같은 조건문이나 for와 같은 반복문 내부에서도 호출할 수 있다.  
즉, use는 useContext보다 더 유연하게 사용될 수 있다.

![](1.jpeg)
> 대충_유연한_짤.jpeg

&nbsp;

context가 전달되는 상황이라면 언제 어디서든 use를 사용할 수 있다.

```tsx
const ColorContext = createContext("");

function App() {
  return (
    <ColorContext value="blue">
      <Form />
    </ColorContext>
  );
}

function Form() {
  return (
    <div>
      <Button show={true}>True</Button>
      <Button show={false}>False</Button>
    </div>
  );
}

function Button({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  if (show) {
    const theme = use(ColorContext);
    return <button style={{ backgroundColor: theme }}>{children}</button>;
  }
  return false;
}
```

> 참고로, 리액트 19에서는 \<Context>를 프로바이더로서 렌더링할 수 있게 되었다.  
> 더 이상 \<Context.Provider>를 사용하지 않아도 된다는 것!  
> 따라서 \<Context.Provider>는 곧 deprecated 될 예정이라고 한다. 👋

&nbsp;

## use(Promise) : use로 비동기로 데이터 가져오기

기존에는 비동기로 가져온 서버 데이터를 사용하려면 다음과 같은 코드를 짜야했다.

```tsx
const getComments = async () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(["Hello", "World"]);
    }, 2000);
  });
};

function App() {
  const [comments, setComments] = useState<string[]>();

  const getCommentList = async () => {
    const comments = await getComments();
    setComments(comments);
  };

  useEffect(() => {
    getCommentList();
  }, []);

  return <div>{comments ? <Comment comments={comments} /> : "Loading..."}</div>;
}

function Comment({ comments }: { comments: string[] }) {
  return (
    <ul>
      {comments.map((comment, index) => (
        <li key={index}>{comment}</li>
      ))}
    </ul>
  );
}
```

위 코드를 use로 리팩토링해보면 다음과 같다.

```tsx
function App() {
  const commentsPromise = getComments();

  return (
    <Suspense fallback="Loading...">
      <Comment commentsPromise={commentsPromise} />
    </Suspense>
  );
}

function Comment({ commentsPromise }: { commentsPromise: Promise<string[]> }) {
  const comments = use(commentsPromise);

  return (
    <ul>
      {comments.map((comment, index) => (
        <li key={index}>{comment}</li>
      ))}
    </ul>
  );
}
```

더 이상 비동기 데이터에 대해 useEffect나 옵셔널 체이닝이나 삼항 연산자를 사용하지 않아도 된다니..!  
use + Suspense의 조합이 정말 강력하다는 것을 알 수 있다.  
> ErrorBoundary도 함께 쓴다면 두 배로 강력!


![](2.jpeg)
> 대충_강력한_짤.jpeg

리액트19의 use는 단순 Promise를 해결하는 것 뿐이기에,  
TanStack Query와 함께 어떻게 더 유용하게 사용될 수 있을지 지켜봐야 할 것 같다.

![](3.jpeg)

&nbsp;

### 글이 너무 짧다고요? 너무 아쉽다고요?

그럼 리액트 19의 새로운 점 한 가지만 더 알아보도록 하자!

&nbsp;

## 리액트 19에서 달라진 ref

리액트 19에서는 함수형 컴포넌트에서 ref를 prop으로 접근할 수 있게 되었다!  
즉, forwardRef가 더 이상 필요 없어졌다는 것!  
forwardRef 또한 deprecated 될 예정이라고 한다. 👋

기존 forwardRef를 사용하던 코드는 아래와 같다.

```tsx
const Button = forwardRef((props: { children: string }, ref) => {
  return (
    <button ref={ref as RefObject<HTMLButtonElement | null>}>{props.children}</button>
  );
});

function App() {
  const ref = createRe<HTMLButtonElement>();

  return <Button ref={ref}>Click me!</Button>;
}
```

ref를 props로 전달한다면 forwardRef를 제거할 수 있다.

```tsx
function Button({
  children,
  ref,
}: {
  children: string;
  ref: RefObject<HTMLButtonElement | null>;
}) {
  return <button ref={ref}>{children}</button>;
}

function App() {
  const ref = createRef<HTMLButtonElement>();

  return <Button ref={ref}>Click me!</Button>;
}
```

&nbsp;

이렇게 두 개의 글을 거쳐 리액트 19의 새로워진 점들을 살펴보았다.  
리액트 19의 기능을 잘만 활용한다면 정말 깔끔하게 정리된 코드를 볼 수 있을 것 같다는 기대감이 든다.

![](4.jpeg)

```toc
```