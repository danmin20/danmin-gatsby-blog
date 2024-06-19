---
emoji: 😵
title: 'var/let/const로 알아보는 호이스팅과 TDZ'
date: '2024-06-19'
categories: Dev
---

> 이번 글에서는 변수, 함수 호이스팅 위주로 알아볼 예정입니다 :)

호이스팅에 대해 깊에 알아보기 전에, 아마 많은 사람들이 오해하고 있을 세 가지를 짚고 넘어가보겠다.

1. let/const는 호이스팅 되지 않는다.
2. 호이스팅은 ECMAScript에 정의된 용어다.
3. 함수 표현식 코드에서 호이스팅되는 건 아무것도 없다.

놀랍게도, 모두 다 **맞다고도, 틀렸다고도 할 수 있다.**

![](0.jpeg)

잠시 놀라움은 뒤로 하고, 차근차근 알아가보도록 하자.

&nbsp;

## 호이스팅이란?

![](1.png)

자바스크립트 인터프리터가 코드를 실행하기 전에 변수, 함수, 클래스, 임포트의 선언문을 해당 범위의 맨 위로 끌어올리는 것처럼 보이는 현상이다.  
이번 글에서는 변수와 함수에 대해 어떻게 호이스팅이 일어나는지 알아보도록 하자!

&nbsp;

## 함수 스코프를 가지는 var

var로 선언된 변수의 범위는 현재 실행 컨텍스트다.  
즉, 변수 선언을 둘러싼 함수 또는 전역이 될 수 있다.  
따라서 var는 현재 함수 또는 전역 스코프 어디에서나 접근할 수 있는 변수를 선언한다.

```js
var a = 1;

if (a === 1) {
  var a = 11; // 함수가 아니므로 전역 변수 a의 값이 변경
  console.log(a); // 11
}

const foo = () => {
  var a = 3;
  console.log(a); // 3
}

console.log(a); // 11
foo();
```

&nbsp;

### var의 호이스팅

var는 현재 함수 스코프의 최상단으로 호이스팅된다.  
즉, 현재 함수 내에서라면 선언 전에 변수를 사용할 수 있는 것이다.

```js
x = 3;
var x;
```
위 코드는 아래와 같다.

```js
var x;
x = 3;
```

&nbsp;

참조만 하는 것도 가능하다. 물론 undefined가 나오겠지만!

```js
console.log(x); // undefined
var x = 3;
```

```js
var x = 3;

(function () {
  console.log(x); // undefined
  var x = 5;
})();
```

위 코드는 아래와 각각 동일하다.

```js
var x; // undefined
console.log(x);
x = 3;
```

```js
var x = 3;

(function () {
  var x; // undefined
  console.log(x);
  x = 5;
})();
```

&nbsp;

조금 더 복잡한 코드를 봐보자.

```js
const foo2 = () => {
  var a = 1; // foo2 최상단으로 호이스팅
  var b = 2; // foo2 최상단으로 호이스팅
  const foo3 = () => {
    a = 3; // foo2 최상단으로 호이스팅된 a
    console.log(a); // 3
    console.log(b); // undefined (foo3 최상단으로 호이스팅된 b)

    var b = 4; // foo3 최상단으로 호이스팅
    console.log(b); // 4 (foo3 최상단으로 호이스팅된 b)
  }
  foo3();

  console.log(a); // 3 (foo3 실행으로 값이 변경된 a)
  console.log(b); // 2 (foo2 최상단으로 호이스팅된 b)
}

foo2();
```

호이스팅으로 인해 조금 이상하게 동작한다는 느낌이 들기도 한다.  
그렇기 때문에, 조금이라도 가독성 좋은 코드를 위해서 var를 사용할 때는 함수 상단 근처에 두는 게 좋다.  
물론, **var를 사용하지 않는 게 제일 좋다!!**

![](2.jpg)

&nbsp;

## 블록 스코프를 가지는 let과 const

let과 const로 선언된 변수는 블록 명령문 또는 표현식 내로 범위가 제한된다.  

```js
let a = 1;

if (a === 1) {
  let a = 11;
  console.log(a); // 11
}

const foo = () => {
  let a = 3;
  console.log(a); // 3
}

console.log(a); // 1
foo();
```

&nbsp;

### let과 const의 호이스팅

블록 스코프를 가지는 let과 const는 선언 전에 블록 내에서 변수를 참조하려고 하면 ReferenceError가 발생한다.

```js
console.log(x); // ReferenceError
let x = 3;
```

이 때문에 let/const는 호이스팅되지 않는다고 생각하는 사람들이 있는데,  
정확히 말하자면 **틀린 건 아니다!**  
호이스팅이 공식적으로 합의된 용어는 아니기 때문이다.

하지만 현재 범용적으로 사용되는 호이스팅의 관점에서 보자면,  
**ReferenceError가 발생하는 것은 호이스팅이 된다는 것이다.**

&nbsp;

let과 const로 선언된 변수는 블록 시작부터 선언이 처리될 때까지 **TDZ**에 위치하게 되고,  
TDZ 내에서 변수에 접근하려고 하면 ReferenceError, 즉 참조 에러가 발생한다.

![](3.jpeg)

```js
let x = 3;

(function () {
  // 함수 블록 내 x의 TDZ 시작
  console.log(x); // ReferenceError
  let x = 5; // 함수 블록 내 x의 TDZ 종료
})();

(function () {
  console.log(x); // 3
})();
```

&nbsp;

### TDZ란?

temporal dead zone은 말 그대로 "일시적 사각지대"다.  
**일시적**인 이유는, TDZ가 코드의 작성 순서(위치)가 아닌, **코드의 실행 순서(시간)에 의해 형성**되기 때문이다.

```js
{
  // 스코프 상단에서 x의 TDZ 시작
  const func = () => console.log(x); // OK

  console.log(x); // ReferenceError

  let x = 3; // x의 TDZ 종료
  func(); // x의 TDZ 종료 후 실행
}
```

&nbsp;

이전의 var 예시를 let으로 작성하여 확인해보자.

```js
const foo2 = () => {
  let a = 1;
  let b = 2;
  const foo3 = () => {
    // foo3 내 b의 TDZ 시작
    a = 3; // foo2의 a와 동일
    console.log(a); // 3
    console.log(b); // ReferenceError

    let b = 4; // foo3 내 b의 TDZ 종료
    console.log(b); // 4
  }
  foo3();

  console.log(a); // 3 (foo3 실행으로 값이 변경된 a)
  console.log(b); // 2
}

foo2();
```

&nbsp;

## 함수 호이스팅

함수의 경우, 함수 선언은 호이스팅되지만 함수 표현식은 호이스팅되지 않는다.  
하지만 함수 표현식은 호이스팅되지 않더라도, 함수 표현식의 함수명은 호이스팅된다!

&nbsp;

### 함수 선언

```js
console.log(foo1); // foo1() { return true; }
console.log(foo1()); // true

function foo1() {
  return true;
}
```

함수 자체가 호이스팅되는 것을 확인할 수 있다.

&nbsp;

### 함수 표현식 (var)

```js
console.log(foo2); // undefined
console.log(foo2()); // TypeError: foo2 is not a function

var foo2 = function () {
  return true;
};
```

위 코드는 아래와 같이 해석될 수 있다.

```js
var foo2; // undefined

console.log(foo2); // undefined
console.log(foo2()); // TypeError: foo2 is not a function

foo2 = function () {
  return true;
};
```

함수 표현식은 호이스팅되지 않지만, var 선언은 호이스팅되는 것을 확인할 수 있다.

&nbsp;

### 함수 표현식 (const)

```js
// foo3의 TDZ 시작
console.log(foo3); // ReferenceError: foo3 is not defined
console.log(foo3()); // ReferenceError: foo3 is not defined

// foo3의 TDZ 종료
const foo3 = function () {
  return true;
};
```

const 선언이 호이스팅되어 TDZ가 형성되었고, ReferenceError가 발생하는 것을 확인할 수 있다.

&nbsp;

## 슬슬 정리해봅시다

자, 그럼 시작할 때 보았던 문장들에 대해 반박해보자!

&nbsp;

### 1. let/const는 호이스팅 되지 않는다?

호이스팅이라는 개념 자체가 공식적인 개념은 아니기 때문에, 맞고 틀리다를 판단할 수 없긴 하다.  
하지만 범용적으로 사용되는 자바스크립트의 호이스팅 개념으로 보자면,

let과 const는 호이스팅되지 않아 선언 전에 사용이 불가능한 것이 아니라,  
호이스팅으로 인해 TDZ가 형성되어, 선언 전 TDZ에서 접근할 시 ReferenceError가 발생하는 것이다.

&nbsp;

### 2. 호이스팅은 ECMAScript에 정의된 용어다.

호이스팅은 ECMAScript 사양에서 규범적으로 정의된 용어는 아니다.
> HoistableDeclaration으로 정의된 용어가 있지만, 우리가 말하는 호이스팅과는 다른 개념이다.

하지만 [ECMAScript에서 호이스팅이라는 용어를 발견할 수 있기에](https://tc39.es/ecma262/multipage/global-object.html#sec-evaldeclarationinstantiation),  
범용적으로 사용하는 데에는 문제가 없으리라 본다.

&nbsp;

### 3. 함수 표현식 코드에서 호이스팅되는 건 아무것도 없다.

함수 표현식은 호이스팅되지 않는 게 맞다. 하지만 함수명은 호이스팅된다!

&nbsp;

솔직히.. 아님 말고! 식의 답변이긴 하지만!  
애매했던 부분을 이해하기에는 충분한 설명이었으리라 생각된다!

![](4.jpg)

```toc
```