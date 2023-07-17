---
emoji: 🍦
title: '바닐라JS(TS)로 리액트 SPA 구현하기 | (2) 클래스로 컴포넌트 구현'
date: '2022-04-12'
categories: Dev React만들어보기
---

리액트 컴포넌트와 유사한 구조를 class로 만들어 봅시다!

&nbsp;

## 1. Component 구조

```ts
export interface PropsType {}
export interface StateType {}

export default class Component<P extends PropsType, S extends StateType> {
  target: Element;
  props: P;
  state: S;
  
  constructor() {} // 생성자
  
  setup() {}       // 기본적인 선언 및 할당
  template() {     // element 반환
    return ""
  }    
  render() {}
  mount() {}
  update() {}

  // 생명주기 메서드
  didMount() {}
  didUpdate() {}
  
  setState() {}    // state 업데이트
  
  // event 등록
  setEvent() {}    
  addEvent() {}
}
```

target으로는 해당 컴포넌트가 들어갈 Element를 받게 됩니다. 컴포넌트는 부모로부터 받은 props와 스스로 관리하는 state를 가집니다. 컴포넌트 생명주기와 관련된 메서드, 첫 렌더링과 이후 상태가 변경되었을 때의 리렌더링을 위한 메서드, 상태 업데이트와 이벤트 등록과 관련된 메서드를 적어주었습니다. template 메서드에서는 실제 엘리먼트를 그리게 됩니다. 기본값으로는 빈 스트링을 반환하도록 해주었습니다.

&nbsp;

## 2. Class 초기화

우선, 컴포넌트 객체가 인스턴스화될 때의 설정을 생성자에서 해주어야겠죠.

```ts
constructor(target: Element, props: P) {
  this.target = target;
  this.props = props;
  this.state = {} as S;
  this.setup();
  this.mount();
  this.setEvent();
}
```
컴포넌트가 들어갈 Element를 받아 등록하고, props도 받아서 등록해줍니다. state는 빈 객체를 할당합니다. setup 메서드에서는 state 초깃값 선언, api 호출 등 컴포넌트가 렌더링되기 전에 일어나야 할 일들을 처리하는 용도입니다. 그 후 컴포넌트를 마운트하고, 이벤트를 할당해주게 됩니다.

&nbsp;

## 3. 생명주기

리액트의 생명주기는 다음과 같습니다.

### 마운트 시
```ts
constructor()
static getDerivedStateFromProps()
render()
componentDidMount()
```
가 순서대로 호출됩니다.

### 업데이트 시

```ts
static getDerivedStateFromProps()
shoudComponentUpdate()
render()
componentDidUpdate()
```
가 순서대로 호출됩니다.

마운트에 해당하는 메서드를 mount(), 업데이트에 해당하는 메서드를 update()로 두었습니다.

```ts
render() {
  const template = this.template();
  if (template) {
    this.target.innerHTML = template;
  }
}
mount() {
  this.render();
  this.didMount();
}

update(): void {
  this.render();
  this.didUpdate();
}
```
render에서 innerHTML에 작성한 템플릿을 넣어주고, mount 내에서는 render 호출 후 didMount 호출을, update 내에서는 render 호출 후 didUpdate 호출을 하게 됩니다.

&nbsp;

## 4. 상태 업데이트

```ts
setState(newState: Partial<S>) {
  const nextState = { ...this.state, ...newState };
  if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
    return;
  }
  this.state = nextState;
  this.update();
}
```
컴포넌트 내 상태는 객체로 관리하게 됩니다. 변한 요소만 업데이트하고 다른 요소들은 그대로 가져갈 수 있게끔 nextState를 선언해줍시다. 그 후 상태가 정말로 바뀌었다면 state를 바꿔주고, update를 호출하게 됩니다.

&nbsp;

## 5. 이벤트 등록

```ts
addEvent(eventType: string, selector: string, callback: Function) {
  const children: Element[] = [...this.target.querySelectorAll(selector)];
  const isTarget = (target: Element) =>
    children.includes(target) || target.closest(selector);
  this.target.addEventListener(eventType, (event: any) => {
    if (!isTarget(event.target)) return false;
    callback(event);
  });
}
```
이벤트 타입(click, scroll 등)과 엘리먼트 요소, 콜백을 받습니다. 이벤트의 타겟이 요소와 일치하게 되면 콜백을 실행하게 됩니다.

&nbsp;

## 전체 코드

`/src/core/Component.ts`
```ts
export interface PropsType {}
export interface StateType {}

export default class Component<P extends PropsType, S extends StateType> {
  target: Element;
  props: P;
  state: S;

  constructor(target: Element, props: P) {
    this.target = target;
    this.props = props;
    this.state = {} as S;
    this.setup();
    this.mount();
    this.setEvent();
  }

  setup() {}
  template() {
    return "";
  }
  render() {
    const template = this.template();
    if (template) {
      this.target.innerHTML = template;
    }
  }
  mount() {
    this.render();
    this.didMount();
  }
  update(): void {
    this.render();
    this.didUpdate();
  }

  didMount() {}
  didUpdate() {}

  setState(newState: Partial<S>) {
    const nextState = { ...this.state, ...newState };
    if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
      return;
    }
    this.state = nextState;
    this.update();
  }

  setEvent() {}
  addEvent(eventType: string, selector: string, callback: Function) {
    const children: Element[] = [...this.target.querySelectorAll(selector)];
    const isTarget = (target: Element) =>
      children.includes(target) || target.closest(selector);
    this.target.addEventListener(eventType, (event: any) => {
      if (!isTarget(event.target)) return false;
      callback(event);
    });
  }
}
```

```toc
```