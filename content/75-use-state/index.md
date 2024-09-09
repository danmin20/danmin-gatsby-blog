---
emoji: 🚫
title: 'useState를 반복문과 조건문에서 사용할 수 없는 이유'
date: '2024-09-09'
categories: Dev
---

리액트 공식 문서를 읽다보면 다음과 같은 문장을 마주할 수 있다.

> **주의사항**  
> useState는 Hook이므로 **컴포넌트의 최상위 레벨**이나 직접 만든 Hook에서만 호출할 수 있습니다. 반복문이나 조건문 안에서는 호출할 수 없습니다. 필요한 경우 새 컴포넌트를 추출하고 state를 그 안으로 옮기세요.

&nbsp;

🤔 **"왜 useState를 반복문이나 조건문 안에서 쓰면 안 되는 걸까?"**  

&nbsp;

## React 훅의 동작 원리

리액트 훅의 핵심 원리 중 하나는 **훅의 호출 순서가 항상 같아야 한다**는 것이다.  
리액트는 컴포넌트가 리렌더링될 때마다 훅들을 순서대로 실행하는데,  
만일 이 순서가 변경된다면 리액트는 어떤 상태가 어떤 useState 호출에 해당하는지 추적할 수 없게 된다.

만일 조건문 내에서 useState를 사용한다면,

```jsx
function ExampleComponent(props) {
  if (props.someCondition) {
    const [state, setState] = useState(initialValue);
  }
  // ...
}
```

조건의 값에 따라 훅의 호출 순서가 바뀌게 된다.

반복문 내에서도 마찬가지다.

```jsx
function ExampleComponent() {
  const items = [1, 2, 3];
  items.forEach(() => {
    const [state, setState] = useState(initialValue);
  });
  // ...
}
```

반복 횟수에 따라 훅의 호출 횟수가 달라지게 된다.

위 두 경우 모두 리액트가 예측할 수 없는 동작을 유발할 수 있다는 문제가 있다.

&nbsp;

**훅의 호출 순서가 항상 같아야,** 리액트가 각 훅이 어떤 상태과 연관되어 있는지 정확히 알 수 있고,  
결과적으로 컴포넌트의 동작을 예측 가능하고 일관되게 만들 수 있다.

&nbsp;

🤔 **"내부적으로 어떻게 상태를 관리하기에 훅의 호출 순서가 항상 같아야 하는 걸까?"**  

&nbsp;

## React 훅의 상태 관리 내부 메커니즘

리액트는 각 컴포넌트의 훅들을 LinkedList(연결 리스트)로 관리한다.  

![](0.jpg)

&nbsp;

### ✋ 잠깐! LinkedList가 뭔데?

배열의 대표적인 자료구조, LinkedList와 ArrayList를 잠깐 짚고 넘어가보자.

- LinkedList
  - 각 노드가 독립적인 메모리 공간에 할당되고, 포인터로 연결됨
  - 특정 위치 찾을 때 O(n)
  - 노드 참조만 있으면 추가/삭제 O(1)
  - 크기 변경이 자유롭지만, 캐시 효율성이 떨어짐
  - 추가/삭제 빈번할 때, 데이터 크기 동적으로 변할 때, 메모리 효율적으로 사용해야 할 때 유용함

- ArrayList
  - 연속된 메모리 공간에 요소들이 저장됨
  - 인덱스를 통한 임의 접근이 O(1) 시간
  - 끝에 추가/삭제는 O(1)이지만 중간 추가/삭제는 O(n)
  - 크기 변경에 비용이 들지만, 캐시 효율성이 높음
  - 요소에 빈번하게 접근할 때, 데이터 크기를 미리 알고 있을 때, 주로 끝에서 추가/삭제 일어날 때 유용함

&nbsp;

리액트 내 LinkedList의 각 노드는 다음과 같은 구조를 가진다.

```js
{
  memoizedState: any,
  next: Hook | null
}
```

- memoizedState: 훅의 현재 상태를 저장
- next: 다음 훅을 가리키는 포인터

&nbsp;

컴포넌트가 처음 렌더링될 때, 리액트는 각 훅 호출마다 새로운 노드를 생성하여 LinkedList에 추가한다.

```js
function ExampleComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // ...
}
```

만일 위와 같은 컴포넌트가 렌더링되면, 리액트는 다음과 같은 LinkedList를 만든다.

```
[Hook(useState: count)] -> [Hook(useState: name)] -> null
```

&nbsp;

그리고 컴포넌트 리렌더링 시, 리액트는 생성된 LinkedList를 순회하면서 각 상태를 업데이트하게 된다.  
따라서 훅의 호출 순서가 변경된다면 LinkedList의 구조가 달라지게 된다.

```js
function ExampleComponent(props) {
  if (props.isLoggedIn) {
    const [name, setName] = useState('');
  }
  const [count, setCount] = useState(0);
  
  // ...
}
```

위 코드의 경우, `props.isLoggedIn`의 값에 따라 LinkedList의 구조가 달라진다.
- true일 때: [Hook(useState: name)] -> [Hook(useState: count)] -> null
- false일 때: [Hook(useState: count)] -> null

리액트는 이전 렌더링의 LinkedList 구조를 기반으로 상태를 업데이트하기 때문에,  
이러한 구조 변경은 상태 값들이 뒤섞이는 결과를 초래할 수 있다.

&nbsp;

오늘의 결론:
안 된다는 데에는 다 이유가 있다!

![](1.webp)

```toc
```