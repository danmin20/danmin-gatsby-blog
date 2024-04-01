---
emoji: 🗺️
title: 'find 그만 쓰고 reduce 어때요? reduce로 map 만들기'
date: '2024-04-01'
categories: Dev
---

## 배열에서 특정 값 찾을 때, find만 쓰진 않았나요?

자바스크립트 배열을 다룰 때, map, forEach, find, findIndex 등의 메서드는 정말정말 유용한 친구들이다.  
하지만 매번 똑같은 배열에 대해 루프를 여러 번 돌아야 한다면..?  
루프의 루프의 루프를 돌아야 한다면..?

우리들의 시간은 소중하니까!!!  
더욱 효율적인 방법이 어디 없을까?

![](0.png)

&nbsp;

## reduce, 들어는 보았나

reduce 함수는 줄인다는 뜻과 일맥상통하게, 배열을 하나의 값으로 줄여 반환해주는 친구다.  
즉, 배열을 하나의 값으로 만들어버리고 싶을 때 쓰면 되는 것! (물론 새로운 배열을 만들 수도 있다)

```ts
acc.reduce((acc, cur) => {
  // ...
})
```
위 처럼 acc와 cur로 표현되는 reduce 식을 본 적은 다들 한 번 쯤 있을 것이다.  
정확히는, reduce가 실행하는 콜백은 네 가지 인수를 받는다.

```ts
acc.reduce((accumulator, currentValue, index, array) => {
  // ...
})
```

- accumulator: 콜백의 반환값을 누적
- currentValue: 현재 처리할 요소
- currentIndex: 현재 처리하는 요소의 인덱스
- array: 원본 배열

&nbsp;

reduce에는 초기값을 줄 수도, 안 줄 수도 있는데,  
이에 따라 인자의 값도 달라진다.

initialValue를 준 경우,
- accumulator는 초기값이다.
- currentValue는 배열의 첫 번째 값이다.
- currentIndex는 0이다.

initialValue를 주지 않은 경우,
- accumulator는 배열의 첫 번째 값이다.
- currentValue는 배열의 두 번째 값이다.
- currentIndex는 1이다.

![](1.jpeg)

&nbsp;

예시를 통해 한 번 살펴보자!

```ts
const arr = [0, 1, 2, 3, 4]
const arr1 = arr.reduce((acc, cur) => acc + cur) // 10
const arr2 = arr.reduce((acc, cur) => acc + cur, 10) // 20
```

위의 경우, reduce를 사용해서 배열의 값을 합산해보았는데,  
이 외에도 reduce를 사용하면 배열을 무궁무진하게 다룰 수 있다.  
한 마디로 매우 강력한 친구라는 것!

![](2.jpeg)

이제 reduce에 대해 어느 정도 알았으니, 본론으로 들어가보자!

&nbsp;

## 맵 만들기

> Map은 key value 쌍의 자료구조로, javascript에서도 [Map](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map)을 제공하지만,  
> 이 글에서는 Map 객체가 아닌 단순 key value 쌍을 의미합니다.

예를 들어, 아래와 같은 배열이 있다고 해보자.

```ts
const persons = [
  {
    id: 0,
    name: '김땡땡',
    roles: ['student', 'developer']
  },
  {
    id: 1,
    name: '이땡땡',
    roles: ['developer']
  }
  // 등등 ...
]
```

api 호출로 위 배열을 가져오는 구조라 했을 때,  
그리고 사용자의 id를 사용해서 해당 사용자의 정보를 가져와야 한다고 했을 때,  
제일 간단한 방법은 find를 사용하는 것일 것이다.

하지만 사용자를 찾는 로직이 계속해서 반복된다면?  
`developer`를 `role`로 포함하는 사용자를 찾아야 한다면?

```ts
// ex1. O(n) = 2n
const user = persons.find((person) => person.id === 0)
if (user?.roles.find((role) => role === 'developer')) {
  console.log('개발자입니다.')
}

// ex2. O(n) = n^2
const isDeveloper =
  persons.find((person) => person.id === 0)?.roles.includes('developer') ??
  false
```

우리는 계속해서 배열을 순회할 것이고 불필요한 연산이 여러 번 수행될 것이다.

특정 값을 찾을 때 배열의 경우 검색이 되기에 시간복잡도는 **O(N)** 이지만,  
객체의 경우 특정 값을 키로 찾는다면, 검색이 아닌 접근이 되기에 시간복잡도는 **O(1)** 이 된다.

즉, 우리는 불필요한 연산을 map으로 줄일 수 있고, reduce로 map을 만들 수 있다!

```ts
const personMap = persons.reduce((acc, cur) => {
  const roleMap = cur.roles.reduce((acc2, cur2) => {
    acc2[cur2] = true
    return acc2
  }, {} as Record<string, boolean>)

  return {
    ...acc,
    [cur.id]: {
      name: cur.name,
      ...roleMap
    }
  }
}, {} as Record<number, Record<string, string | boolean>>)
```
위 연산 자체는 n^2의 시간복잡도를 가지지만,  
map을 한 번 만들어 놓고 나면 그 이후의 연산은 획기적으로 줄일 수 있다.

```ts
// ex1. O(n) = 1
const user = personMap[0]
if (user?.developer) {
  console.log('개발자입니다.')
}

// ex2. O(n) = 1
const isDeveloper2 = personMap[0]?.developer ?? false
```

&nbsp;

또 다른 예시를 한 번 살펴보자.

```ts
type UnitType = 'length' | 'weight'
type DataType = {
  type: UnitType
  value: number
  unit: string
}

const units: Record<UnitType, Record<'en' | 'ko', string>[]> = {
  length: [
    { en: 'km', ko: '킬로미터' },
    { en: 'm', ko: '미터' }
  ],
  weight: [
    { en: 'kg', ko: '킬로그램' },
    { en: 'g', ko: '그램' }
  ]
}

const data: DataType[] = [
  {
    type: 'length',
    value: 10,
    unit: 'km'
  },
  {
    type: 'weight',
    value: 20,
    unit: 'kg'
  }
]
```
위와 같은 형식으로 api 응답이 각각 내려온다고 가정해보자.  
한글로 렌더링하고 싶다면 아래와 같이 작성할 수 있을 것이다.

```tsx
export default function Example() {
  return (
    <div>
      {/* O(n) = n^2 */}
      {data.map((d, idx) => {
        const unitKo = units[d.type].find((u) => u.en === d.unit)?.ko
        return (
          <div key={idx}>
            {d.value}
            {unitKo}
          </div>
        )
      })}
    </div>
  )
}
```

&nbsp;

하지만 map을 만든다면?!

> 물론, reduce를 꼭 활용하지 않더라도 map은 만들 수 있다.

```tsx
const unitMap: {
  [key in UnitType]: {
    [key: string]: string
  }
} = {
  length: {},
  weight: {}
}

const keys = Object.keys(units) as UnitType[]

keys.forEach((key) => {
  unitMap[key] = {}
  units[key].forEach((unit) => {
    unitMap[key][unit.en] = unit.ko
  })
})

export default function Example() {
  return (
    <div>
      {/* O(n) = n */}
      {data.map((d, idx) => {
        const unitKo = unitMap[d.type][d.unit]
        return (
          <div key={idx}>
            {d.value}
            {unitKo}
          </div>
        )
      })}
    </div>
  )
}
```

하지만 reduce로 한 번에 더 효율적으로 만들 수 있다.

```ts
const unitMap: {
  [key in UnitType]: {
    [key: string]: string
  }
} = data.reduce(
  (acc, cur) => {
    const { type } = cur
    acc[type] = units[type].reduce((innerAcc, unit) => {
      innerAcc[unit.en] = unit.ko
      return innerAcc
    }, {} as { [key: string]: string })
    return acc
  },
  {
    length: {},
    weight: {}
  } as {
    [key in UnitType]: {
      [key: string]: string
    }
  }
)
```

&nbsp;

배열의 요소가 많고 복잡할수록, reduce는 좋은 해결책이 되어줄 것이다!

![](3.jpeg)

```toc
```