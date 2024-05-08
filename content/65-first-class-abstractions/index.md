---
emoji: 🥇
title: '함수형 프로그래밍, 일급 함수와 고차 함수로 일급 추상화를 해보자'
date: '2024-05-08'
categories: Dev
---

> 본격 순수 함수를 시작으로 조금씩 함수형 프로그래밍과 친해져보기로 마음먹은 김에 시작해보는 시리즈

![](0.jpeg)

> ㅋㅋ

[지난 글](https://www.jeong-min.com/62-pure-impure-function/)에서는 함수형 프로그래밍에서 말하는 순수 함수에 대해 알아보았는데,  
이번 글에서는 일급 값과 함께, 일급 함수와 고차 함수에 대해 알아보도록 하겠다!

&nbsp;

## 일급이란?

![](1.jpeg)
> 월급 아니고 일급이요 ㅋ.ㅋ

다음과 같은 식으로 쓸 수 있는 값을 **일급**이라고 한다.

1. 변수에 할당하기
2. 함수의 인자로 전달하기
3. 함수에 의해 반환되기
4. 배열이나 객체에 담기

&nbsp;

### 일급이 아닌 것은?

물론 자바스크립트에는 일급이 아닌 것도 있다.  
수식 연산자, 반복문, 조건문, try/catch문 같은 것들은 자바스크립트에서 값이 아니기 때문에 일급이라고도 할 수 없다.

> 자바스크립트 뿐만 아니라,  
> 대부분의 언어가 일급이 아닌 값들을 가진다.

&nbsp;

중요한 것은 **일급이 아닌 것을 일급으로 바꾸는 것**이다!

\+ 연산자를 변수에 할당할 수는 없지만, + 연산자와 동일한 행동을 수행하는 함수를 만들 수는 있다.

```ts
function plus(a: number, b: number) {
  return a + b;
}
```

일급이 아닌 것도 함수로 감싸 일급으로 만들 수 있다는 것이다.

![](2.jpeg)
> 꼬옥 감싸주자

&nbsp;

## 일급 함수란?

다음을 만족하는 함수를 일급 함수라고 한다.

1. 다른 함수들에 인자로 전달될 수 있고 (콜백 함수)
2. 다른 함수에 의해 반환될 수 있고
3. 변수에 값으로 할당될 수 있다.

&nbsp;

## 고차 함수란?

위에서 일급 함수는 인자로 전달될 수 있다고 했다.  
고차 함수는 다른 함수를 인자로 받는 함수로,  
즉 콜백 함수를 인자로 받는 함수를 고차 함수라고 한다.  
일급 함수가 없다면 고차 함수를 만들 수 없는 것이다.

이런 고차 함수로 다양한 동작을 추상화할 수 있다.

&nbsp;

이제 개념을 알았으니, 실제로 어떻게 사용되는지 보자!

&nbsp;

## 일급을 활용한 리팩토링

### 1. 필드명을 일급 값으로 만들기

함수**명** 자체는 일급이 아니다. 따라서 함수명 일부를 값처럼 쓸 수는 없다.  
하지만 함수명의 일부를 인자로 사용하게끔 해서 필드를 일급으로 만들 수는 있다.

```ts
type CartType = {
  price: number;
  quantity: number;
};

function setPriceByName(cart: CartType, price: number) {
  cart.price = price;
}

function setQuantityByName(cart: CartType, quantity: number) {
  cart.quantity = quantity;
}
```

위 코드는 두 가지 문제점이 있다.
1. 거의 동일하게 구현된 중복 코드가 존재한다.
2. 함수 이름이 구현에 있는 다른 부분을 가리킨다.

&nbsp;

`price`와 `quantity`라는 필드명은 단순히 구현에 있는 다른 부분을 가리키는,  
명시적이지 않은 암묵적인 인자일 뿐이다.

위의 코드를 아래와 같이 리팩토링해보자.

```ts
type CartType = {
  price: number;
  quantity: number;
};

function setFieldByName(cart: CartType, field: keyof CartType, value: number) {
  cart[field] = value;
}
```

`field`는 구현의 다른 부분을 가리키지도 않고, 암묵적이지도 않은 **명시적인 일급 값**이 되었다.  
중복 코드도 사라진데다, 혹여나 필드명이 바뀌더라도 함수명을 바꾸지 않아도 되게 바뀌었다!

&nbsp;

### 2. 반복문을 일급 함수로 만들기

아래와 같은 두 반복문이 있다고 해보자.

```ts
for (let i = 0; i < foods.length; i++) {
  const food = foods[i];
  cook(food);
  eat(food);
}

for (let i = 0; i < books.length; i++) {
  const book = books[i];
  buy(book);
  read(book);
  close(book);
}
```

코드가 비슷하긴 하지만, 당장 공통화하기는 어려워 보인다.  
우선은 각 반복문을 일급 함수로 만들어보자.

```ts
function handleFood() {
  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    cook(food);
    eat(food);
  }
}

function handleBook() {
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    buy(book);
    read(book);
    close(book);
  }
}
```

위 코드에도 이전의 리팩토링 예시처럼, `food`와 `book`이라는 암묵적 인자가 존재한다.  
이를 개선해보자.

```ts
function handleFoodArray(array: FoodType[]) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    cook(item);
    eat(item);
  }
}

function handleBookArray(array: BookType[]) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    buy(item);
    read(item);
    close(item);
  }
}
```

이제 중복 코드가 생겨났다!  
중복 코드는 추상화로 혼내줘야 제맛이지.

![](4.jpeg)

위에서 고차 함수로 다양한 동작을 추상화할 수 있다고 했다.  
중복 가능성 있는 코드를 캡슐화하여, 일급 추상화를 진행해보자!

&nbsp; 

### 3. 고차 함수로 추상화하기

중복 코드를 제거할 수 있도록, 반복문 안의 본문을 콜백으로 분리해보자.

```ts
function handleArray<T>(array: T[], callback: (item: T) => void) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    callback(item);
  }
}

function handleFood(food: FoodType) {
  cook(food);
  eat(food);
}

function handleBook(book: BookType) {
  buy(book);
  read(book);
  close(book);
}

handleArray<FoodType>(foods, handleFood);
handleArray<BookType>(books, handleBook);
```

휴! 긴 여정을 거쳤다. 우리는 고차 함수를 직접 만들어 코드를 리팩토링 해보았다.  
하지만 놀랍게도, 자바스크립트에는 배열을 순회하는 고차 함수가 이미 존재한다.

![](3.jpeg)

```ts
foods.forEach((food) => {
  cook(food);
  eat(food);
});

books.forEach((book) => {
  buy(book);
  read(book);
  close(book);
});
```

> 여기에서 forEach 내 콜백 함수는 이름이 없는 익명 함수다.

&nbsp;

예시 코드가 너무 시시해서 재미없다고?  

![](5.jpeg)
> 제 글이 쓰레기 같진 않..죠..? 🥹

&nbsp;

그렇다면.. 좀 더 현실에 있을 법한 코드를 봐보자.

```ts
const updateUserWithLogging = () => {
  try {
    updateUser(user);
  } catch (e) {
    console.log(e);
  }
};

updateUserWithLogging();
```

위 코드에서, `updateUserWithLogging`는 일급 함수이지만,  
`updateUser`라는 내부 구현을 암묵적으로 드러내고 있으며,  
내부에서 실행되는 본문 또한 추상화되어 있지는 않다.

&nbsp;

`updateUserWithLogging`를 고차 함수로 만들어보자!

```ts
const handleWithLogging = (callback: () => void) => {
  try {
    callback();
  } catch (e) {
    console.log(e);
  }
};

const updateUserWithLogging = () =>
  handleWithLogging(() => {
    updateUser(user);
  });

const updateBookWithLogging = () =>
  handleWithLogging(() => {
    updateBook(book);
  });
```

`updateUser(user)`를 익명 함수로 감싸서 전달하여 함수의 실행을 미루었으며,  
`handleWithLogging`는 이제 다른 일급 함수를 인자로 받아 실행할 수 있게 되었다.

&nbsp;

하지만 여전히 모든 코드에 수동으로 함수를 감싸야 한다는 문제점이 있다.

&nbsp;

### 4. 함수를 리턴하기

```ts
const logWrapper = (callback: () => void) => () => {
  try {
    callback();
  } catch (e) {
    console.log(e);
  }
};

const updateUserWithLogging = logWrapper(() => {
  updateUser(user);
});

const updateBookWithLogging = logWrapper(() => {
  updateBook(book);
});
```

logWrapper는 내부 로직을 함수로 감싸 리턴하고, 이렇게 감싸진 코드는 나중에 실행될 수 있다.

> updateUserWithLogging을 호출하면 감싸진 함수가 반환되고,  
> logWrapper의 실행 컨텍스트는 소멸된다.  
> 이 또한 클로저의 개념이다.

> 커링과는 다르다!  
> 함수를 리턴하는 함수는 함수의 체인이긴 하지만,  
> 커링은 여러 인자를 받는 함수를 분리하여 하나의 인자만 받는 함수의 체인으로 만드는 방법이다.

&nbsp;

위 리팩토링에서 우리는 다음과 같은 과정을 거쳤다.

1. 원래 동작을 고차 함수의 콜백으로 전달하도록 한다.
2. 고차 함수의 행동을 새로운 함수로 감싸 실행을 미루도록 한다.
3. 고차 함수가 새로운 함수를 리턴하도록 한다.

![](6.webp)

&nbsp;

## 정리해보면,

- 일급 값은 코드로 다룰 수 있는 값이다.
  - 코드로 다룰 수 없는 함수 이름을 일급 필드로 바꾸는 예시를 보았다.
- 일급 값으로 쓸 수 있는 함수를 일급 함수라고 한다.
- 일급이 아닌 기능도 일급 함수로 만들 수 있다.
- 고차 함수는 일급 함수를 인자로 받는(콜백 함수) 함수로, 추상화에 유용하다.
  - 함수 본문을 콜백으로 바꾸는 예시를 보았다.
- 고차 함수로 함수를 리턴하는 함수를 만들 수 있다.

&nbsp;

### 모든 코드를 고차 함수로 바꿔야 하는가?

그렇지 않다!   
추상화와 공통화가 항상 옳은 건 아니라고 생각한다.  
모든 코드에는 트레이드오프가 따르기 때문이다.  
추상화된 코드가 엄청난 중복 코드를 해결할 수 있다면 좋은 코드가 되겠지만,  
과도하게 추상화된 코드로 인해 가독성이 떨어진다면 오히려 좋지 못한 코드가 된다고 생각한다.

![](7.jpeg)

```toc
```