---
emoji: 🍦
title: '바닐라JS(TS)로 리액트 SPA 구현하기 | (4) 클래스로 BrowserRouter 구현'
date: '2022-05-16'
categories: Dev React만들어보기
---

이번 글에서는 BrowserRouter를 구현해보도록 하겠습니다.

&nbsp;

## 1. Route 타입 정의

```ts
export type Route = {
  path: string;
  page: typeof Component;
};
```
이는 HashRouter와 동일합니다.

&nbsp;

## 2. Router 구조

```ts
class Router {
  $app: HTMLElement;
  routes: {
    [key: string]: typeof Component;
  } = {};
  fallback: string = "/";

  constructor() {}          // 생성자

  initEvent() {}            // hash가 변경되었을 때의 이벤트 init
  
  onRouteChangeHandler() {} // hash가 변경되었을 때의 이벤트 핸들러

  hasRoute() {}             // 올바른 라우트인지 검증

  getRoute() {}             // 해당 라우트 가져오기

  renderPage() {}           // 페이지 렌더링

  push() {}                 // 라우터 push
}
```
라우터 구조 또한 HashRouter의 경우와 똑같이 잡아주도록 하겠습니다. 다만 이번에는 `onHashChangeHandler`가 아닌 `onRouterChangeHandler`로 네이밍해주었습니다.

&nbsp;

## 3. Class 초기화

당연히 생상자 내부 코드도 동일하겠죠?

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

이제부터 HashRouter와 다른 로직이 등장하게 됩니다. HashRouter의 경우 Hash가 변경될 때 이벤트 처리를 해주었지만, BrowserRouter의 경우 history API를 사용합니다.

`initEvent`에서 window 객체의 이벤트 리스너에 핸들러를 등록해줍시다.

```ts
initEvent() {
  document.addEventListener(
    "moveRoutes",
    this.moveRoutesHandler.bind(this) as EventListener
  );
}

moveRoutesHandler(event: CustomEvent) {
  const path: string = event.detail.path;
  history.pushState(event.detail, "", path);

  this.renderPage(path);
}
```
여기서 의문이 들 수 있습니다. document 객체의 이벤트 리스너에 `moveRoutes`라는 이벤트가 있었나? 싶을 텐데요. 맞습니다. document 객체에서는 history의 변경사항을 알아챌 수 없습니다.

따라서 직접 커스텀 이벤트를 작성해주어야 합니다.

&nbsp;

## 5. customEventEmitter

`/src/utils/helpers.ts`
```ts
export const customEventEmitter = (eventType: string, detail?: object) => {
  document.dispatchEvent(
    new CustomEvent(eventType, {
      detail,
    }),
  );
};
```
`CustomEvent`를 dispatch할 수 있는 헬퍼 함수를 만들어 줍시다.

&nbsp;

## 6. 해당하는 페이지 렌더링

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
  customEventEmitter("moveRoutes", {
    ...history.state,
    path,
  });
}
```
다른 로직은 HashRouter와 모두 동일하지만, 라우트를 push할 경우에는 더 이상 window의 hash 값을 바꾸는 게 아닌, `customEventEmitter`를 사용하여 새로운 페이지가 렌더링 될 수 있도록 해야 합니다.

&nbsp;

## 7. 라우터 export

```ts
export let router: {
  push: (path: string) => void;
};

export function initRouter(options: {
  $app: HTMLElement;
  routes: Route[];
}): void {
  const routerObj = new Router(options);

  router = {
    push: (path) => routerObj.push(path),
  };

  customEventEmitter(
    "moveRoutes",
    history.state ?? {
      path: "/",
    }
  );
}
```
`initRouter`에서도 단순히 `onRouterChangeHandler`를 호출하는 게 아닌, `customEventEmitter`를 호출하여 루트 페이지가 렌더링 될 수 있도록 해야 합니다.


## 전체 코드

`/src/core/BrowserRouter.ts`
```ts
import Component from "@/core/Component";
import { customEventEmitter } from "@/utils/helpers";

export type Route = {
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
    document.addEventListener(
      "moveRoutes",
      this.onRouteChangeHandler.bind(this) as EventListener
    );
  }

  onRouteChangeHandler(event: CustomEvent) {
    const path: string = event.detail.path;
    history.pushState(event.detail, "", path);

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
    customEventEmitter("moveRoutes", {
      ...history.state,
      path,
    });
  }
}

export let router: {
  push: (path: string) => void;
};

export function initRouter(options: {
  $app: HTMLElement;
  routes: Route[];
}): void {
  const routerObj = new Router(options);

  router = {
    push: (path) => routerObj.push(path),
  };

  customEventEmitter(
    "moveRoutes",
    history.state ?? {
      path: "/",
    }
  );
}
```

```toc
```