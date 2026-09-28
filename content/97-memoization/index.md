---
emoji: 📝
title: 'useMemo와 useCallback은 언제 의미가 있을까?'
date: '2026-09-28'
categories: Dev
---

> useMemo와 useCallback으로 감싸면, 실제로 무엇이 덜 실행될까?

&nbsp;

이런 코드 리뷰, 다들 받아본 적 있을 것이다.

>"이 함수 렌더링마다 새로 만들어지니까 `useCallback`으로 감싸 주세요."  

그런데 `useCallback`으로 감싸도, `useCallback`에 넘기는 화살표 함수 자체는 렌더링마다 새로 만들어진다. 그래서 이 코멘트대로 감쌌을 때 실제로 무엇이 달라지는지 궁금해졌다.

상품 목록에 좋아요 버튼을 붙이는 예제 하나로 `React.memo`, `useMemo`, `useCallback`이 각각 무엇을 줄이는지 한번 살펴 보자.

> React 19.3.0과 React Compiler 1.0.0으로 확인했다. 렌더 횟수는 jsdom에서 컴포넌트 함수가 몇 번 실행됐는지를 세었고, 목록의 상품은 5개다.  
> 세는 방법은 Babel로 컴파일한 결과에 함수마다 첫 줄에 실행 횟수를 올리는 코드를 넣는 플러그인을 한 번 더 돌리는 것이다. Compiler를 켠 경우에도 카운터는 컴파일이 끝난 뒤에 들어가서 Compiler의 판단에 영향을 주지 않는다.

&nbsp;

## 부모가 리렌더링되면 무엇이 다시 실행되나

상품 목록 페이지에 필터 패널을 여닫는 버튼이 있다고 해보자.

```tsx
function ProductPage({ products }: { products: Product[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const handleLike = (id: string) => likeProduct(id)

  return (
    <>
      <button onClick={() => setIsFilterOpen((open) => !open)}>필터</button>
      {isFilterOpen && <FilterPanel />}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onLike={() => handleLike(product.id)} />
      ))}
    </>
  )
}
```

필터 버튼을 누르면 `ProductPage`가 리렌더링되고, 상품과 아무 상관 없는 state가 바뀌었는데도 `ProductCard` 5개가 모두 리렌더링된다. 부모가 리렌더링되면서 `<ProductCard ... />`를 새로 만들었고, React는 새로 만든 element를 받은 자식을 기본적으로 리렌더링하기 때문이다.

> 여기서 "리렌더링된다"는 컴포넌트 함수가 다시 실행된다는 뜻이다. 화면이 다시 그려진다는 뜻과는 다르다. React는 렌더링 결과를 이전 결과와 비교해서 [달라진 DOM 노드만 바꾼다](https://react.dev/learn/render-and-commit). 카드 5개가 리렌더링돼도 내용이 같으면 DOM은 그대로다.   
> 그래서 렌더링 횟수가 많다고 무조건 느린 건 아니다. 카드 렌더링이 가볍다면 5번이든 50번이든 사용자가 느끼지 못할 수 있다.

![](0.webp)

&nbsp;

### children으로 받은 트리는 리렌더링되지 않는다

그런데 부모가 리렌더링되어도 리렌더링되지 않는 자식도 있다.  
필터 패널의 열림 상태를 감싸는 컴포넌트로 옮기고, 목록은 `children`으로 넘겨 보자.

```tsx
function FilterLayout({ children }: { children: ReactNode }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  return (
    <section>
      <button onClick={() => setIsFilterOpen((open) => !open)}>필터</button>
      {isFilterOpen && <FilterPanel />}
      {children}
    </section>
  )
}

<FilterLayout>
  <ProductGrid products={products} />
</FilterLayout>
```

`<ProductGrid products={products} />` element는 `FilterLayout`의 바깥에서 만들어졌다. `FilterLayout`이 리렌더링돼도 같은 element 객체를 그대로 넘기니, React는 [props 객체가 이전과 같은 걸 보고](https://github.com/facebook/react/blob/1d34f91dfde6bba84d08b683aaba164c7194dacb/packages/react-reconciler/src/ReactFiberBeginWork.js#L4250-L4280) `ProductGrid`를 건너뛴다.  

[`useMemo` 문서](https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere)도 memo를 덜 쓰는 방법으로 이 방법을 가장 먼저 든다. 필터 열림 state처럼 몇 군데서만 쓰는 state는 그걸 쓰는 컴포넌트 안에 두고, 상품 목록처럼 그 state와 관계없는 부분은 바깥에서 `children`으로 넘기자.

&nbsp;

## React.memo의 효과

카드를 `memo`로 감싸 보자. props가 같으니 카드를 리렌더링하지 않겠지?

```tsx
const MemoizedProductCard = memo(ProductCard)

<MemoizedProductCard key={product.id} product={product} onLike={() => handleLike(product.id)} />
```

하지만 필터 버튼을 눌러 보면 카드는 여전히 5개 모두 리렌더링된다.  

`memo`는 이전 props와 새 props를 prop마다 [`Object.is`로 비교](https://github.com/facebook/react/blob/1d34f91dfde6bba84d08b683aaba164c7194dacb/packages/shared/shallowEqual.js)한다. `product`는 부모가 받은 배열의 같은 객체라 통과하지만, `onLike`에 넘긴 화살표 함수는 부모가 리렌더링될 때마다 새로 만들어진다. 내용이 똑같아도 `Object.is`로는 다른 함수다.

이렇게 렌더링이 달라져도 같은 객체, 같은 함수를 넘기는 걸 "참조를 유지한다"고 한다. `memo`가 리렌더링을 건너뛰려면 모든 prop의 참조가 유지돼야 하고, 하나라도 매번 새로 만들어지면 `memo`를 붙인 효과가 사라진다.

> `memo`가 막는 건 props 때문에 생기는 렌더링이다. 카드가 자기 state를 바꾸거나 쓰고 있는 context가 바뀌면 `memo`와 상관없이 리렌더링된다. [문서](https://react.dev/reference/react/memo)도 memo를 "performance optimization, not a guarantee"라고 말하고 있다.

&nbsp;

## useCallback의 효과

`onLike`의 참조를 유지하려면 함수를 `useCallback`으로 감싸야 한다. 반복문 안에서 `useCallback`을 부를 수는 없으니 카드가 `id`를 받아 호출하도록 모양을 바꿔보자.

```tsx
function ProductCard({ product, onLike }: { product: Product; onLike: (id: string) => void }) {
  return <button onClick={() => onLike(product.id)}>{product.liked ? '♥' : '♡'}</button>
}

// ProductPage
const handleLike = useCallback((id: string) => likeProduct(id), [])

<MemoizedProductCard key={product.id} product={product} onLike={handleLike} />
```

`useCallback`에 넘긴 화살표 함수도 렌더링마다 새로 만들어진다. [문서](https://react.dev/reference/react/useCallback#should-you-add-usecallback-everywhere)도 "`useCallback` does not prevent *creating* the function"이라고 말하고 있다. [소스](https://github.com/facebook/react/blob/1d34f91dfde6bba84d08b683aaba164c7194dacb/packages/react-reconciler/src/ReactFiberHooks.js#L2930-L2942)를 보면 새로 만든 함수를 인자로 받고, dependency가 이전과 같으면 그 함수 대신 저장해 둔 이전 함수를 돌려준다.  

`useCallback`을 쓴다고 함수 생성이 줄지는 않는다. 줄어드는 건 `onLike`의 참조가 유지돼서 건너뛰게 된 `MemoizedProductCard` 5개의 렌더링이다.

&nbsp;

받는 쪽이 `memo`되지 않은 컴포넌트라면 어떨까?

```tsx
const handleClick = useCallback(() => setCount((count) => count + 1), [])

return <Button onClick={handleClick} />
```

`Button`은 부모가 리렌더링될 때마다 어차피 리렌더링되고, `handleClick`을 dependency로 쓰는 hook도 없다. 참조를 유지해도 그 참조를 비교하는 곳이 없어서, 이 `useCallback`은 아무것도 줄이지 못한다.  

문서도 이런 경우를 "no benefit"이라고 한다. 하지만 동시에 "no significant harm"이라고도 하면서, 그래서 팀에 따라서는 일일이 따지지 않고 다 감싸기도 한다고 적어 두었다. dependency 배열을 만들어 비교하고 이전 함수를 보관하는 비용이 있긴 하지만 작다.

&nbsp;

`useCallback`을 사용할 때 신경 써야 할 부분은 dependency를 맞추는 일이다. 만약 상품 상세 컴포넌트에서 `useCallback(() => likeProduct(product.id), [])`처럼 dependency를 빠뜨린다면, `product` prop이 다른 상품으로 바뀌어도 함수는 처음 상품의 `id`를 계속 들고 있어서 엉뚱한 상품에 좋아요가 눌린다. `react-hooks/exhaustive-deps` lint가 이런 실수를 잡아 주긴 하지만, 감쌀 때마다 dependency를 맞춰야 한다는 부담은 남는다.

![](1.jpg)

&nbsp;

> `useCallback`이 memo된 자식과 effect dependency에서 필요한 이유는 [객체지향 vs 함수형? 싸울 일이 아닙니다](https://www.jeong-min.com/88-programming-paradigms/)에서도 다뤘다.

&nbsp;

## useMemo의 효과

[문서](https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere)에서는 `useMemo`의 쓰임을 세 가지로 설명하고 있다.

&nbsp;

### 1. 계산 결과 유지

장바구니에 상품이 아주 많고, 페이지가 다른 state 때문에 자주 리렌더링된다고 해보자.

```tsx
const totalPrice = useMemo(
  () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [cartItems],
)
```

`cartItems`의 참조가 그대로라면 `reduce`는 다시 돌지 않는다. `useMemo`가 없다면 렌더링마다 전체 상품을 다시 더하게 된다.  

다만 이 계산이 정말 느린지는 재 봐야 안다. [문서](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive)는 `console.time`으로 재서 합이 1ms 이상일 때 memo를 고려해 보라고 한다.
> 개발 모드의 Strict Mode에서는 계산 함수가 두 번 실행되니 production 빌드로 재야 한다.

&nbsp;

### 2. 참조 유지

그런데 계산이 싼데도 `useMemo`로 감싸야 하는 경우가 있다. 검색어와 카테고리로 거른 목록을 memo된 목록 컴포넌트에 넘겨 보자.

```tsx
const visibleProducts = useMemo(
  () => products.filter((p) => matches(p, keyword, category)).sort(byPopularity),
  [products, keyword, category],
)

return <MemoizedProductList products={visibleProducts} />
```

`filter`는 조건에 맞는 상품이 똑같아도 매번 새 배열을 만든다. `useMemo`가 없으면 필터 버튼만 눌러도 `visibleProducts`가 새 배열이 되고, `MemoizedProductList`는 props가 바뀌었다고 보고 리렌더링된다.  

`useMemo`로 감싸면 `products`, `keyword`, `category`가 그대로인 동안 같은 배열이 넘어가서, 필터 버튼을 눌러도 `MemoizedProductList`는 리렌더링되지 않는다. 상품이 몇 개 안 돼서 `filter` 계산이 아주 싸더라도, 목록 전체의 리렌더링을 막으려면 `useMemo`가 필요하다.

&nbsp;

### 3. dependency 유지

같은 `visibleProducts`를 effect에서도 쓴다고 해보자. 목록이 바뀔 때마다 노출된 상품을 로그로 보낸다.

```tsx
useEffect(() => {
  logImpressions(visibleProducts.map((p) => p.id))
}, [visibleProducts])
```

`visibleProducts`를 `useMemo`로 감싸지 않으면 렌더링마다 새 배열이라, 필터 버튼만 눌러도 effect가 다시 돌면서 같은 노출 로그를 또 보낸다. `useMemo`로 감싸야 `products`, `keyword`, `category`가 바뀔 때만 effect가 돈다.  
하는 일은 2번과 같은 참조 유지다. 참조를 비교하는 쪽이 `memo`가 아니라 dependency 배열인 것만 다르다.

&nbsp;

### 유지하는 게 없을 수도 있다

받는 쪽이 memo되지 않은 `ProductList`이고 `visibleProducts`를 dependency로 쓰는 hook도 없다면, 같은 배열을 넘겨도 목록은 어차피 리렌더링된다. 이때 `useMemo`에 남는 효과는 `filter`와 `sort`를 다시 하지 않는 것 하나라서, 상품이 몇 개 안 돼 계산이 싸다면 감싸도 달라지는 게 거의 없다. 상품이 많아 계산이 무겁다면 앞의 합계처럼 계산 때문에 감쌀 수는 있다.

&nbsp;

## dependency가 매번 새로 만들어질 때

검색 조건을 객체로 묶어서 넘기는 코드를 종종 본다.

```tsx
const searchOptions = { keyword, category }

const visibleProducts = useMemo(
  () => filterAndSort(products, searchOptions),
  [products, searchOptions],
)
```

`useMemo`를 붙였는데도 필터 버튼을 누를 때마다 `filterAndSort`가 다시 실행된다. `searchOptions`는 렌더링마다 새로 만든 객체라, dependency를 `Object.is`로 비교하면 매번 다르기 때문이다.

고치려면 이렇게 할 수 있다.

```tsx
// A. dependency 객체도 useMemo로 감싼다
const searchOptions = useMemo(() => ({ keyword, category }), [keyword, category])

// B. 객체를 useMemo 안에서 만들고, dependency에는 원시 값만 둔다
const visibleProducts = useMemo(
  () => filterAndSort(products, { keyword, category }),
  [products, keyword, category],
)
```

둘 다 동작은 한다. 그런데 A는 memo가 깨지지 않게 memo를 하나 더 쌓는 구조라, 나중에 누군가 `searchOptions`에 필드를 하나 더하면서 dependency를 빠뜨리면 깨질 위험이 있다.  

B는 dependency가 문자열 두 개와 배열 하나라, 무엇이 바뀌면 다시 계산되는지가 한눈에 보인다. B로 바꾸면 필터 버튼을 눌러도 다시 계산하지 않는다. 그러니 객체를 dependency로 넘기고 있다면, 먼저 그 객체를 안에서 만들 수 있는지 보자.

&nbsp;

## 계산 결과를 state에 담지 말자

장바구니 합계를 state에 담는 코드도 자주 만난다.

```tsx
const [totalPrice, setTotalPrice] = useState(0)

useEffect(() => {
  setTotalPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))
}, [cartItems])
```

`cartItems`가 바뀌면 React는 먼저 예전 `totalPrice`로 렌더링하고, 그 뒤에 effect가 돌면서 `setTotalPrice`를 불러 리렌더링한다. 결국 렌더링이 한 번 더 일어나면서 그 사이에 화면에 예전 합계가 잠깐 보일 수도 있다.  

[문서](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)는 props나 state로 계산할 수 있는 값은 state에 담지 말고 렌더링 중에 계산하라고 한다.

```tsx
const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

만약 계산이 느리다면, 그때 `useMemo`로 감싸면 된다.

```tsx
const totalPrice = useMemo(
  () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [cartItems],
)
```

state 버전에서는 `totalPrice`가 `cartItems`와 따로 저장된 값이라, 둘이 어긋날 수 있다. `useMemo` 버전에서는 값의 기준이 `cartItems` 하나뿐이고, `useMemo`는 그 계산 결과를 잠깐 저장해 두는 캐시일 뿐이다.  

> [문서](https://react.dev/reference/react/useMemo#caveats)는 React가 특별한 이유가 있으면 이 캐시를 버릴 수 있다고 말한다. 캐시가 버려져도 `cartItems`로 다시 계산하면 같은 값이 나오니 문제가 없다. 만약 버려지면 안 되는 값이라면 `useMemo`가 아니라 state나 ref에 둬야 한다.

> 계산할 수 있는 값을 state에 담지 않는 이야기는 [프론트엔드의 상태는 어디에 살아야 할까?](https://www.jeong-min.com/95-state-ownership/)에서도 다뤘다.

&nbsp;

## 좋아요 하나만 바뀌었을 때

이제 좋아요를 눌러 보자. 목록은 이렇게 바꾼다.

```ts
setProducts((old) => old.map((p) => (p.id === targetId ? { ...p, liked } : p)))
```

배열은 새 배열이고, 좋아요를 누른 상품은 새 객체지만, 나머지 4개는 이전 객체 그대로다. 이렇게 안 바뀐 부분의 참조를 그대로 두는 걸 structural sharing이라고 한다.

참조가 유지됐으니 나머지 4개 카드는 알아서 건너뛸까? 세 가지 경우를 비교해 보자.

&nbsp;

`memo`가 없으면 참조가 유지돼도 카드 5개가 모두 리렌더링된다. 부모가 리렌더링되면서 카드 element를 새로 만드는데, 카드에 `memo`가 없으면 props의 참조가 같은지 확인하지 않고 그대로 리렌더링한다.  

`memo`를 붙였어도 `onLike`를 inline으로 넘기면 5개 모두 리렌더링된다. `product`가 같아도 `onLike`가 매번 달라서 비교에서 걸리기 때문이다.

`memo`를 붙이고 `onLike`도 안정적이면 좋아요를 누른 카드 하나만 리렌더링된다. 나머지 4개는 `product`와 `onLike`가 모두 이전과 같기 때문이다.  


&nbsp;

structural sharing이 하는 일은 안 바뀐 상품의 참조를 그대로 두는 것까지다. 그 참조를 비교해서 렌더링을 건너뛰는 건 `memo`가 한다. 그리고 `map`으로 바꿀 상품을 찾는 비용은 참조를 유지해도 그대로 남는다.

> TanStack Query도 응답을 받을 때 [structural sharing](https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations#structural-sharing)으로 "as many references as possible"을 유지한다. JSON으로 표현할 수 있는 데이터에서만 동작하고, 모든 참조를 항상 보존하지는 않는다.

&nbsp;

## 언제 사용할까

"일단 `useMemo`, `useCallback`을 쓰고 본다"는 방식은 편하다. 문서도 이 방식을 크게 해롭다고 보지는 않는다. 하지만 [문서](https://react.dev/reference/react/useCallback#should-you-add-usecallback-everywhere)가 짚듯 "a single value that's 'always new' is enough to break memoization for an entire component"라서, 여기저기 감싸 둬도 inline 함수 하나 때문에 아무것도 건너뛰지 않는 경우에는 코드만 길어질 뿐, 최적화는 전혀 되지 않는다.

그러니 아래의 순서로 확인해 보자.

1. 먼저 정말 느린 상호작용이 있는지 본다. React DevTools Profiler로 필터 버튼을 눌렀을 때 어떤 컴포넌트가 오래 걸리는지 확인한다. 느리지 않다면 굳이 memo를 사용하지 않는다.

2. 느린 곳이 있다면 무엇이 느린지 나눈다. 렌더링 중의 계산이 느리면 `useMemo`로 계산을 다시 하지 않게 한다. 자식 컴포넌트의 렌더링이 느리면 자식을 `memo`로 감싸고, 그 자식에 넘기는 객체와 함수의 참조를 `useMemo`, `useCallback`으로 유지한다. 네트워크나 레이아웃이 느린 거라면 memo로는 해결되지 않는다.

3. props가 매번 새 참조라면, memo로 감싸기 전에 왜 새로 만들어지는지부터 본다. 객체 dependency는 원시 값으로 풀 수 있고, 목록의 inline 함수는 카드가 `id`를 받게 바꿀 수 있다. 필터 패널처럼 한 곳에서만 쓰는 state는 그 컴포넌트 안으로 내리고, 나머지는 `children`으로 넘기면 memo 없이도 리렌더링되지 않는다.

4. 적용 후에는 Profiler로 다시 재서 실제로 효과가 있는지 확인한다. 효과가 없다면 어딘가에서 매번 새 참조가 들어오고 있다는 뜻이다.

&nbsp;

## React Compiler 이후

여기까지 따라오면 memo를 어디에 붙이고 어디에 안 붙일지 매번 따지는 게 꽤 피곤한 일이라는 걸 알게 된다.  
그런데 이제는 이걸 크게 신경 쓰지 않아도 될지도 모른다. [React Compiler](https://react.dev/learn/react-compiler/introduction)가 나왔기 때문이다.  

[2025년 10월에 1.0](https://react.dev/blog/2025/10/07/react-compiler-1)이 나왔고, 빌드할 때 컴포넌트와 hook 안의 값, 함수, JSX를 자동으로 memo해 준다. React 19에 맞춰 만들었지만 17과 18도 지원한다.  

> 이름은 컴파일러지만 JavaScript 엔진에 뭔가 추가된 건 아니고, `babel-plugin-react-compiler`라는 Babel 플러그인이다. 기존 빌드 과정에 한 단계로 끼워 넣으면 컴포넌트 코드를 분석해서 캐시 코드가 들어간 JavaScript를 내놓는다. 출력 코드가 쓰는 `_c`는 React 19의 `react/compiler-runtime`에 있고, 17과 18에서는 `react-compiler-runtime` 패키지가 그 자리를 채운다.  

> ~~짭파일러~~

&nbsp;

위의 `ProductCard`를 컴파일하면 이런 코드가 나온다.

```js
function ProductCard(t0) {
  const $ = _c(7)
  const { product, onLike } = t0
  let t1
  if ($[1] !== onLike || $[2] !== product.id) {
    t1 = () => onLike(product.id)
    $[1] = onLike
    $[2] = product.id
    $[3] = t1
  } else {
    t1 = $[3]
  }
  // 버튼 JSX도 같은 방식으로 캐시한다
}
```

`$`는 컴포넌트 인스턴스마다 하나씩 붙는 캐시 배열이다. 사용한 값이 이전과 같으면 이전에 만든 함수와 JSX를 다시 쓴다. 손으로 쓰던 `useCallback`, `useMemo`를 값마다 넣어 준 것과 비슷하다. (위 코드는 실제 출력에서 캐시 초기화 부분을 줄인 것이다.)

같은 예제를 Compiler를 켜고 다시 돌려 보면 이렇다. 숫자는 카드 함수가 실행된 횟수고, 객체 dependency 행만 `filterAndSort`가 실행된 횟수다.

| 상황 | Compiler 없음 | Compiler 1.0 |
| - | - | - |
| memo 없음, 필터 버튼 | 5 | 0 |
| memo + inline onLike, 필터 버튼 | 5 | 0 |
| 객체 dependency, 필터 버튼 | 1 | 0 |
| memo 없음, 상품 1개 좋아요 | 5 | 5 |
| memo + 안정된 onLike, 상품 1개 좋아요 | 1 | 1 |
| memo + inline onLike, 상품 1개 좋아요 | 5 | 5 |

필터 버튼처럼 목록과 상관없는 state가 바뀌는 경우에는 `memo`나 `useCallback` 없이도 카드가 리렌더링되지 않는다. Compiler가 `products.map(...)`의 결과 전체를 `products`가 같을 때 다시 쓰기 때문이다. `handleLike`는 `setProducts`만 쓰는 함수라 한 번 만든 걸 계속 쓰고, 캐시 조건에도 들어가지 않는다.

그런데 상품 하나만 바뀌는 경우는 다르다. `products`가 새 배열이 되면 Compiler는 `map`을 처음부터 다시 돌리고, 항목마다 만든 JSX는 따로 캐시하지 않는다. 그래서 카드 함수 5개가 모두 다시 실행된다. 그렇더라도 안 바뀐 카드 4개는 `product`와 `onLike`가 이전과 같으니, 앞에서 본 컴파일 결과대로 `$`에 저장해 둔 `onClick` 함수와 버튼 JSX를 그대로 돌려주고 끝난다.

카드 함수가 아예 실행되지 않은 건 `memo(ProductCard)`를 직접 붙인 경우였다. 표에서 좋아요를 눌렀을 때 1이 나온 행이다.

[memo 문서](https://react.dev/reference/react/memo#react-compiler-memo)는 Compiler를 쓰면 `React.memo`를 지워도 된다고 하지만, 이번 예제처럼 목록에서 항목 한두 개가 자주 바뀌는 화면이라면 Profiler로 한번 확인해 보자.

&nbsp;

Compiler가 모든 컴포넌트를 컴파일해 주는 것은 아니다. 렌더 횟수를 세려고 컴포넌트 안에서 모듈 변수를 1씩 올려 봤더니, Compiler는 렌더링 중에 바깥 변수를 바꾸는 이 코드를 [Rules of React](https://react.dev/reference/rules) 위반으로 보고 그 컴포넌트는 컴파일하지 않았다.
> 에러도 경고도 내지 않기 때문에, 컴파일된 파일을 열어 `_c(` 호출 여부를 직접 확인하지 않는 이상 알 수 없다. 건너뛰어진 컴포넌트가 있어도 주변 컴포넌트의 캐시 덕에 화면에서는 티가 안 날 수 있으니, 코드를 보고 알아채기도 어렵다.

> `eslint-plugin-react-hooks` 7 이상의 `recommended` 설정에 Compiler 기반 lint 규칙이 들어 있으니, Compiler를 켰다면 lint도 같이 켜 두자. (6.1까지는 `recommended-latest`에만 있었고, [공식 installation 페이지](https://react.dev/learn/react-compiler/installation)는 아직 `recommended-latest`를 쓰라고 적혀 있다.)

&nbsp;

Compiler를 켠다면 기존 `useMemo`, `useCallback`은 어떻게 할까? [Compiler 문서](https://react.dev/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo)는 새 코드에서는 Compiler에 맡기고, 필요한 곳에서만 `useMemo`/`useCallback`으로 직접 제어하라고 한다. 대표적인 경우가 effect dependency로 쓰는 값이다. 기존 코드의 memo는 그대로 두거나, 지운다면 꼼꼼히 테스트하라고 한다. 지우면 컴파일 결과가 달라질 수 있기 때문이다.
> memo를 뺐을 때 동작까지 달라진다면 그 원인부터 고쳐야 한다. Compiler가 있든 없든 `useMemo`, `useCallback`은 성능을 위한 도구다.

&nbsp;

## 마무리

메모이제이션은 입력이 같으면 이전 렌더에서 만든 값을 다시 쓰게 한다. 그 덕분에 계산을 다시 하지 않아도 되고, 그 값을 prop으로 받는 memo된 자식이나 dependency로 둔 hook도 다시 실행되지 않는다. 둘 다 아니라면 memo를 붙여도 다시 실행되는 건 그대로다.

코드 리뷰를 하는데 `useMemo`, `useCallback`이 보인다면 아래 질문들을 한번 검토해보자.

- 이 값이나 함수를 비교하는 쪽이 있는가? memo된 자식의 prop인가, 다른 hook의 dependency인가?
- 비교하는 쪽이 없다면, 계산 자체가 재 봤을 때 느린가?
- 이 memo를 빼면 정확히 무엇이 다시 실행되는가?
- 매번 새 참조가 만들어진다면, 그걸 만들지 않게 구조를 바꿀 수 있는가?
- memo를 빼면 동작이 달라지는가?
- Compiler를 쓴다면, 이 컴포넌트가 실제로 컴파일되고 있는가?

```toc

```
