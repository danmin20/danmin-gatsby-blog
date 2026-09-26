---
emoji: 🤷
title: "output: 'export'로 Next.js를 쓸 이유가 있을까?"
date: '2026-09-27'
categories: Dev
---

> 서버 기능을 거의 다 내려놓는 static export에서, Next.js에는 과연 무엇이 남는가?

![](0.jpeg)

&nbsp;

[Next.js는 서버 없이 prefetch를 어떻게 할까?](https://www.jeong-min.com/93-static-export-rsc/)를 쓰면서 `output: 'export'`로 빌드한 결과물을 한참 들여다봤다.  
동적 경로를 빌드 때 다 알 수 없어서, 실제 slug 대신 `_` 같은 임시 값(placeholder)으로 페이지 하나만 만들고 CDN에서 모든 slug를 그 페이지로 돌려주는 방식도 재현해 봤다.  
그 과정에서 `useParams()`가 URL의 값이 아니라 placeholder 값을 돌려줘서 slug를 URL에서 직접 읽어야 했고, CDN 규칙은 Next.js의 문서화되지 않은 파일 이름에 맞춰야 했다.

여기까지 오니 이런 생각이 들었다. 이렇게 쓸 거면 Next.js를 쓰는 의미가 있을까?

&nbsp;

## export에서 못 쓰는 것

`output: 'export'`는 빌드 결과를 HTML, JS, CSS 같은 정적 파일로만 내보내는 모드다. 런타임에 Next.js 서버가 없다.  
그래서 요청이 들어올 때 서버가 해야 하는 일은 모두 쓸 수 없다. [Static Exports 가이드](https://nextjs.org/docs/app/guides/static-exports#unsupported-features)가 꼽는 목록은 이렇다.

- `generateStaticParams()` 없는 동적 라우트, `dynamicParams: true`
- `cookies()` 같은 요청 시점 API
- 요청에 의존하는 Route Handler
- Server Actions
- ISR(시간이 지나면 페이지를 다시 만드는 기능)
- proxy(예전 middleware)
- `next.config`의 rewrites, redirects, headers
- 기본 loader를 쓰는 이미지 최적화 (`next/image` 컴포넌트는 custom loader를 지정하거나 `unoptimized`로 쓰면 된다)

Next.js를 고르는 이유로 자주 꼽히는 SSR, ISR, Server Actions가 다 이 목록에 있다.  
이것만 보면 Next.js를 쓸 이유가 거의 없어 보인다.

![](1.png)

&nbsp;

## 그래도 남는 것

서버 컴포넌트는 그대로 쓸 수 있다. 실행되는 시점이 요청할 때에서 빌드할 때로 바뀐다.  
[RSC Payload, 왜 필요한데?](https://www.jeong-min.com/92-rsc-payload/)에서 적었듯이, 정적 페이지의 서버 컴포넌트는 `next build`를 돌리는 빌드 환경에서 실행된다.  
빌드할 때 데이터를 가져와서 HTML과 RSC Payload로 만들어 두고, 서버 컴포넌트의 코드는 브라우저로 보내지 않는다.

경로마다 HTML도 미리 만들어진다. 가이드도 이 점을 static export의 장점으로 설명한다.

> By breaking a strict SPA into individual HTML files, Next.js can avoid loading unnecessary JavaScript code on the client-side, reducing the bundle size and enabling faster page loads.

SPA는 빈 `<div id="root">`에서 시작해서 JS가 도착해야 화면이 그려진다.  
static export는 경로마다 완성된 HTML이 있어서 JS가 오기 전에도 화면이 보이고, 검색 엔진도 내용을 읽을 수 있다.

그 밖에 App Router의 파일 기반 라우팅과 중첩 layout, `loading.js`와 `error.js`, `<Link>`의 prefetch와 Client Navigation, `next/font`와 Metadata API도 그대로 쓴다.  
나중에 서버가 필요해지면 `output: 'export'`만 빼고 서버 모드로 옮길 수도 있다. 가이드도 첫 문장에서 static export를 이렇게 소개한다.

> Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.

&nbsp;

## 빌드할 때 얼마나 그릴 수 있나

미리 만든 HTML과 빌드 때 실행되는 서버 컴포넌트는 페이지 내용을 빌드할 때 알 수 있어야 쓸모가 있다.

문서, 블로그, 마케팅 페이지처럼 내용이 빌드 때 정해지는 사이트라면 조건이 잘 맞는다.  
상품이나 게시글처럼 동적 경로가 있어도, 빌드할 때 전체 목록을 가져올 수 있으면 마찬가지다. 페이지마다 완성된 HTML이 생기고, 서버 컴포넌트가 할 일도 많다.

반대로 빌드할 때 목록을 다 알 수 없어서 placeholder 경로를 쓰기 시작하면 상황이 달라진다.  
placeholder 페이지의 HTML에는 실제 데이터가 없다. 화면에 보일 내용은 브라우저에서 URL을 읽고 API를 호출해야 채워진다.  
서버 컴포넌트가 빌드 때 그려둘 수 있는 것도 layout 같은 공통 부분 정도다.  
이때 Next.js로 얻는 건 주로 라우팅과 개발 경험이다. 첫 화면이 빨리 뜨거나 검색 엔진이 내용을 읽는 효과는 거의 없다.

반면 export를 쓰느라 드는 비용은 그대로다.  
[이전 글](https://www.jeong-min.com/93-static-export-rsc/)에서 본 것처럼 CDN 규칙을 Next.js의 내부 파일 규칙에 맞춰야 하고, 그 규칙은 16.0, 16.3 같은 버전에서 계속 바뀌었다.  
`useParams()`처럼 placeholder 값 때문에 기대와 다르게 동작하는 부분도 직접 챙겨야 한다.  
그러다 보면 URL에서 파라미터를 꺼내는 코드를 앱이 직접 갖게 되는데, 이 코드는 CDN의 rewrite 규칙과 같은 경로 규칙을 알아야 한다. 같은 규칙이 CDN과 앱 코드 두 곳에 생기는 셈이라, 라우트를 추가할 때마다 둘을 같이 고쳐야 한다.

&nbsp;

## placeholder가 늘어난다면

앱의 대부분이 placeholder 경로와 브라우저에서의 데이터 요청으로 이루어져 있다면, 서버를 두거나 SPA로 가는 쪽과 비교해 볼 만하다.

서버를 둘 수 있다면 Next.js를 서버 모드로 띄우면 된다.  
서버 모드에서는 요청이 올 때마다 URL의 실제 값으로 렌더링할 수 있어서 placeholder가 필요 없다. CDN이 파일 이름 규칙을 알 필요도 없어진다.  
대신 서버를 운영해야 한다. 요청이 없어도 서버 비용이 들고, 서버를 여러 대 두면 ISR 캐시를 서버끼리 공유할 저장소도 따로 챙겨야 한다.

Node 서버를 직접 운영하기 어렵다면 서버리스 환경에 올리는 방법도 있다. AWS라면 OpenNext 같은 도구가 이 역할을 한다.  
이때는 요청이 한동안 없다가 들어오면 서버를 띄우는 시간(cold start)만큼 응답이 늦어지고, 배포 도구가 Next.js 새 버전을 지원할 때까지 기다려야 할 수도 있다.

어차피 화면을 브라우저에서 그린다면 SPA로 가는 것도 방법이다.  
Vite와 React Router 같은 조합이 더 단순할 수 있다. 빌드 결과는 `index.html` 하나와 JS 파일들이고, CDN은 모든 경로를 `index.html`로 보내기만 하면 된다.  
대신 경로마다 미리 만든 HTML은 없다.

둘 다 어렵다면 static export를 계속 쓰되, Next.js를 올릴 때마다 `out/`의 파일과 CDN 규칙을 같이 확인하는 비용을 받아들이면 된다.  
어느 쪽이 맞는지는 인프라에서 서버를 둘 수 있는지, 첫 화면과 SEO가 얼마나 중요한지, 나중에 서버 기능을 쓸 계획이 있는지에 따라 다르다.

![](2.jpeg)

&nbsp;

## 마무리

static export에서 Next.js가 주는 건 빌드 때 실행되는 서버 컴포넌트, 경로마다 미리 만든 HTML, App Router, 그리고 나중에 서버 모드로 옮겨갈 수 있다는 가능성이다.  
이 중 앞의 두 가지는 페이지 내용을 빌드할 때 알 수 있어야 제값을 한다.

export로 Next.js를 쓸지는 페이지 중 빌드할 때 그릴 수 있는 부분이 얼마나 되는지를 보며 정하자. 새 라우트를 만들 때마다 placeholder부터 넣게 된다면, 그때는 서버 모드나 SPA와 한 번 비교해 보는 게 좋겠다.

```toc

```
