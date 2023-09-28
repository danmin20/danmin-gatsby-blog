---
emoji: 🤝
title: '클로저와 더 가까워지기'
date: '2023-09-28'
categories: Dev
---

> closure와 closer해져보자 ㅋ.ㅋ

![](0.jpeg)

&nbsp;

## 클로저를 알기 전에,

자바스크립트의 렉시컬 스코핑에 대해 먼저 알아보도록 하자!

&nbsp;

### 스코프(Scope)란?

스코프란 참조 대상 식별자(변수와 함수같이 어떤 대상을 다른 대상과 구분하여 식별할 수 있는 유일한 이름)를 찾아내기 위한 규칙이다.

```ts
// 전역 스코프
const var1 = 'global';

const func = () => {
  // 함수 레벨 스코프
  const var2 = 'function';

  console.log(global); // 접근 가능
};

func();
console.log(local); // 접근 불가능
```

전역 스코프를 가진 변수는 어디서든 참조할 수 있지만, 함수 레벨 스코프를 가진 변수는 함수 외부에서 참조하려고 할 경우 참조에러가 발생하게 된다. 이러한 개념을 스코프라고 한다.

&nbsp;

### 렉시컬 스코프(Lexical scope)란?

렉시컬 스코프는 함수를 어디에 선언하였는지에 따라 상위 스코프가 결정되는 것을 말한다. 자바스크립트를 포함한 대부분의 프로그래밍 언어는 렉시컬 스코프를 따르며, 이를 정적 스코프(Static Scope)라고 부르기도 한다.

```ts
const func = () => {
  const var1 = 'function1';

  const func2 = () => {
    console.log(var1); // function2
  };

  func2();
};

func();
```

내부 함수에서 외부 함수의 변수에 접근이 가능한데, 이것은 함수가 중첩될 때 구문 분석기가 변수 이름을 확인하는 방법을 설명하는 정적 스코프의 예시다. '정적'이란, 정적 범위 지정 과정에서 변수가 어디에서 사용 가능한지 알기 위해 그 변수가 소스코드 내 어디에서 선언되었는지 고려한다는 것을 의미한다. 즉, 호출 스택과 관계없이 선언 시점에 스코프를 결정한다. 함수를 호출할 때가 아니라 선언할 때 스코프가 정해지기 때문에 외부에서는 내부 변수에 접근할 수 없게 된다.

반대로 동적 스코프의 선언은 런타임 도중에 실행 콘텍스트나 호출 콘텍스트에 의해 결정된다. 

```ts
const scope = '정적 스코프';

const init = () => {
  const scope = '동적 스코프';
  func();
};

const func = () => {
  console.log(scope);
};

init();
```

자바스크립트는 정적 스코프를 따르기 때문에 `정적 스코프`가 출력될 것이지만, 만약 동적 스코프를 따른다면 `동적 스코프`가 출력될 것이다.

![](1.jpeg)

&nbsp;

### ES6

ES6 이전에는 함수 스코프와 전역 스코프 두 가지만 존재했고, ES6 이후부터 블록 스코프가 등장하게 되었다. var로 선언한 변수는 함수 내부 또는 외부에서 선언되었는지에 따라 함수 스코프 또는 전역 스코프를 가지게 되는데. 이때, 중괄호로 표시된 블록이 스코프를 생성하지 않는다는 점에서 혼란을 일으킬 수 있다.

```ts
var x = 1;
if (true) {
  var x = 2;
  var y = 3;
}
console.log(x); // 2
console.log(y); // 3
```

console.log에서 x가 어떤 블록 스코프에도 포함되지 않기 때문에 에러가 발생해야 할 것 같지만, 블록은 var로 선언한 변수에 대해 스코프를 생성하지 않기 때문에 var는 전역 변수를 생성한다. let/const를 사용하면 이런 혼란에서 벗어날 수 있다.

```ts
const x = 1;
if (true) {
  const x = 2;
  const y = 3;
}
console.log(x); // 1
console.log(y); // Uncaught ReferenceError: y is not defined
```

그러니, 엉망진창인 var를 버리고 let과 const를 사용하도록 하자!

![](2.jpeg)
> 엉망으로 살지 말자!

&nbsp;

이제 본격적으로 클로저에 대해 이야기해보자!

![](3.webp)

&nbsp;

## **클로저란?**

클로저(closure)는 함수와 그 함수가 선언된 렉시컬 환경(lexical environment) 사이의 특별한 관계다. 함수 내부에서 정의한 변수와 그 함수의 외부 변수 사이의 관계를 나타낸다고 볼 수 있다. 보통은 함수가 실행을 마치고 렉시컬 환경이 소멸될 때, 해당 함수 내에서 선언된 변수들도 사라진다. 하지만 클로저에서는 외부 변수에 대한 참조가 남아 있어 내부 변수들에 계속해서 접근이 가능하다. 함수가 속한 문맥적 범위를 기억하여 함수의 범위 밖에서도 내부에 접근할 수 있게 해주는 기능이라 볼 수 있다. 클로저는 함수가 다른 함수 내부에서 정의되고, 내부 함수가 외부 함수의 변수를 참조할 때 생성된다. 내부 함수가 외부 함수로부터 반환되거나 다른 코드 블록 내에서 참조될 때 클로저가 형성되는 것이다.

코드를 한번 살펴보자!

```ts
const outerFunction = () => {
  const outerVar = 10;

  const innerFunction = () => {
    console.log(outerVar); // outerVar에 접근 가능
  };

  return innerFunction;
};

const closureExample = outerFunction();
closureExample(); // 10
```

위 코드에서 `innerFunction`은 `outerFunction` 내부에서 정의되고, `closureExample`에 할당된 다음 외부에서 호출된다. 이때 `innerFunction`은 외부 함수 `outerFunction`의 `outerVar` 변수에 접근할 수 있으며, 클로저가 형성된다.

&nbsp;

### 잠깐!

var를 사용할 경우, 클로저와 함께 사용했을 때도 당연히 버그가 발생할 가능성이 크다.

```js
function createCounter() {
  var count = 0;

  var increment = function () {
    count++;
    console.log(count);
  };

  var decrement = function () {
    count--;
    console.log(count);
  };

  return {
    increment: increment,
    decrement: decrement,
  };
}

var counter = createCounter();

counter.increment(); // 1
counter.increment(); // 2

// 버그 원인
var count = 10; // 외부에서 count 변수 재정의

counter.decrement(); // 11 (예상치 못한 결과)
```

&nbsp;

## 클로저를 어떻게 활용할 수 있을까?

### 1. 리액트 훅

숨쉬듯 사용하는 `useState`가 이러한 클로저를 이용해서 상태를 기억한다. `useState`는 `state`와 `setState`의 두 함수를 내부적으로 가지는데, 실제로 `state`와 setState를 사용하는 시점은 `useState`의 호출이 끝난 후이지만, 클로저가 내부 변수 값을 기억하고 있기 때문에 이후에도 접근이 가능하다. `useState`뿐만 아니라 커스텀 훅에서도 클로저를 이용해서 상태를 기억할 수 있다.

```ts
const useBoolean = (defaultValue = false): [boolean, () => void, () => void] => {
  const [value, setValue] = useState(defaultValue);

  return [value, () => setValue(true), () => setValue(false)];
};

const [showModal, onOpenModal, onCloseModal] = useBoolean();
```

&nbsp;

### 2. 비동기 작업 관리

클로저는 비동기 작업을 관리하고 상태를 유지하는 데 유용하다. 예를 들어, 타이머 콜백 함수 내에서 외부 변수를 사용하여 특정 조건에 따라 작업을 중단하거나 다시 시작할 수 있다.

```ts
const createTimer = () => {
  let count = 0;
  const timer = setInterval(() => {
    console.log(count++);
  }, 1000);

  return function stopTimer() {
    clearInterval(timer);
  };
};

const stopFunc = createTimer();

setTimeout(() => {
  stopFunc(); // 타이머 중지
}, 5000);
```

&nbsp;

### 3. 모듈 패턴

이러한 클로저를 이용해서 프라이빗 변수를 흉내내는 모듈 패턴을 구현할 수도 있다. 모듈 패턴을 사용하면 전역 스코프에서 변수 노출을 최소화하고 코드를 모듈화할 수 있다.

```ts
const counterModule = (() => {
  let count = 0;

  const increment = () => {
    count++;
  };

  const decrement = () => {
    count--;
  };

  const getCount = () => {
    return count;
  };

  return {
    increment,
    decrement,
    getCount,
  };
})();

counterModule.increment();
console.log(counterModule.getCount()); // 1
```

&nbsp;

꽤나 많은 개념이 들어간 글이었는데, 결론적으로 클로저는 자바스크립트에서 매우 강력한 개념 중 하나이며, 함수의 스코프와 변수 관리를 효율적으로 처리할 수 있도록 해준다. 클로저를 올바르게 활용하면 코드를 더 효과적으로 작성하고 유지 관리할 수 있다.

```toc
```