---
emoji: 🤕
title: 'this 바인딩 넘 어려운딩'
date: '2024-09-06'
categories: Dev
---

함수형 컴포넌트와 화살표 함수가 많이 사용되는 요즘,  
this 바인딩은 실무에서 점점 찾아보기 힘들어지는 개념이 되어가는 듯하다.

하지만 어쩔 수 없다. 꼭 알아야 하는 개념이다. 공부하자.

![](0.jpg)

&nbsp;

## 함수가 호출되는 방식에 따라 다르게 바인딩되는 this

자바스크립트의 this는 매우 강력하면서도 때로는 혼란스러운 키워드다.  
함수가 어떻게 호출되느냐에 따라 동적으로 바인딩되는 this, 한번 같이 알아보자!

&nbsp;

### 1. 일반 함수 호출

일반 함수로 호출될 때 this는 전역 객체를 가리킨다.  
즉, 브라우저에서는 window, node.js에서는 global을 가리키게 된다.

```js
function showThis() {
  console.log(this);
}
showThis(); // window 또는 global
```

&nbsp;

🤔 **"전역 스코프가 아닌 함수 스코프를 가지는데 왜 전역 객체를 가리키는 거지?"**  

**함수 스코프와 this 바인딩은 서로 다른 개념이다!**  
함수 스코프는 변수의 접근 범위를 결정하는 규칙인 반면,  
this 바인딩은 함수가 어떻게 호출되었는지에 따라 결정되는 실행 컨텍스트다.

함수 내부에서 변수를 찾을 때는 스코프 체인을 따라 찾게 되지만,  
this는 스코프 체인과 별개로 함수가 어떻게 호출되었는지에 따라 결정된다.

&nbsp;

### 2. 메서드 호출

객체의 메서드로 호출될 때, this는 해당 메서드를 소유한 객체를 가리킨다.

```js
const obj = {
  name: '자바스크립트',
  showThis: function() {
    console.log(this.name);
  }
};

obj.showThis(); // 자바스크립트
```

&nbsp;

### 3. 생성자 함수 호출

new 키워드와 함께 호출되는 생성자 함수에서, this는 새로 생성되는 인스턴스를 가리킨다.

```js
function Person(name) {
  this.name = name;
}
const person = new Person('자바스크립트');
console.log(person.name); // '자바스크립트'
```

&nbsp;

## 내 맘대로 this를 지정할 수는 없을까?

call, apply, bind와 같은 메서드로 this를 명시적으로 지정할 수 있다!  
이를 **명시적 바인딩**이라고 한다.

```js
function showThis() {
  console.log(this.name);
}
showThis(); // undefined

const obj = {
  name: '자바스크립트',
}

showThis.call(obj); // 자바스크립트
```

&nbsp;

## 화살표 함수에서는 어떻게 동작할까?

화살표 함수는 자신만의 this를 갖지 않는다!  
따라서 화살표 함수는 생성자 함수로 사용할 수 없다.

화살표 함수 내의 this는, 화살표 함수가 정의된 시점에서의 상위 실행 컨텍스트의 this를 가리킨다.

&nbsp;

```js
const arrowShowThis = () => {
  console.log(this);
}
arrowShowThis(); // window 또는 global
```

위 코드에서 showThis는 전역 스코프에서 정의되었다.  
화살표 함수의 상위 실행 컨텍스트는 전역 실행 컨텍스트이므로 this는 전역 객체를 가리킨다.

&nbsp;

```js
const obj = {
  arrowShowThis: () => {
    console.log(this);
  },
  showThis() {
    console.log(this);
  }
};

obj.arrowShowThis(); // window 또는 global
obj.showThis(); // obj
```

화살표 함수 또한 객체의 프로퍼티로 할당되지만, 객체 리터럴이 평가되는 스코프는 전역 스코프다.  
따라서 arrowShowThis 내의 this는 전역 객체를 가리키게 된다.

&nbsp;

### 화살표 함수에서 this를 유용하게 쓰는 방법이 있을까?

위에서 말했듯,  
**화살표 함수 내의 this는 화살표 함수가 정의된 시점에서의 상위 실행 컨텍스트의 this를 가리킨다.**

그렇기에 클래스에서 메서드를 화살표 함수로 정의하면 아주 유용하게 사용할 수 있다.  
this가 항상 인스턴스를 가리키게 되기 때문이다.

&nbsp;

한번 클레스의 메서드들을 일반 함수와 화살표 함수로 각각 작성해보자.

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  
  showThis() {
    console.log(this.name);
  }

  arrowShowThis = () => {
    console.log(this.name);
  }

  delayedShowThis() {
    setTimeout(this.showThis, 100);
  }

  delayedArrowShowThis() {
    setTimeout(this.arrowShowThis, 100);
  }
}

const person = new Person('자바스크립트');
person.showThis(); // 자바스크립트
person.arrowShowThis(); // 자바스크립트

const showThis = person.showThis;
const arrowShowThis = person.arrowShowThis;

showThis(); // undefined
arrowShowThis(); // 자바스크립트

person.delayedShowThis(); // undefined
person.delayedArrowShowThis(); // 자바스크립트
```

`person.showThis()`로 호출할 때, this는 person 객체를 가리킨다.  
하지만 `person.showThis()`를 `showThis` 변수에 할당하여 호출하면,  
이는 메서드 호출이 아닌 일반 함수 호출이 되기 때문에 this는 전역 객체를 가리키게 된다.

`delayedArrowShowThis`의 경우 화살표 함수의 외부 스코프의 this인 person 객체를 유지하는 반면,
`delayedShowThis`의 경우 setTimeout의 콜백 함수는 일반 함수 호출이 되기 때문에 this는 전역 객체를 가리키게 된다.

&nbsp;

항상 헷갈리고 복잡한 자바스크립트의 this.

![](1.png)

프로토타입 기반 객체지향은 클래스 기반 객체지향과 객체를 바라보는 개념이 다르다.  
렉시컬 스코프, 실행 컨텍스트, 호이스팅, this 바인딩..  
이 모든 것들은 자바스크립트의 디자인 철학, 프로토타입 패턴에 의해 필연적으로 생겨날 수밖에 없었다.

> 그러니 받아들이자.

![](3.jpg)

&nbsp;

> 프로토타입 기반 객체지향 언어인 자바스크립트에서, 왜 이러한 복잡한 현상이 생겨나는지에 대해 아주 잘 정리된 글: 
> [자바스크립트는 왜 프로토타입을 선택했을까](https://medium.com/@limsungmook/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-997f985adb42)

```toc
```