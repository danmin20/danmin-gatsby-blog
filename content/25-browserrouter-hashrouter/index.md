---
emoji: 🚪
title: 'BrowserRouter와 HashRouter, 뭐가 다를까? (feat. React Router)'
date: '2022-05-14'
categories: Dev
---

CRA로 리액트 프로젝트를 생성하면, 기본적으로 react-router-dom을 사용하게 됩니다. 이 react-router-dom은 두 가지 라우터를 제공합니다. 바로 BrowserRouter와 HashRouter죠.

이 두 개념은 react-router-dom에만 해당되는 이야기는 아닙니다. BrowserRouter는 HTML5의 history API를 사용한 방식이고, HashRouter는 URL의 hash를 사용한 방식입니다. 리액트를 사용하지 않고 직접 라우터를 직접 구현한다 하더라도, 우리는 이 방식 중 하나를 선택할 수 있습니다.

&nbsp;

## react-router

우선은 리액트 라우터에 대해 잠깐 살펴봅시다. SPA가 등장하기 전에는 어떻게 페이지를 이동시켰을까요? `<a href=""></a>`를 사용해서 직접 url을 변경시켰습니다. 하지만 이렇게 하면 모든 페이지를 reload하게 되므로 속도가 느려질 수밖에 없습니다. 리액트에서는 SPA라는 특성을 활용하여 라우터를 이용하여 변경된 소스만 바뀌도록 합니다.

&nbsp;

## BrowserRotuer

- HTML5의 history API를 활용한 라우터입니다.
- SSR에 적합합니다.
- 새로고침하거나 url로 직접 접근할 경우 경로를 찾지 못해 에러가 발생합니다.
- 이를 해결하려면 서버에 추가적인 세팅이 필요합니다.
- 따라서 배포가 좀 더 복잡합니다.

&nbsp;

## HashRouter

- URL의 hash를 활용한 라우터입니다.
- CSR에 적합합니다.
- 라우터에 #가 붙습니다.
- 해시를 사용하면 서버에 요청하지 않기 때문에 새로고침하거나 url로 직접 접근해도 에러가 발생하지 않습니다.
- 따라서 배포가 좀 더 간단합니다.
- 하지만 # 때문에 검색 엔진이 읽지 못하여 SEO가 좋지 않습니다.

페이지를 새로고침하게 되면, 브라우저가 현재 경로를 사용하여 서버에 GET 요청을 보내게 됩니다. #은 GET 요청을 보내지 못하도록하는 데 사용되었습니다. 이로 인해 두 라우터 사이에는 큰 차이가 있습니다.

따로 서버가 존재하고, SEO 최적화가 필요한 대규모 프로젝트에는 BrowserRouter를, 개인적으로 간단하게 프로젝트를 진행할 경우에는 HashRouter를 사용하면 적합할 것 같습니다.

```toc
```