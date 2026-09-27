---
emoji: 🏘️
title: '프론트엔드의 상태는 어디에 살아야 할까?'
date: '2026-09-27'
categories: Dev
---

> useState 하나로 시작한 검색어는 어쩌다 URL과 캐시와 history에 나눠 살게 됐을까?

&nbsp;

상품 검색 페이지를 만든다고 해보자.  
검색어를 입력하고, 카테고리를 고르고, 목록에서 좋아요를 누를 수 있는 평범한 화면이다.

```tsx
function ProductSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('all')

  const { data: products = [], refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(keyword),
  })

  const visibleProducts = category === 'all' ? products : products.filter((p) => p.category === category)

  const handleLike = async (id: string, liked: boolean) => {
    await putLike(id, liked)
    refetch()
  }

  // 검색 버튼을 누르면 refetch()
}
```

keyword와 category는 이 컴포넌트에서만 쓰니 `useState`에 두었다.  
카테고리로 거른 목록은 `products`와 `category`로 계산할 수 있어서 state에 담지 않고 렌더링할 때 계산했다([Avoid redundant state](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state)).  
좋아요는 API를 부른 뒤 목록을 다시 받아온다.

처음에는 이 코드가 별로 이상해 보이지 않았다. 검색도 되고, 필터도 되고, 좋아요도 눌린다.  
그런데 요구사항이 하나씩 붙기 시작했다.

1. 상세 페이지에 갔다가 돌아와도 검색 조건이 유지되어야 한다.
2. URL을 공유하면 같은 검색 결과가 보여야 한다.
3. 검색어는 입력을 멈추고 300ms가 지나면 자동으로 검색된다.
4. 카테고리는 고르는 즉시 반영된다.
5. 검색 조건마다 서버 응답을 캐싱한다.
6. 좋아요는 서버 응답을 기다리지 않고 먼저 화면에 반영된다.
7. 브라우저 뒤로가기가 자연스럽게 동작해야 한다.

하나씩 반영하다 보니, 처음에는 모두 `useState`였던 값들이 서로 다른 곳에 살게 됐다. 바뀌는 시점과 사라지는 시점도 달라졌다.

![](0.jpg)

> 코드는 React Router의 `useSearchParams`와 TanStack Query v5를 기준으로 썼다. Next.js App Router에서 달라지는 부분은 따로 적었다.

&nbsp;

## 상세에 갔다 오면 사라지는 검색 조건

첫 번째 요구사항에서 문제가 드러났다.  
검색 결과에서 상품을 눌러 상세 페이지에 갔다가 뒤로 돌아오면, 검색어와 카테고리가 초기값으로 돌아가 있다.

목록 페이지가 unmount되면서 컴포넌트의 state도 같이 사라졌기 때문이다.  
그렇다면 keyword와 category는 정말 이 컴포넌트의 state여야 할까?

"여러 컴포넌트가 쓰는가"로는 답이 안 나온다. keyword는 여전히 이 페이지에서만 쓴다.  
대신 이 값에 이런 질문을 던져볼 수 있다.

- 새로고침해도 같은 화면이어야 하는가?
- URL을 공유했을 때 같은 화면이 보여야 하는가?
- 뒤로가기로 돌아왔을 때 복원되어야 하는가?

새로고침과 뒤로가기는 다른 방법으로도 풀 수 있다.  
값을 sessionStorage에 두면 같은 탭에서는 새로고침해도 남고, 목록을 unmount하지 않는 구조로 바꾸면 뒤로가기로 돌아와도 남는다.  
하지만 URL을 공유했을 때도 같은 화면이 보여야 한다면 둘 다 부족하다.  
다른 사람의 브라우저에서 같은 화면을 다시 만들려면, 그 값은 URL에 들어 있어야 한다.

keyword와 category는 "무엇을 보고 있는가"를 정하는 값이다.  
`/products?keyword=react&category=books`라는 주소 자체가 지금 화면이 무엇인지 설명한다.  
그러니 keyword와 category를 URL로 옮기자.

```tsx
const [searchParams, setSearchParams] = useSearchParams()

const keyword = searchParams.get('keyword') ?? ''
const category = searchParams.get('category') ?? 'all' // 뒤에서 다시 본다
```

모든 조건을 URL에 넣어야 하는 건 아니다.  
예를 들어 목록을 그리드로 볼지 리스트로 볼지 같은 설정은 "내가 보기 편한 방식"이다.  
공유받은 사람이 내 보기 방식까지 따라야 할 이유는 없고, 뒤로가기로 되돌릴 대상도 아니다.  
이런 값은 컴포넌트 state나 localStorage에 두면 된다.  
어떤 값을 URL에 넣을지는 그 값이 이 화면의 주소를 구성하는 일부인지를 보고 결정하자.

&nbsp;

## 입력 중인 값과 적용된 값

세 번째 요구사항은 입력을 멈추고 300ms가 지나면 자동으로 검색하는 것이다.

keyword는 이제 URL에 있고, URL이 바뀌면 검색 요청이 나간다.  
입력할 때마다 URL을 바꾸면 한 글자마다 요청이 나간다.  
input이 입력 중인 값을 따로 들고 있다가, 300ms가 지나면 URL에 반영하도록 하자.  
그러면 keyword는 input이 들고 있는 값과 URL의 값, 두 개가 된다.

```tsx
function SearchInput({ keyword, onCommit }: { keyword: string; onCommit: (value: string) => void }) {
  const [draft, setDraft] = useState(keyword)
  const commit = useDebouncedCallback(onCommit, 300) // 예: use-debounce 라이브러리

  return (
    <input
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value)
        commit(e.target.value)
      }}
    />
  )
}
```

> debounce 자체는 [이벤트 멈춰! Debounce와 Throttle](https://www.jeong-min.com/45-debounce-throttle/)에서 다뤘다.

&nbsp;

사용자가 "react"를 치는 도중이라면, 두 값은 이렇게 달라질 수 있다.

```text
input의 draft   = "reac"   ← 아직 입력 중
URL의 keyword   = "rea"    ← 마지막으로 입력을 멈췄을 때 반영된 검색 조건
```

React는 같은 값을 두 state에 나눠 들고 있지 말라고 하는데, 이건 괜찮은 걸까?

두 값은 문자열로는 비슷하지만 가리키는 게 다르다. draft는 사용자가 아직 확정하지 않은 입력이다.  
input이 들고 있고, 키를 누를 때마다 바뀌고, 페이지를 떠나면 사라져도 된다.  
URL의 keyword는 적용된 검색 조건이다. 이 값으로 서버에 요청하고, 공유하고, 새로고침해도 남는다.

> 만약 URL의 keyword를 `useState(searchParams.get('keyword'))`로 한 번 더 복사해 두었다면 그건 진짜 중복이다. URL과 같은 것을 가리키고, 같은 시점에 바뀌어야 하는 값이라 또 둘을 맞춰야 한다.  

다만 둘을 같이 두면, URL이 input 바깥에서 바뀌는 경우도 생각해야 한다.  
뒤로가기로 이전 검색으로 돌아가거나 다른 곳의 링크로 `?keyword=vue`에 들어오면  
URL의 keyword는 바뀌는데 draft는 예전 값에 남는다.  
화면에는 "vue" 결과가 보이는데 입력창에는 "react"가 적혀 있는 상태가 된다.  
그러니 URL이 input 바깥에서 바뀌면 draft도 새 keyword로 맞춰주자.

&nbsp;

`useState(keyword)`는 처음 렌더링할 때만 keyword를 읽어서, 그냥 두면 draft가 따라 바뀌지 않는다.

> React 문서가 [Don't mirror props in state](https://react.dev/learn/choosing-the-state-structure#dont-mirror-props-in-state)에서 경고하는 상황이 이거다.

prop이 바뀔 때 state를 처음부터 다시 시작하게 하는 흔한 방법은 `key`다([Resetting state with a key](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)).

```tsx
<SearchInput key={keyword} keyword={keyword} onCommit={commitKeyword} />
```

React는 `key`가 바뀌면 다른 컴포넌트로 보고, 기존 `SearchInput`을 버린 뒤 새로 만든다.  
새로 만들어지니 `useState(keyword)`도 다시 실행돼서 draft가 새 keyword로 시작한다.  
그런데 이러면 내가 입력한 값이 URL에 반영될 때도 input이 새로 만들어진다.  
입력하던 `<input>`이 통째로 바뀌니 포커스와 커서 위치가 사라진다.

&nbsp;

`SearchInput`은 렌더링하면서 이전 keyword와 비교하고, keyword가 바뀌었는데 draft와 다를 때만 draft를 바꾸도록 해보자.  
> React 문서의 [Adjusting some state when a prop changes](https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)에 나오는 방법이다.  
> 문서는 대부분의 컴포넌트에는 이 방법이 필요 없다고 한다. `SearchInput`은 `key`를 쓰면 입력 중에 포커스가 사라져서 이 방법을 택했다.

```tsx
const [draft, setDraft] = useState(keyword)
const [prevKeyword, setPrevKeyword] = useState(keyword)

if (keyword !== prevKeyword) {
  setPrevKeyword(keyword)
  // 내가 확정한 값이면 draft와 같다. 다르면 URL이 바깥에서 바뀐 것이다.
  if (keyword !== draft) setDraft(keyword)
}
```

입력창의 `commit`은 입력을 멈추고 300ms가 지나야 URL을 바꾼다. 그래서 "vue"를 치고 300ms가 지나기 전에 뒤로가기를 누르면, 이전 검색으로 돌아간 URL을 조금 뒤에 실행된 commit이 다시 "vue"로 덮어쓴다.  
그러니 URL의 keyword가 바뀌면 걸려 있던 commit도 취소하자.

```tsx
useEffect(() => {
  // URL의 keyword가 바뀌면 걸려 있던 commit을 취소한다
  commit.cancel()
}, [keyword, commit])
```

> 카테고리에는 draft가 필요 없다. select에서 고르는 순간 그 값으로 바로 검색하니, 카테고리는 URL에만 두자. keyword에 draft가 따로 필요한 건, 입력하는 동안에는 화면에 보이지만 아직 검색에는 쓰지 않는 값이 있기 때문이다.

&nbsp;

## URL과 Query Cache, 그리고 queryKey

다섯 번째 요구사항은 검색 조건마다 서버 응답을 캐싱하는 것이다. 처음 코드의 query를 다시 보자.

```tsx
useQuery({
  queryKey: ['products'],
  queryFn: () => fetchProducts(keyword),
})
```

keyword가 무엇이든 캐시의 주소가 `['products']` 하나다.  
같은 페이지에서 keyword가 바뀌어도 키가 같으니 다시 요청하지 않는다.  
처음 코드처럼 검색 버튼으로 refetch하면 "react"의 결과와 "vue"의 결과가 같은 `['products']` 캐시에 번갈아 덮어써진다.  
"vue"를 검색한 뒤 뒤로가기로 "react" URL에 돌아와도, 키가 같으니 다시 요청하지 않고 캐시에 남은 "vue" 결과가 그대로 보인다.

[TanStack Query 문서](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)는 queryFn이 쓰는 변수를 queryKey에 넣으라고 한다.

> 문서는 dependency array에 비유하지만, queryKey는 캐시 엔트리의 이름에 더 가깝다.

`['products', { keyword: 'react' }]`와 `['products', { keyword: 'vue' }]`는 서로 다른 서버 상태를 가리키고, 각각 따로 캐싱된다.  
그러니 keyword를 queryKey에 넣자.

```tsx
const { data: products = [] } = useQuery({
  queryKey: ['products', { keyword }],
  queryFn: ({ signal }) => fetchProducts(keyword, signal),
})
```

category는 URL에 있지만 queryKey에는 없다.  
이 예제에서는 서버가 keyword로만 검색하고, 카테고리는 받은 목록을 클라이언트에서 거르기 때문이다.  
URL에 있는 값을 모두 queryKey에 넣을 필요는 없다. 서버 응답을 바꾸는 값만 넣자.

&nbsp;

### 뭐가 Source of Truth일까

queryKey를 URL의 값으로 만들고 나니 한 가지 질문이 생겼다.  
URL과 Query Cache 중 뭐가 Source of Truth인가?

사용자가 무엇을 보고 싶어 하는지는 URL이 정한다. 검색 조건을 알고 싶으면 URL을 보면 된다.  
그 조건의 상품 목록은 서버가 정한다. Query Cache는 서버에서 마지막으로 받아 둔 사본이라,  
시간이 지나면 서버의 최신 값과 달라질 수 있다(stale).

keyword처럼 서버 응답을 바꾸는 URL의 값은 그대로 queryKey에 들어가니, 둘을 따로 맞출 일도 없다. URL이 "vue"로 바뀌면 화면이 보는 캐시 엔트리도 `['products', { keyword: 'vue' }]`로 바뀐다.

다만 `placeholderData: keepPreviousData`를 쓰면 URL과 화면의 데이터가 잠깐 어긋날 수 있다.  
새 조건의 응답을 기다리는 동안 이전 조건의 목록을 계속 보여주는 옵션인데,  
이때 URL은 이미 "vue"인데 화면에는 "react"의 결과가 보일 수 있다.  
`isPlaceholderData`가 `true`인 동안에는 화면의 데이터가 URL이 가리키는 결과가 아니다.  
그러니 이 동안에는 목록을 흐리게 보여주는 식으로 이전 결과라는 걸 알려주자.

![](1.webp)

&nbsp;

### 늦게 온 응답은 어디로 갈까

"rea"로 보낸 요청이 "react" 요청보다 늦게 도착하면 어떻게 될까?

"rea"의 응답은 `['products', { keyword: 'rea' }]` 엔트리에 저장되고, 화면은 지금 URL에 맞는 `['products', { keyword: 'react' }]`를 본다.  
늦게 온 응답이 지금 화면이 보는 엔트리에 들어가지 않으니, 화면이 "rea" 결과로 바뀌지는 않는다.

하지만 "rea" 요청도 그대로 두면 끝까지 응답을 받는다. [Query Cancellation 문서](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)에 따르면 TanStack Query는 쓰이지 않게 된 query를 기본적으로 취소하지 않는다.  
대신 TanStack Query는 queryFn에 `signal`(`AbortSignal`)을 넘겨준다.  
위 코드처럼 이 `signal`을 `fetchProducts` 안의 `fetch(url, { signal })`까지 전달하면, "rea" query가 쓰이지 않게 되는 순간 TanStack Query가 `signal`을 abort해서 요청이 중단된다.

다만 queryKey가 모든 경쟁 상태를 막아주지는 않는다.  
queryFn이 queryKey에 없는 변수를 클로저로 읽으면 다른 조건의 결과가 같은 엔트리에 들어간다. `setQueryData`로 캐시에 직접 쓸 때도, 진행 중이던 요청의 응답이 나중에 도착해 그 값을 덮어쓸 수 있다.

> 좋아요처럼 서버의 값을 바꾸는 요청끼리의 순서도 queryKey와는 상관이 없다. 이 문제는 좋아요를 다룬 뒤에 다시 꺼내 보자.

&nbsp;

## 뒤로가기는 무엇을 되돌려야 하나

keyword를 URL에 넣고 자동 검색을 붙이자, 일곱 번째 요구사항에서 걸렸다.

사용자가 "react"를 입력하면서 중간에 잠깐씩 멈추면, 멈출 때마다 URL이 바뀐다.  
URL을 바꿀 때마다 history에 entry를 새로 쌓으면 이렇게 된다.

```text
/products?keyword=re
/products?keyword=rea
/products?keyword=react
```

검색 결과에서 뒤로가기를 누르면 이전 페이지로 가는 게 아니라, "rea", "re"로 검색어가 한 글자씩 되돌아간다.

&nbsp;

history entry는 사용자가 뒤로가기로 돌아가고 싶어 할 지점이어야 한다.  
자동 검색으로 바뀐 URL은 사용자가 이동했다고 느끼는 지점이 아니다. 입력하는 동안 URL이 따라 바뀌는 것에 가깝다. 그러니 이런 변경은 새 entry를 쌓지 말고 현재 entry를 바꾸자.

```tsx
const commitKeyword = (value: string) => {
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev)
      value ? next.set('keyword', value) : next.delete('keyword')
      return next
    },
    { replace: true },
  )
}
```

반대로 검색 버튼을 눌러 명시적으로 제출하는 화면이라면, 제출할 때마다 entry를 쌓자. 사용자가 검색 결과마다 뒤로가기로 돌아가고 싶어 할 수 있다.  
카테고리는 서비스마다 다르다. 카테고리를 바꾸는 걸 "다른 목록으로 이동했다"고 느끼는 서비스라면 쌓고, "같은 목록을 걸러 봤다"고 느끼는 서비스라면 바꾸자.

> **라우터마다 다른 점**
>
> - **React Router**: `setSearchParams`는 navigation을 일으키고, `{ replace: true }`로 현재 entry를 바꾼다. 함수형 업데이트를 받지만 [문서](https://reactrouter.com/api/hooks/useSearchParams)에 따르면 React의 `setState`처럼 큐잉하지 않아서, 같은 이벤트 안에서 여러 번 부르면 앞의 값 위에 쌓이지 않는다.
> - **Next.js App Router**: `useSearchParams`는 읽기 전용이고, `router.push`/`router.replace`나 `<Link>`로 바꾼다. `<Link>`도 기본은 entry를 쌓는 push이고, [`replace` prop](https://nextjs.org/docs/app/api-reference/components/link#replace)을 주면 현재 entry를 바꾼다. 이런 이동은 모두 Client Navigation이라 서버에 RSC Payload를 다시 요청할 수 있고, 뒤로가기로 돌아올 때는 Client Cache에 있던 화면을 다시 쓴다. 서버 컴포넌트 결과가 필요 없는 조건이라면 `window.history.replaceState`로 URL만 바꾸는 방법도 있다. 이 경우 `useSearchParams`는 따라 바뀌지만 서버 컴포넌트는 다시 렌더링되지 않는다([Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api)).

&nbsp;

## URL로 옮기면 외부 입력이 된다

category가 컴포넌트 state였을 때는 값이 select에서만 들어왔다. 그 습관대로 URL에서 읽은 값에도 타입만 붙이기 쉽다.

```tsx
const category = searchParams.get('category') as Category
```

URL로 옮기고 나면 사정이 다르다. 사용자는 주소창에 직접 이렇게 칠 수 있다.

```text
/products?category=electronics
/products?category=banana
/products?category=
```

URL은 외부 입력이다. 누가 주소창에 무엇을 쳤든 그 값이 들어올 수 있다.  
`as Category`는 타입 검사를 통과시키지만 "banana"가 들어오는 걸 막지는 못한다.

![](2.webp)

&nbsp;

그러니 URL에서 읽은 값은 실행할 때 확인해야 한다.

```ts
const CATEGORIES = ['all', 'electronics', 'books', 'fashion'] as const
type Category = (typeof CATEGORIES)[number]

function isCategory(value: string | null): value is Category {
  return value !== null && (CATEGORIES as readonly string[]).includes(value)
}

const rawCategory = searchParams.get('category')
const category: Category = isCategory(rawCategory) ? rawCategory : 'all'
```

> type guard는 [타입 서술어 is, 언제 어떻게 쓰는 건데?](https://www.jeong-min.com/56-is/)에서, Zod로 search params 전체를 파싱하는 방법은 [느좋의 "좋"은 "Zod"일지도?](https://www.jeong-min.com/84-zod/)에서 다뤘다.

잘못된 값이 들어왔을 때 `'all'`로 바꿀지, URL까지 고쳐 쓸지, 없는 페이지로 보낼지는 서비스에 맞게 고르면 된다. 다만 이 판단은 URL을 읽는 한 곳에서 하자. 그래야 컴포넌트마다 서로 다른 category를 쓰는 일이 생기지 않는다.

> 이렇게 만든 `category`는 URL의 문자열에서 계산한 값이다. 파싱한 결과를 다시 state에 담으면 URL과 같은 것을 두 번 들고 있게 된다. `visibleProducts`처럼 매 렌더링마다 URL에서 계산하자.

&nbsp;

## 좋아요: 서버보다 먼저 바뀌는 값

마지막으로 여섯 번째 요구사항, 좋아요다.

처음 코드는 API를 부른 뒤 목록을 다시 받아왔다. 그동안 하트는 바뀌지 않는다.  
그러니 서버 응답을 기다리지 말고, 목록이 들어 있는 Query Cache를 먼저 고치자.  
[Optimistic Updates 문서](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)의 캐시 방식을 따르면 이렇게 된다.

```tsx
const key = ['products', { keyword }]

const likeMutation = useMutation({
  mutationFn: ({ id, liked }: { id: string; liked: boolean }) => putLike(id, liked),
  onMutate: async ({ id, liked }) => {
    await queryClient.cancelQueries({ queryKey: key }) // 진행 중인 refetch가 optimistic 값을 덮어쓰지 않게 한다
    const previous = queryClient.getQueryData<Product[]>(key)
    queryClient.setQueryData<Product[]>(key, (old) => old?.map((p) => (p.id === id ? { ...p, liked } : p)))
    return { previous }
  },
  onError: (_error, _variables, result) => queryClient.setQueryData(key, result?.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
})
```

> `useOptimistic`으로 비슷한 일을 하는 방법은 [React 19의 새로운 훅](https://www.jeong-min.com/63-react-19-hooks/)에서 다뤘다.

이때 optimistic 값은 따로 저장소를 갖지 않는다.  
서버가 준 목록이 있던 같은 캐시 엔트리를 덮어쓰고,  
원래 값은 `onMutate`가 돌려준 `previous`에 잠깐 들고 있다.  
그래서 이 엔트리는 잠시 서버의 사본 대신 "서버가 이렇게 될 거라고 기대하는 값"을 담는다.  
요청이 끝나면 `onSettled`의 invalidate로 서버에서 다시 받아와 사본으로 돌아간다.  

&nbsp;

화면 한 곳에서만 쓰는 값이라면 캐시를 건드리지 않는 방법도 [문서에 있다](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates#via-the-ui).  
요청이 진행 중인 동안 mutation에 넘긴 값(`variables`)을 그대로 화면에 그리는 것이다.

```tsx
function LikeButton({ product }: { product: Product }) {
  const queryClient = useQueryClient()
  const { mutate, variables, isPending } = useMutation({
    mutationFn: (liked: boolean) => putLike(product.id, liked),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  // 요청이 진행 중이면 보낸 값을, 아니면 서버가 준 값을 그린다
  const liked = isPending ? variables : product.liked

  return <button onClick={() => mutate(!liked)}>{liked ? '♥' : '♡'}</button>
}
```

버튼을 누르면 `mutate(true)`가 실행되고, 요청이 끝날 때까지 `variables`에 true가 들어 있다. 그동안 버튼은 `product.liked` 대신 이 값을 그리고, Query Cache의 목록은 건드리지 않는다.  
요청이 실패해도 캐시를 되돌릴 필요가 없다. `isPending`이 false가 되면 버튼은 다시 `product.liked`를 그리는데, 캐시를 고친 적이 없으니 이 값은 처음부터 서버가 준 값이다.

다만 true는 이 `LikeButton` 안에만 있다. 같은 상품을 보여주는 상세 페이지 같은 다른 컴포넌트는 그 화면의 데이터를 다시 받아올 때까지 예전 하트를 보여준다. 그러니 같은 값을 여러 곳에서 보여준다면 앞의 캐시 방식을 쓰자.

&nbsp;

### 같은 liked, 다른 값

두 방식 모두 화면에는 똑같이 `liked: true`가 보인다. 하지만 그 true가 무엇인지는 다르다.

Query Cache에 있던 값은 클라이언트가 마지막으로 받아 둔 서버의 값이다. 서버가 "이 상품은 좋아요 상태"라고 알려준 사실의 사본이다.  
optimistic 값은 사용자가 방금 누른 값이다. 서버는 아직 이 값을 확인하지 않았다.  
캐시 방식은 이 값을 서버 값이 있던 캐시 엔트리에 덮어써 두고, `variables` 방식은 대기 중인 mutation 안에 따로 들고 있다. 어디에 두든 이 값은 요청이 끝나면 없어진다. 성공하면 서버에서 다시 받아온 값으로 바뀌고, 실패하면 rollback하거나 서버 값으로 돌아간다.

그래서 optimistic 값은 서버 값과 같은 `Product.liked` 모양이어도, 누가 확정했는지와 언제 사라지는지가 다르다.

&nbsp;

> 여기까지 오면 새로운 문제가 생긴다. 사용자가 서버 응답을 기다리지 않고 좋아요를 다시 누른다면 어떤 값이 최신 상태일까?  
> 먼저 보낸 요청이 나중에 끝날 수도 있고, 이전 스냅샷으로 rollback하다가 더 최근의 사용자 입력을 덮어쓸 수도 있다.  
> 이건 상태를 어디에 두느냐보다 동시성과 일관성에 가까운 문제라서, [다음 글](https://www.jeong-min.com/96-optimistic-concurrency/)에서 따로 다뤄 보려 한다.

&nbsp;

## 그래서 어디로 이사했나

처음 코드에서는 모두 `useState`였던 값들이, 요구사항을 따라가다 보니 이렇게 나뉘었다.

| 상태 | 무엇에 답하나 | 누가 바꾸나 | 언제 사라지나 |
| - | - | - | - |
| input의 draft | 사용자가 지금 입력 중인 값 | 사용자 입력, 바깥에서 바뀐 URL | 페이지를 떠날 때 |
| URL의 search params | 사용자가 무엇을 보고 싶어 하는가 | 확정된 입력, 링크, 뒤로가기 | 다른 URL로 이동할 때. 공유와 새로고침에도 남는다 |
| history entry | 사용자가 되돌아갈 수 있는 지점 | `push`는 새로 쌓고, `replace`는 현재 것을 바꾼다 | replace되거나 탭을 닫을 때 |
| queryKey | 그 조건의 서버 응답을 어느 캐시 엔트리에 둘까 | URL 등에서 계산 | 매 렌더링마다 URL에서 다시 계산하니 따로 저장되지 않는다 |
| Query Cache | 서버가 준 응답의 클라이언트 사본 | query 요청, invalidate | 쓰이지 않으면 `gcTime`이 지난 뒤 |
| optimistic 값 | 서버가 이렇게 될 거라고 기대하는 값 | mutation | 서버 응답 후 다시 받아올 때. 캐시 방식은 실패하면 rollback |
| 파생 값 | 다른 상태로 계산한 결과 | 없음 | 매 렌더링마다 다시 계산 |

&nbsp;

상품 데이터의 진짜 Source of Truth인 서버는 표에 없다. Query Cache는 서버 데이터의 사본이고, optimistic 값은 서버가 그렇게 바뀔 거라는 기대라서, 둘 다 결국 서버 응답에 맞춰진다.

keyword 하나만 봐도 draft, URL, queryKey의 일부, history entry로 네 번 등장한다.  
"react"를 입력하는 동안 draft는 키를 누를 때마다 바뀌지만, URL은 입력을 멈추고 300ms가 지나야 바뀌고, queryKey는 그 URL을 따라 바뀐다. history entry는 replace로 바꾸니 검색어를 몇 번 바꿔도 하나로 남는다.  
상세 페이지에 갔다 오면 draft는 사라졌다가 URL의 keyword로 다시 시작하고, URL의 keyword는 새로고침하거나 공유해도 남는다.

그래서 새로운 값을 어디에 둘지 고민될 때는 저장 위치보다 아래 질문들을 먼저 해보자.

- 이 값을 누가 바꾸는가
- 언제 확정되는가
- 새로고침이나 공유로 재현되어야 하는가
- 뒤로가기로 돌아갈 지점인가
- 서버가 기준인 값인가
- 다른 값으로 계산할 수 있는가
- 실패했을 때 되돌려야 하는가
- 밖에서 들어오는 값인가

답이 정해지면 `useState`, URL, Query Cache 중 어디에 둘지 결론이 날 것이다.

```toc

```
