---
emoji: 🤙
title: 'Promise 씹고 뜯고 맛보고 즐기고'
date: '2024-06-07'
categories: Dev
---

"자바스크립트의 비동기 함수에 대해 설명해보세요."  
"Promise에 대해 설명해보세요."  
"Promise와 async/await의 차이에 대해 설명해보세요."

프론트엔드 면접 유경험자라면, 정말 진절머리 나도록 많이 들어본 질문일 것이다.

![](0.png)

&nbsp;

그래서 어떻게 답변하면 되냐고?  
어.. 음..

![](1.jpeg)

그래서 써보는 글!

&nbsp;

## Promise란?

프로미스는 **비동기 작업의 최종 완료 또는 실패를 나타내는 객체**다.  
개발을 하면서 우리는 대부분 이미 만들어진 프로미스를 사용했을 것이다.  

프로미스가 없었을 때는 어떻게 비동기 로직을 순차적으로 처리했을까?  
그 해결책은 콜백 함수였다.

> 대표적인 예시로,
> 기존의 콜백 기반 API인 XMLHttpRequest을 대체하기 위해 나온 프로미스 기반의 Fetch API를 떠올려볼 수 있겠다.

&nbsp;

## 콜백으로 비동기 처리하기

지금은 누구나 사용하는 fetch와 axios.  
그 이전에는 XMLHttpRequest가 있었으니...

![](3.jpg)

&nbsp;

XMLHttpRequest를 이용하여 서버 요청 시나리오를 만들어보았다.

```js
function getDataFromServer(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.example.com/data', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback(new Error('Error getting data from server'));
      }
    }
  };
  xhr.send();
}

function sendDataToAnotherServer(data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.example.com/send', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback(new Error('Error sending data to another server'));
      }
    }
  };
  xhr.send(JSON.stringify({ data: data }));
}

function sendConfirmationEmail(response, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.example.com/email', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback(new Error('Error sending confirmation email'));
      }
    }
  };
  xhr.send(JSON.stringify({ response: response }));
}
```

그리고 위 함수들을 순차적으로 실행시켜 보자면..

```js
getDataFromServer((err, data) => {
  if (err) {
    console.error('Error getting data from server:', err);
  } else {
    sendDataToAnotherServer(data, (err, response) => {
      if (err) {
        console.error('Error sending data to another server:', err);
      } else {
        sendConfirmationEmail(response, (err, result) => {
          if (err) {
            console.error('Error sending confirmation email:', err);
          } else {
            console.log('All tasks completed successfully:', result);
          }
        });
      }
    });
  }
});
```

![](2.jpeg)

위 코드는 가독성이 떨어지며, 에러 처리가 중첩되어 있다.  

&nbsp;

## Promise로 비동기 처리하기

프로미스는 위 처럼 단순히 함수에 콜백을 전달하는 게 아닌,  
함수에 콜백을 첨부하는(콜백을 붙여 사용할 수 있게 하는) 방식의 객체라고 할 수 있다.

> fetch API는 프로미스를 반환하므로, 별도로 프로미스로 감쌀 필요가 없다.

```js
function getDataFromServer() {
  return fetch('https://api.example.com/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error getting data from server');
      }
      return response.json();
    });
}

function sendDataToAnotherServer(data) {
  return fetch('https://api.example.com/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: data })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error sending data to another server');
    }
    return response.json();
  });
}

function sendConfirmationEmail(responseData) {
  return fetch('https://api.example.com/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ response: responseData })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error sending confirmation email');
    }
    return response.json();
  });
}
```

이제 프로미스 체인(then)을 활용하여 비동기 작업을 처리할 수 있게 되었다.

> then() 함수는 새로운 프로미스를 반환한다.

```js
getDataFromServer()
  .then(data => sendDataToAnotherServer(data))
  .then(responseData => sendConfirmationEmail(responseData))
  .then(result => {
    console.log('All tasks completed successfully:', result);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

![](4.jpeg)

&nbsp;

## async/await로 비동기 처리하기

async/await함수의 목적은 사용하는 여러 프로미스의 동작을 동기스럽게 사용할 수 있게 하고,  
어떠한 동작을 여러 프로미스의 그룹에서 간단하게 동작하게 하는 것이다.

따라서 async 함수는 항상 프로미스를 반환하며,  
만약 async 함수의 반환값이 명시적으로 프로미스가 아니라면 암묵적으로 프로미스로 감싸진다.

```js
async function getDataFromServer() {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error('Error getting data from server');
  }
  return response.json();
}

async function sendDataToAnotherServer(data) {
  const response = await fetch('https://api.example.com/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: data })
  });
  if (!response.ok) {
    throw new Error('Error sending data to another server');
  }
  return response.json();
}

async function sendConfirmationEmail(responseData) {
  const response = await fetch('https://api.example.com/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ response: responseData })
  });
  if (!response.ok) {
    throw new Error('Error sending confirmation email');
  }
  return response.json();
}
```

이렇게 만들어진 async 함수들에 await를 사용하면..!

```js
async function performTasks() {
  try {
    const data = await getDataFromServer();
    const response = await sendDataToAnotherServer(data);
    const result = await sendConfirmationEmail(response);
    console.log('All tasks completed successfully:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

performTasks();
```

&nbsp;

### async/await는 아무렇게나 쓸 수 없다!

async/await로 비동기 코드를 간결하게 다룰 수 있다고 생각하고 막 쓴다면 제대로 동작하지 않을 수도 있다.

async 함수는 프로미스를 반환하지만, 프로미스를 반환하지 않는 오래된 API의 경우 await를 사용하려면 프로미스로 감싸주는 것이 필요하다.

그러니 "setTimeout은 왜 await가 안 되죠?"라는 질문은 하지 말길 바란다!

![](5.jpeg)

> 외않되?

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
  console.log('Waiting for 1 second...');
  await delay(1000);  // delay 함수가 Promise를 반환하므로 await 사용 가능
  console.log('1 second has passed!');
}

example();
```

> setTimeout은 함수에서 fail이 일어나거나 error가 발생하지 않기 때문에 reject를 사용하지 않았다.

&nbsp;

## 그렇다면 이제 답해보자!

🤔 **"자바스크립트의 비동기 함수에 대해 설명해보세요."**   

자바스크립트의 비동기 함수는 이벤트 루프를 통해 비동기적으로 작동하는 함수로, 어쩌구~  
> "어쩌구~"에 대한 내용은 [자바스크립트 런타임](https://www.jeong-min.com/49-js-runtime/#%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EB%9F%B0%ED%83%80%EC%9E%84-%EB%AA%A8%EB%8D%B8)에서 살펴볼 수 있다.

&nbsp;

🤔 **"Promise에 대해 설명해보세요."**  

프로미스란 비동기 작업의 최종 완료 또는 실패를 나타내는 객체로, 비동기 작업을 콜백으로 처리했을 경우에 발생하는 콜백 지옥과 중첩된 에러 핸들링 등의 문제를 then을 활용한 프로미스 체이닝으로 해결할 수 있습니다.  

프로미스를 사용할 경우 첨부된 콜백은 이벤트 루프가 현재 실행중인 콜 스택을 완료하기 이전에 절대 호출되지 않는 것을 보장하며, 프로미스 체이닝으로 추가된 콜백의 경우에도 위와 같습니다. 따라서 then으로 여러 개의 콜백을 추가했을 때, 각각의 콜백은 주어진 순서대로 실행되는 것이 보장됩니다.

즉, 프로미스는 구조화된 callback과 유사하다고 볼 수 있습니다.

&nbsp;

🤔 **"Promise와 async/await의 차이에 대해 설명해보세요."**  

async/await은 es6에서 도입된 문법으로, 여러 프로미스의 동작을 동기스럽게 사용할 수 있게 합니다. 프로미스는 then을 활용한 체이닝으로 비동기 작업을 순차적으로 진행할 수 있고, catch로 에러 핸들링을 할 수 있습니다. 반면 async/await는 그 자체로 여러 비동기 작업을 순차적으로 진행할 수 있고, try/catch로 에러 핸들링을 합니다.

async 함수는 항상 프로미스를 반환하며, await를 사용하려면 프로미스가 필요합니다. 그렇기 때문에 setTimeout과 같이 프로미스를 반환하지 않는 오래된 API의 경우, Promise로 감싸주지 않는다면 async/await를 바로 사용할 수 없습니다.

즉, async/await는 제너레이터와 프로미스를 묶는것과 유사하다고 볼 수 있습니다.

&nbsp;

![](7.jpeg)

> ???: 에이 이걸 누가 대답 못 해 ㅋㅋ

&nbsp;

## 그렇다면 Promise를 직접 만들어보자!

간단하다! then, catch 메서드를 지원하고, 비동기 작업을 처리할 수 있는 클래스를 만들어보자!

&nbsp;

1. **프로미스는 세 가지 상태를 가진다.**

```ts
type PromiseState = 'pending' | 'fulfilled' | 'rejected';
```

&nbsp;

2. **프로미스에서 첨부되는 콜백은 프로미스를 반환한다.**

```ts
interface Callbacks<T, U> {
  onFulfilled: ((value: T) => U) | null;
  onRejected: ((error: unknown) => U) | null;
  resolve: (value: U) => void;
  reject: (error: unknown) => void;
}
```

&nbsp;

3. **프로미스 클래스는 executor 함수를 인수로 받아, 비동기 작업을 처리한 후 resolve/reject한다.**

```ts
class MyPromise<T> {
  private callbacks: Callbacks<T, unknown>[] = [];
  private state: PromiseState = 'pending';
  private value: T | null = null;
  private error: unknown = null;

  constructor(executor: (resolve: (value: T) => void, reject: (error: unknown) => void) => void) {
    const resolve = (value: T) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.callbacks.forEach((callback) => {
        if (callback.onFulfilled) {
          try {
            const result = callback.onFulfilled(value);
            callback.resolve(result);
          } catch (error) {
            callback.reject(error);
          }
        }
      });
    };

    const reject = (error: unknown) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.error = error;
      this.callbacks.forEach((callback) => {
        if (callback.onRejected) {
          try {
            const result = callback.onRejected(error);
            callback.resolve(result);
          } catch (err) {
            callback.reject(err);
          }
        }
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
}
```

&nbsp;

4. **Promise의 then과 catch는 새로 생성된 프로미스 객체를 반환한다.**

```js
class MyPromise<T> {
  // ...

  then<U>(onFulfilled: (value: T) => U): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      this.handleCallback({
        onFulfilled,
        onRejected: null,
        resolve,
        reject,
      });
    });
  }

  catch<U>(onRejected: (error: unknown) => U): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      this.handleCallback({
        onFulfilled: null,
        onRejected,
        resolve,
        reject,
      });
    });
  }

  private handleCallback<U>(callback: Callbacks<T, U>): void {
    if (this.state === 'pending') {
      this.callbacks.push(callback as Callbacks<T, unknown>);
    } else if (this.state === 'fulfilled' && callback.onFulfilled) {
      try {
        const result = callback.onFulfilled(this.value as T);
        callback.resolve(result);
      } catch (error) {
        callback.reject(error);
      }
    } else if (this.state === 'rejected' && callback.onRejected) {
      try {
        const result = callback.onRejected(this.error);
        callback.resolve(result);
      } catch (error) {
        callback.reject(error);
      }
    }
  }
}
```

&nbsp;

5. **이제 똑같이 사용하면 된다!**

```js
function delay(ms: number) {
  return new MyPromise<string>(resolve => setTimeout(resolve, ms));
}

async function example() {
  console.log('Waiting for 1 second...');
  await delay(1000);
  console.log('1 second has passed!');
}

example();
```

![](6.webp)

```toc
```