---
emoji: 🤔
title: '실행 컨텍스트, 어떻게 설명할 수 있을까?'
date: '2024-08-31'
categories: Dev
---

"자바스크립트의 실행 컨텍스트에 대해 설명해보세요."  

*아.. 그.. 알긴 아는데.. 아.. 어떻게 설명을..*

&nbsp;

질문을 받을 때 마다 머릿속이 새하야지는 바로 그 질문!

![](0.jpg)

&nbsp;

## 자바스크립트 실행 컨텍스트란?

실행 컨텍스트는 말 그대로, 자바스크립트 코드가 실행되는 환경으로,  
코드가 실행될 때 생성되는 일종의 컨테이너라고 볼 수 있다.  
실행 컨텍스트에는 변수 및 함수 선언, 스코프와 this 바인딩 정보 같은 것들이 저장된다.

실행 컨텍스트는 크게 전역 실행 컨텍스트와 함수 실행 컨텍스트로 나눌 수 있는데,  
함수가 호출되면 새로운 실행 컨텍스트가 만들어지고 콜 스택에 쌓이게 되며,  
함수 실행이 끝나면 해당 컨텍스트는 콜 스택에서 제거된다.

> 콜 스택을 포함한 자바스크립트 런다임에 대한 더 자세한 내용은 [자바스크립트 엔진: "어, 아직 싱글이야" | JS 런타임에 대해 알아보자](https://www.jeong-min.com/49-js-runtime/)에서 확인할 수 있다.

&nbsp;

놀랍게도, 이러한 실행 컨텍스트로 인해 스코프 체인, 클로저, 변수 호이스팅 같은 것들이 가능해지는 것이다!  

&nbsp;

### 스코프 체인

> ✋ 잠깐 짚고 넘어가기!
> - 스코프란 참조 대상 식별자(변수와 함수같이 어떤 대상을 다른 대상과 구분하여 식별할 수 있는 유일한 이름)를 찾아내기 위한 규칙이다.  
> - 자바스크립트는 함수 호출이 아닌 함수 선언에 따라 상위 스코프가 결정되는 렉시컬 스코프(정적 스코프)를 가진다.  
> - ES6 이전에는 함수 스코프와 전역 스코프 두 가지만 존재했고, ES6 이후부터 블록 스코프가 등장하게 되었다.  
> - 블록은 var로 선언한 변수에 대해 스코프를 생성하지 않기 때문에 let/const를 사용하는 것이 안전하다.

&nbsp;

실행 컨텍스트가 생성될 때 스코프 체인도 같이 만들어지는데,  
이 체인은 현재 컨텍스트의 변수 객체와 상위 컨텍스트들의 변수 객체를 연결한 목록이다.  
변수를 찾을 때, 우리는 이 체인을 따라 올라가면서 찾게 된다.


&nbsp;

```js
let global = "전역";

function outer() {
  let outer = "외부";
  function inner() {
    let inner = "내부";
    console.log(inner, outer, global);
  }
  inner();
}

outer();
```

위 코드에서 스코프는 다음과 같다.
- inner 함수의 스코프
- outer 함수의 스코프
- 전역 스코프

그리고 inner 함수의 실행 컨텍스트는 위 세 개의 스코프로 이어지는 스코프 체인을 가지게 되는 것이다.

&nbsp;

### 클로저

> 클로저에 대한 별도의 글은 [클로저와 더 가까워지기](https://www.jeong-min.com/50-closure/)에서 확인할 수 있다.

클로저는 함수와 그 함수가 선언됐을 때의 렉시컬 환경의 조합이다.  
여기서 말하는 렉시컬 환경이라는 것이 바로 실행 컨텍스트의 일부라고 할 수 있다.

클로저는 함수가 자신이 선언된 환경, 즉 자신의 실행 컨텍스트를 기억하고 있다가,  
나중에 다른 곳에서 호출되더라도 그 환경에 접근할 수 있게 해준다.

&nbsp;

```js
function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  }
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

위 코드에서,
makeCounter에서 반환된 함수는 makeCounter의 실행 컨텍스트를 기억하고 있기 때문에 count 변수에 계속 접근할 수 있다.

> 이렇게 다른 함수에 의해 반환되는 함수를 일급 함수라고 한다.  
> 일급 함수에 대한 더 자세한 내용은 [함수형 프로그래밍, 일급 함수와 고차 함수로 일급 추상화를 해보자](https://www.jeong-min.com/65-first-class-abstractions/)에서 확인할 수 있다.

&nbsp;

### 변수 호이스팅

> 호이스팅에 대한 별도의 글은 [var/let/const로 알아보는 호이스팅과 TDZ](https://www.jeong-min.com/68-hoisting/)에서 확인할 수 있다.

변수 호이스팅은 실행 컨텍스트가 생성되는 과정과 관련이 있다.  
실행 컨텍스트가 생성될 때, 내부적으로 변수 선언들이 먼저 스캔되어 미리 메모리에 저장된다.  
이 때문에 변수 선언이 코드의 맨 위로 끌어올려진 것처럼 동작하는 것이다.

&nbsp;

```js
console.log(x); // undefined
var x = 5;
```

위 코드에서, 실행 컨텍스트 생성 단계에서 이미 x라는 변수를 인식하고 undefined로 초기화했기 때문에 에러가 발생하지 않는다.

&nbsp;

## 그렇다면 이제 답해보자!

🤔 **"자바스크립트의 실행 컨텍스트 대해 설명해보세요."**   

실행 컨텍스트는 자바스크립트 코드가 실행되는 환경입니다. 실행 컨텍스트에는 변수 및 함수 선언, 스코프와 this 바인딩 정보 같은 것들이 저장됩니다.

실행 컨텍스트는 크게 전역 실행 컨텍스트와 함수 실행 컨텍스트로 나눌 수 있는데, 함수가 호출되면 새로운 실행 컨텍스트가 만들어지고 콜 스택에 쌓이게 되며, 함수 실행이 끝나면 해당 컨텍스트는 콜 스택에서 제거됩니다.

실행 컨텍스트는 스코프 체인, 클로저, 변수 호이스팅과 같은 자바스크립트의 핵심 동작 원리들과도 깊이 관련되어 있습니다.

&nbsp;

🤔 **"스코프 체인에 대해 설명해보세요."**  

실행 컨텍스트가 생성될 때 스코프 체인도 같이 만들어지는데, 현재 컨텍스트의 변수 객체와 상위 컨텍스트들의 변수 객체를 연결한 목록이라고 볼 수 있습니다. 변수를 찾을 때, 이 스코프 체인을 따라 올라가면서 찾게 됩니다.

&nbsp;

🤔 **"스코프에 대해 설명해보세요."**  

스코프란 변수와 함수와 같은 값들을 찾아내기 위한 규칙입니다. 자바스크립트는 함수 호출이 아닌 함수 선언에 따라 상위 스코프가 결정되는 렉시컬 스코프(정적 스코프)를 가집니다.  

ES6 이전에는 함수 스코프와 전역 스코프 두 가지만 존재했지만, ES6 이후부터 let/const와 함께 블록 스코프가 등장하게 되었습니다.  

&nbsp;

🤔 **"클로저에 대해 설명해보세요."**  

클로저는 함수와 그 함수가 선언됐을 때의 렉시컬 환경의 조합입니다. 클로저는 함수가 자신이 선언된 환경, 즉 자신의 실행 컨텍스트를 기억하고 있다가, 나중에 다른 곳에서 호출되더라도 그 환경에 접근할 수 있게 해줍니다.

리액트의 useState 훅 또한 클로저를 활용한 상태 관리 기능으로 볼 수 있습니다. 클로저를 활용하여 프라이빗 변수를 흉내내는 모듈 패턴을 구현할 수도 있습니다.

&nbsp;

실행 컨텍스트, 이제 언제 어디서든 술술 답변할 수 있길!

![](1.jpg)

```toc
```