---
emoji: 🔀
title: '의존성 주입을 했는데 의존성 역전은 안 됐다고요?'
date: '2026-09-22'
categories: Dev
---

> 이름이 비슷해서 늘 한 덩어리로 외우게 되는 DI, DIP, IoC를 리액트 코드 위에서 갈라보는 이야기.

&nbsp;

[객체지향 vs 함수형? 싸울 일이 아닙니다](https://www.jeong-min.com/88-programming-paradigms/)에서 `children`으로 컨텐츠를 받는 Modal을 두고 이렇게 썼다.

> `children`이나 render prop으로 구현을 안에서 만들지 않고 밖에서 받는 건 의존성 주입이다.  
> 주입을 했다고 저절로 역전되는 건 아니고, 무엇을 받느냐가 추상이라서 역전이 성립하는 것이다.

의존성 주입(DI)과 의존성 역전(DIP)을 한 단락에 같이 써놓고, 왜 이 둘이 따로 있는 단어인지는 설명 없이 넘어갔다.  
둘은 이름만 비슷하고 서로 다른 층의 이야기인데, 여기에 제어의 역전(IoC)까지 끼면 "역전"이라는 단어가 두 번 나와서 더 헷갈린다.

그래서 이번엔 이 세 단어만 놓고 하나씩 떼어보려고 한다.

&nbsp;

## 세 단어, 세 질문

셋은 각자 다른 질문에 답하는 단어다.

- **DIP(Dependency Inversion Principle, 의존성 역전 원칙)**: 소스 코드가 **무엇에 의존하도록** 설계되어 있는가. 상위 수준의 정책이 하위 수준의 구체 구현에 의존하지 말고, 둘 다 추상에 의존하라는 설계 원칙이다.
- **DI(Dependency Injection, 의존성 주입)**: 의존성을 **누가 만들어서 전달하는가**. 필요한 것을 안에서 직접 만들지 않고 밖에서 받는 기법이다.
- **IoC(Inversion of Control, 제어의 역전)**: **제어권이 누구에게 있는가**. 내 코드가 흐름을 쥐고 남을 호출하는 대신, 프레임워크가 내 코드를 호출하는 구조를 가리키는 더 넓은 말이다.

정리하면 DIP는 방향, DI는 전달, IoC는 제어권 얘기다.  
DI는 IoC를 의존성이라는 문제에 적용한 한 형태고, DIP는 DI로 얻을 수 있는 결과 중 하나다.  
그런데 DI를 했다고 DIP가 따라오는 것도 아니고, DIP를 지키는 방법이 DI만 있는 것도 아니다.  
제목이 그 얘기다.

&nbsp;

## 뭐가 뒤집힌다는 걸까

사용자 정보를 가져오는 서비스가 있다고 해보자.

```ts
class UserService {
  async getUser(id: string): Promise<User> {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  }
}
```

`UserService`는 "사용자를 가져온다"는 상위 수준의 정책인데, 그 안에서 `fetch`와 URL과 JSON 파싱이라는 하위 수준의 구체 구현을 직접 알고 있다.

```text
UserService  ─────→  fetch('/api/users/…')
  상위 정책             하위 구현
```

그래서 HTTP를 IndexedDB로 바꾸거나 테스트에서 네트워크를 끊으려면 `UserService`를 고쳐야 한다.  
정책이 구현에 끌려다니는 구조인 것이다.

![](0.jpg)

&nbsp;

여기에 추상을 하나 끼워보자.

```ts
interface UserRepository {
  getUser(id: string): Promise<User>;
}

class UserService {
  constructor(private repository: UserRepository) {}

  getUser(id: string) {
    return this.repository.getUser(id);
  }
}

class HttpUserRepository implements UserRepository {
  async getUser(id: string) {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  }
}
```

```text
              UserRepository (추상)
              ↑             ↑
              │             │
       UserService     HttpUserRepository
        상위 정책           하위 구현
```

이제 `UserService`는 `UserRepository`라는 추상에 의존한다.  
`HttpUserRepository`도 그 추상에 의존한다. 구현해야 하니까.

화살표 하나가 반대로 그려졌다는 게 요점이 아니다.  
원래는 정책이 구현을 따라갔기에 구현이 바뀌면 정책을 고쳐야했다.  
이제는 구현이 정책이 정한 추상을 따라간다. "사용자를 가져올 수 있어야 한다"는 계약은 상위에서 정했고, 하위 구현은 거기에 맞춰 만들어진다.

이 방향이 뒤집힌 게 역전이다.

![](1.jpeg)

&nbsp;

### 인터페이스 파일은 어디에 두지

그런데 인터페이스를 만들었다고 끝이 아니다. 그 파일을 어느 폴더에 넣을지도 정해야 한다.  
별거 아닌 것 같지만 여기서 방향이 다시 원래대로 돌아가버릴 수 있다.

`HttpUserRepository`를 만들다가 인터페이스가 필요해졌으니, 자연스럽게 그 옆에 두게 된다.

```ts
// http/UserRepository.ts
export interface UserRepository { ... }

// http/HttpUserRepository.ts
export class HttpUserRepository implements UserRepository { ... }

// user/UserService.ts
import type { UserRepository } from '../http/UserRepository';
```

클래스만 보면 `UserService`는 추상에 의존한다.  
그런데 import 문을 보면 `user/`가 `http/`를 바라보고 있다. `http/` 폴더를 지우면 `UserService`가 컴파일되지 않는다.  
폴더 단위로는 여전히 정책이 구현을 따라가고 있는 셈이다.  
이 위치에 있는 `UserRepository`는 "HTTP 저장소가 할 수 있는 일"을 적은 목록이지, `UserService`가 필요로 하는 걸 적은 게 아니다.

인터페이스를 `UserService` 옆으로 옮기면 import 방향이 바뀐다.

```ts
// user/UserRepository.ts
export interface UserRepository { ... }

// user/UserService.ts
import type { UserRepository } from './UserRepository';

// http/HttpUserRepository.ts
import type { UserRepository } from '../user/UserRepository';
```

이제 `http/`가 `user/`를 바라본다. `http/`를 통째로 지워도 `user/`는 멀쩡하다.  
`UserRepository`는 `UserService`가 "나는 이런 게 필요하다"고 적어둔 요구 사항이 되고, `HttpUserRepository`는 그 요구를 채우러 오는 쪽이 된다.

그래서 인터페이스는 구현 옆이 아니라 그걸 필요로 하는 쪽 옆에 둔다.  
추상의 주인은 쓰는 쪽이다.  
뒤에서 리액트 예시를 볼 때 `fetchUser`의 타입을 api 모듈에서 import하지 않고 컴포넌트의 `Props`에 직접 적는데, 그것도 같은 이유다.

&nbsp;

## 주입은 했는데 역전은 안 된 경우

여기까지 읽으면 "밖에서 넣어주면 역전"이라고 정리하고 싶어진다.  
그런데 이 코드를 보자.

```ts
class UserService {
  constructor(private repository: HttpUserRepository) {}

  getUser(id: string) {
    return this.repository.getUser(id);
  }
}

const service = new UserService(new HttpUserRepository());
```

의존성을 안에서 만들지 않고 밖에서 받았다. DI다.  
하지만 생성자가 받는 타입이 `HttpUserRepository`라는 구체 클래스다.  
`UserService`는 여전히 HTTP 구현을 알고 있고, 테스트에서 가짜를 넣으려면 `HttpUserRepository`를 상속해서 메서드를 덮어써야 한다.  
주입은 했지만 역전은 안 됐다.

![](2.webp)

&nbsp;

반대도 있다.

```ts
class UserService {
  private repository: UserRepository = container.resolve('UserRepository');
}
```

`UserService`는 추상에만 의존한다. DIP는 지켜졌다.  
하지만 의존성을 밖에서 받은 게 아니라 안에서 찾아왔다. 서비스 로케이터 패턴이라고 부르는 것이고, DI는 아니다.

그러니까 둘은 독립적인 축이다.

|                 | 구체에 의존                | 추상에 의존             |
| --------------- | -------------------------- | ----------------------- |
| **안에서 생성** | 처음의 `fetch` 직접 호출   | 로케이터로 추상을 조회  |
| **밖에서 주입** | `HttpUserRepository` 주입  | `UserRepository` 주입   |

DI는 행을 바꾸는 기법이고, DIP는 열의 문제다.  
우리가 "DI 했다"고 말할 때 기대하는 효과는 오른쪽 아래 칸인데, 거기 가려면 두 가지를 다 해야 한다.  
주입을 받더라도 구체 타입을 받으면 DIP는 지켜지지 않는다.

&nbsp;

## 리액트에는 클래스도 생성자도 없는데

앞의 예시는 전부 클래스였다.  
함수 컴포넌트와 훅으로 이루어진 리액트 코드에서는 이 개념들이 어디에 있을까.

### props가 가장 단순한 DI다

```tsx
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  return <h1>{user?.name}</h1>;
};
```

처음의 `UserService`와 같은 상태다.  
"사용자 프로필을 보여준다"는 정책이 `fetch`와 URL을 직접 알고 있다.  
스토리북에서 띄우려면 네트워크를 목킹해야 하고, API가 바뀌면 컴포넌트를 고쳐야 한다.

밖에서 받도록 해보자.

```tsx
type Props = {
  userId: string;
  fetchUser: (id: string) => Promise<User>;
};

const UserProfile = ({ userId, fetchUser }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId, fetchUser]);

  return <h1>{user?.name}</h1>;
};
```

```tsx
// 앱에서
<UserProfile userId="1" fetchUser={userApi.getUser} />

// 테스트나 스토리북에서
<UserProfile userId="1" fetchUser={() => Promise.resolve({ id: '1', name: '정민' })} />
```

생성자 인자가 props로 바뀐 것뿐이다.  
컨테이너도 데코레이터도 클래스도 없다. 함수의 인자로 받으면 그게 의존성 주입이다.

&nbsp;

### 무엇을 주입하는가

그런데 같은 "밖에서 받기"라도 무엇을 받느냐에 따라 DIP가 지켜지기도 하고 안 지켜지기도 한다.

```tsx
// ❌ fetch 자체를 주입한다.
const UserProfile = ({ userId, fetch }: { userId: string; fetch: typeof window.fetch }) => {
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId, fetch]);
  // ...
};
```

주입은 했다. 테스트에서 가짜 `fetch`를 넣을 수도 있다.  
하지만 컴포넌트는 여전히 URL을 알고, 응답이 JSON이라는 것도 알고, `res.json()`을 불러야 한다는 것도 안다.  
HTTP라는 구체 구현의 세부사항이 컴포넌트 안에 그대로 남아 있다.  
`HttpUserRepository`를 생성자로 받던 코드와 같은 상황이다.

&nbsp;

```tsx
// ✅ 컴포넌트가 실제로 필요로 하는 기능 단위의 추상을 주입한다.
type Props = {
  userId: string;
  fetchUser: (id: string) => Promise<User>;
};
```

`fetchUser`는 "id를 주면 User를 돌려준다"는 계약만 말한다.  
HTTP인지, 캐시인지, 하드코딩된 목 데이터인지 컴포넌트는 모른다.  
이 계약을 정한 쪽은 컴포넌트다. 컴포넌트에 필요한 형태로 인터페이스를 정했고, 구현이 거기에 맞춘다.  
그래서 이건 DI이면서 DIP다.

주입할 것을 고를 때는 소비하는 쪽이 필요로 하는 만큼만 드러내는 추상인지를 보면 된다.  
`fetch`는 컴포넌트가 필요로 하는 것보다 훨씬 많은 걸 드러낸다.

&nbsp;

### prop drilling, 그리고 Context

props로 주입하기 시작하면 금방 이런 그림이 된다.

```text
App
 ↓ fetchUser
Layout
 ↓ fetchUser
Page
 ↓ fetchUser
UserProfile
```

`Layout`과 `Page`는 `fetchUser`를 쓰지 않는다. 그냥 전달만 한다.  
그래서 트리 위에서 한 번 제공하고 필요한 곳에서 꺼내 쓰는 쪽으로 옮기게 된다.

&nbsp;

Context로 받도록 해보자.

```tsx
// UserProfile 쪽에서 정한 계약. api 모듈이 아니라 쓰는 쪽에 있다.
type UserApi = {
  fetchUser: (id: string) => Promise<User>;
};

const UserApiContext = createContext<UserApi | null>(null);

const useUserApi = () => {
  const api = useContext(UserApiContext);
  if (!api) throw new Error('UserApiProvider가 없습니다.');
  return api;
};

const UserProfile = ({ userId }: { userId: string }) => {
  const { fetchUser } = useUserApi();
  // ...
};
```

```tsx
// 앱
<UserApiContext.Provider value={httpUserApi}>
  <App />
</UserApiContext.Provider>

// 테스트
<UserApiContext.Provider value={mockUserApi}>
  <UserProfile userId="1" />
</UserApiContext.Provider>
```

컴포넌트는 자기가 어떤 구현을 쓸지 정하지 않는다. 바깥의 Provider가 정해서 넣어준다.  
Context도 DI 수단이다. props가 생성자 주입이라면 Context는 트리 단위의 주입이다.

&nbsp;

### Context와 직접 import는 뭐가 다른가

Context로 받는 것과 모듈에서 직접 import하는 것은 겉보기에 비슷하다.  
둘 다 `userApi`라는 객체를 얻어서 호출한다.

```tsx
// A. 직접 import
import { userApi } from './userApi';

const UserProfile = ({ userId }: Props) => {
  useEffect(() => {
    userApi.getUser(userId).then(setUser);
  }, [userId]);
};

// B. Context
const UserProfile = ({ userId }: Props) => {
  const userApi = useUserApi();
  useEffect(() => {
    userApi.getUser(userId).then(setUser);
  }, [userId, userApi]);
};
```

A가 나쁘다는 건 아니다. `userApi.ts` 안에서 fetch를 axios로 바꾸든 URL을 바꾸든, `getUser`의 모양만 그대로면 `UserProfile`은 한 글자도 안 바뀐다.  
모듈의 export가 이미 경계 역할을 하고 있어서다.

A로 안 되는 건 다른 거다.  
`./userApi`는 한 빌드 안에서 하나로 고정된다. 프로덕션에서는 HTTP 구현을, 스토리북의 어떤 스토리에서는 목을, 다른 스토리에서는 에러를 뱉는 목을 쓰고 싶어도 import로는 방법이 없다.  
테스트에서 `UserProfile`한테 목을 물려주려면 `UserProfile`을 고치거나, `jest.mock`이나 번들러 alias로 모듈 해석 자체를 가로채야 한다.  
그리고 `userApi`의 타입은 구현 파일에서 추론된다. `UserProfile`은 "userApi가 내놓는 것"에 맞춰야 하고, 계약을 정한 쪽은 구현이다. 앞에서 인터페이스 파일을 구현 옆에 뒀을 때와 같은 상황이다.

B는 `UserProfile`이 "UserApi 형태의 무언가"만 요구하고, 무엇을 넣을지는 감싸는 쪽이 정한다.  
트리 위치마다 다른 Provider를 두면 같은 빌드 안에서 다른 구현을 쓸 수 있고, 테스트에서는 `<Provider value={mock}>`으로 감싸면 끝이다.  
계약의 타입인 `UserApi`도 api 모듈이 아니라 Context를 만든 소비자 쪽에서 정한다. `httpUserApi`와 `mockUserApi`가 이 타입에 맞춰 만들어진다.

그러니 차이는 구현이 바뀔 때 소비자를 고쳐야 하느냐가 아니라, 구체 구현을 누가 언제 고르느냐다.  
import는 모듈이 해석되는 시점에 파일 안에서 한 번 고르고, Context는 런타임에 조립하는 코드가 트리 위치마다 고른다.

&nbsp;

그렇다고 모든 import를 Context로 바꾸자는 건 아니다.  
Context에는 비용이 있다. 값이 어디서 오는지 파일만 봐서는 알 수 없고, Provider가 빠지면 런타임에 터지고, 타입에 `null` 처리가 붙는다.

바꿔 끼울 일이 없는 의존성은 import가 맞다. 순수 유틸을 Context로 주입하는 사람은 없다.  
주입이 값어치를 하는 건 네트워크, 스토리지, 분석 도구, 현재 시각, 랜덤처럼 테스트나 환경에 따라 다른 구현이 들어가야 하는 경계에서다.

&nbsp;

### children도 주입이다

처음에 인용한 이전 글의 Modal로 돌아가보자.

```tsx
// ❌ Modal이 무엇을 그릴지 스스로 선택한다.
const Modal = ({ type }: { type: 'login' | 'signup' }) => (
  <Overlay>{type === 'login' ? <LoginForm /> : <SignupForm />}</Overlay>
);

// ✅ 무엇을 그릴지는 사용하는 쪽이 넣어준다.
const Modal = ({ children }: PropsWithChildren) => <Overlay>{children}</Overlay>;
```

이제 그 문장을 둘로 나눠서 다시 읽을 수 있다.

`children`으로 받는 건 DI다. 안에서 만들지 않고 밖에서 받았다.  
그리고 받는 타입이 `LoginForm`이 아니라 `ReactNode`, 즉 "렌더링 가능한 무언가"라는 추상이라서 DIP다.  
둘이 같이 성립해서 Modal이 구체 컨텐츠를 몰라도 되는 것이다.

&nbsp;

## 그러면 IoC는 어디에 있나

세 단어 중 IoC만 아직 안 나왔다.  
리액트 코드를 쓰는 순간 이미 IoC 안에 있어서, 따로 보이지 않는 것이다.

```tsx
const UserProfile = ({ userId }: Props) => {
  // ...
};
```

이 함수를 내가 호출하는 코드는 어디에도 없다.  
언제 호출할지, 몇 번 호출할지, 호출한 결과를 쓸지 버릴지 전부 리액트가 정한다.  
`useEffect`에 넘긴 함수도 마찬가지다. 실행 시점을 내가 정하지 않는다.

흐름의 제어가 내 코드가 아니라 프레임워크에 있고, 프레임워크가 정해진 시점에 내 코드를 불러준다.  
"우리한테 전화하지 마세요, 우리가 전화할게요"라는 뜻으로 헐리우드 원칙이라고도 부른다.

![](3.jpg)

IoC는 어떤 기법을 써서 얻는 게 아니라 프레임워크 위에서 코드를 쓸 때 이미 갖고 있는 구조의 성질이다.

> 리액트가 렌더를 다시 실행하거나 결과를 버릴 수 있어서 컴포넌트가 순수해야 한다는 이야기도 결국 이 얘기다. 호출 제어권이 리액트에 있으니 몇 번 불려도 흔적이 남지 않아야 한다. [이전 글](https://www.jeong-min.com/88-programming-paradigms/)의 순수성 절에서 다뤘다.

DI는 이 성질을 의존성이라는 문제에 적용한 것이다.  
"무엇을 쓸지"의 선택권을 컴포넌트가 아니라 그것을 조립하는 쪽, 즉 부모 컴포넌트나 Provider를 놓는 코드가 갖는다.  
여기서 권한을 넘겨받는 건 리액트가 아니다.  
리액트가 가진 건 "언제 호출할지"라는 실행 흐름의 제어권이고, DI로 옮겨가는 건 "어떤 구현을 넣을지"라는 선택권이다.  
둘 다 제어를 뒤집으니 IoC라는 한 이름으로 묶이지만, 뒤집힌 권한이 어디로 가는지가 다르다.

&nbsp;

리액트 예시에는 이 둘이 겹쳐 있어서 어느 쪽 제어권을 말하는지 헷갈리기 쉽다.  
앞의 클래스 예시로 돌아가보자.

```ts
const repository = new HttpUserRepository();
const service = new UserService(repository);

service.getUser('1');
```

처음의 `UserService`는 자기 안에서 `fetch`를 불렀다. 어떤 구현을 쓸지 스스로 정했다.  
생성자 주입으로 바꾸면 그 결정이 밖으로 나온다. 위의 두 줄을 쓰는 자리, 즉 조립하는 코드가 어떤 저장소를 넣을지 정한다.  
`UserService`는 자기가 무엇을 받았는지 모른다. 이게 의존성 선택의 역전이다.

하지만 `service.getUser('1')`을 부르는 건 여전히 우리 코드다.  
언제 부를지, 몇 번 부를지 우리가 정한다. 실행 흐름의 역전은 여기 없다.  
순수 클래스 코드에서 DI를 했을 때 얻는 IoC는 선택의 역전 하나다.

실행 흐름까지 뒤집히는 건 DI 컨테이너를 쓸 때다.  
NestJS나 Spring에서는 `new UserService(...)`를 우리가 쓰지 않는다. 컨테이너가 생성자 시그니처를 보고 인스턴스를 만들고, 주입하고, 생명주기를 관리한다.  
우리 생성자를 프레임워크가 호출하는 셈이라, 이때는 "우리가 부르지 않고 불려진다"는 의미의 역전까지 성립한다.  
이런 컨테이너를 IoC 컨테이너라고 부르는 이유다.

&nbsp;

DIP의 역전을 "주입하는 쪽이 선택권을 가진다"는 말로 설명하기 쉬운데, 그건 제어권에 대한 설명이다.  
DIP가 뒤집는 건 의존 방향이다.  
같은 이름을 달고 있지만 뒤집히는 대상이 다르다.

&nbsp;

## 마무리

- DIP는 방향의 문제다. 정책이 구현을 따라가던 것을, 구현이 정책의 추상을 따라가도록 뒤집는다.
- DI는 전달의 문제다. 안에서 만들지 않고 밖에서 받는다. 리액트에서는 props, Context, children이 그 통로다.
- IoC는 제어권의 문제다. DI가 뒤집는 건 의존성 선택권이고, 실행 흐름의 제어권은 프레임워크 위에서 이미 넘어가 있다.
- 주입했다고 역전된 게 아니다. 무엇을 받는지 봐야 한다.
- Context와 import의 차이는 구현이 바뀔 때 소비자를 고쳐야 하느냐가 아니라, 구체 구현을 누가 언제 고르느냐다.
- 모든 곳에 주입이 필요한 건 아니다. 교체가 필요한 경계에만 쓰면 된다.

```toc

```
