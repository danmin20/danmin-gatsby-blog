---
emoji: 🍦
title: '바닐라JS(TS)로 리액트 SPA 구현하기 | (3) 클래스로 HashRouter 구현'
date: '2022-05-15'
categories: Dev React만들어보기
---

라우터를 구현하는 대표적인 방법에는 두 가지가 있습니다. 바로 BrowserRouter와 HashRouter인데요, 이 둘의 차이에 대해 잘 모르신다면 아래의 글을 먼저 읽어주세요!  
[BrowserRouter와 HashRouter, 뭐가 다를까? (feat. React Router)]

HashRouter와 BrowserRouter를 모두 구현해 볼 텐데요, 이번 글에서는 HashRouter에 대해 먼저 다루어보도록 하겠습니다.

&nbsp;

## 1. Route 타입 정의

```ts
export type Route = {
  path: string;
  page: typeof Component;
};
```
라우트는 path와 해당 path에 해당하는 컴포넌트를 가지는 객체입니다.

&nbsp;

## 2. Router 구조

```ts
class Router {
  $app: HTMLElement;
  routes: {
    [key: string]: typeof Component;
  } = {};
  fallback: string = "/";

  constructor() {}         // 생성자

  initEvent() {}           // hash가 변경되었을 때의 이벤트 init
  
  onHashChangeHandler() {} // hash가 변경되었을 때의 이벤트 핸들러

  hasRoute() {}            // 올바른 라우트인지 검증

  getRoute() {}            // 해당 라우트 가져오기

  renderPage() {}          // 페이지 렌더링

  push() {}                // 라우터 push
}
```
SPA의 최상단 엘리먼트 객체와 정의된 라우트들을 필수적으로 받게 됩니다. 그리고 이벤트와 라우트를 다루는 여러 메서드를 통해 라우팅을 하게 됩니다.

&nbsp;

## 3. Class 초기화

우선, 라우터 객체가 인스턴스화될 때의 설정을 생성자에서 해주어야겠죠.

```ts
constructor({
  $app,
  routes,
  fallback = "/",
}: {
  $app: HTMLElement;
  routes: Route[];
  fallback?: string;
}) {
  this.$app = $app;
  this.fallback = fallback;

  routes.forEach((route: Route) => {
    this.routes[route.path] = route.page;
  });

  this.initEvent();
}
```
최상단 엘리먼트 객체, fallback url, 라우트들을 초기화해주고, `initEvent`를 실행합니다.

&nbsp;

## 4. hash가 변경될 때의 이벤트 처리

`initEvent`에서 window 객체의 이벤트 리스너에 핸들러를 등록해줍시다.

```ts
initEvent() {
  window.addEventListener("hashchange", () => this.onHashChangeHandler());
}
  
onHashChangeHandler() {
  this.$app.innerHTML = "";

  const hash = window.location.hash;
  let path = hash.substring(1);

  this.renderComponent(path);
}
```
`onHashChangeHandler`에서는 app을 빈 스트링으로 초기화해주고, hash값을 파싱하여 해당하는 페이지를 렌더링하게 됩니다.

&nbsp;

## 5. 해당하는 페이지 렌더링

```ts
hasRoute(path: string) {
  return typeof this.routes[path] !== "undefined";
}

getRoute(path: string) {
  return this.routes[path];
}

renderPage(path: string) {
  let route;

  /* 동적 라우팅 처리 */
  const regex = /\w{1,}$/; // 동적 라우팅으로 전달되는 :id 는 모두 [문자열 + 숫자] 조합으로 간주

  if (this.hasRoute(path)) {
    route = this.getRoute(path);
  } else if (regex.test(path)) {
    // 주소가 없는 경우를 동적 라우팅으로 간주하고 이를 :id 로 치환
    route = this.getRoute(path.replace(regex, ":id"));
  } else {
    // 그 외 입력되지 않은 모든 주소에 대해서는 fallback 실행
    route = this.getRoute(this.fallback);
  }

    new route(this.$app, {});
  }

push(path: string) {
  window.location.hash = path;
}
```
존재하는 라우터인지 검증하고, 아닐 경우 fallback이 렌더링되도록 해주었습니다.

동적 라우팅도 처리해주어야겠죠? 동적 라우팅의 경우 hasRoute를 통과하지 못할 것입니다. 이에 대해 정규식으로 처리하여 동적 라우팅을 처리해줍시다.

&nbsp;

## 6. 라우터 export

push 메서드를 사용할 수 있도록 router를 export 해주고, index.ts에서 라우터를 초기화할 수 있도록 `initRouter`를 export 해줍시다.

```ts
export let router: {
  push: (path: string) => void;
};

export function initRouter(options: { $app: HTMLElement; routes: Route[] }) {
  const routerObj = new Router(options);

  router = {
    push: (path) => routerObj.push(path),
  };

  routerObj.onHashChangeHandler();
}
```

&nbsp;

## 전체 코드

`/src/core/HashRouter.ts`
```ts
import Component from "./Component";

type Route = {
  path: string;
  page: typeof Component;
};

class Router {
  $app: HTMLElement;
  routes: {
    [key: string]: typeof Component;
  } = {};
  fallback: string = "/";

  constructor({
    $app,
    routes,
    fallback = "/",
  }: {
    $app: HTMLElement;
    routes: Route[];
    fallback?: string;
  }) {
    this.$app = $app;
    this.fallback = fallback;

    routes.forEach((route: Route) => {
      this.routes[route.path] = route.page;
    });

    this.initEvent();
  }

  initEvent() {
    window.addEventListener("hashchange", () => this.onHashChangeHandler());
  }

  onHashChangeHandler() {
    this.$app.innerHTML = "";

    const hash = window.location.hash;
    let path = hash.substring(1);

    this.renderPage(path);
  }

  hasRoute(path: string) {
    return typeof this.routes[path] !== "undefined";
  }

  getRoute(path: string) {
    return this.routes[path];
  }

  renderPage(path: string) {
    let route;

    /* 동적 라우팅 처리 */
    const regex = /\w{1,}$/; // 동적 라우팅으로 전달되는 :id 는 모두 [문자열 + 숫자] 조합으로 간주

    if (this.hasRoute(path)) {
      route = this.getRoute(path);
    } else if (regex.test(path)) {
      // 주소가 없는 경우를 동적 라우팅으로 간주하고 이를 :id 로 치환
      route = this.getRoute(path.replace(regex, ":id"));
    } else {
      // 그 외 입력되지 않은 모든 주소에 대해서는 fallback 실행
      route = this.getRoute(this.fallback);
    }

    new route(this.$app, {});
  }

  push(path: string) {
    window.location.hash = path;
  }
}

export let router: {
  push: (path: string) => void;
};

export function initRouter(options: { $app: HTMLElement; routes: Route[] }) {
  const routerObj = new Router(options);

  router = {
    push: (path) => routerObj.push(path),
  };

  routerObj.onHashChangeHandler();
}
```

```toc
```