---
emoji: 🥙
title: 'URL엔 왜 케밥 케이스를 쓰는가?'
date: '2023-05-29'
categories: Dev
---

문득 개발을 하면서 라우팅을 하다가 궁금증이 떠올랐다.

> '왜 우리는 URL에 케밥 케이스를 사용하고 있지?'

~뇌 빼놓고 코딩하는 습관을 고치기 위해,~ URL 컨벤션에 대해 한 번 찾아보았다!
![](0.png)

&nbsp;

## URL에서 케밥 케이스를 사용하는 이유

1. **가독성과 사용자 친화성**  
   URL은 사용자에게 직접 노출되는 요소다. 따라서 가독성이 좋고 사용자가 이해하기 쉬운 URL을 제공하는 것이 중요한데, 특히 케밥 케이스가 단어 사이에 대시를 사용하여 각 단어를 명확하게 구분해주기 때문에 가독성이 좋다.

2. **특수 문자 제한**  
   URL은 특수 문자를 제한하는 경우가 많다. 공백이나 다른 특수 문자를 URL에 직접 사용할 수 없기 때문에, 단어를 구분하는 데에는 특수 문자를 사용할 수 있는 유일한 방법은 대시(-)다. 케밥 케이스는 단어 사이에 대시를 사용하여 단어를 분리하므로, URL의 구조를 깨지 않고 유효한 문자만 사용하여 URL을 작성할 수 있다.

3. **검색 엔진 최적화(SEO)**  
   URL은 검색 엔진 최적화에 영향을 미칠 수 있는 중요한 요소다. 검색 엔진은 URL을 분석하여 웹 페이지의 내용을 이해하고 색인화하는 데 사용한다. 케밥 케이스는 단어를 구분하는 명확한 방법을 제공하므로, 검색 엔진이 URL을 이해하기 쉽게 할 수 있다. 이는 검색 엔진에서 페이지의 관련성을 평가하는 데 도움이 될 수 있다.

4. **링크 공유와 복사/붙여넣기**  
   케밥 케이스는 링크를 다른 사람과 공유할 때 유용하다. 공백이나 특수 문자가 없는 URL은 다른 플랫폼이나 소셜 미디어에서도 깨지지 않고 정확하게 복사되고 붙여넣기될 수 있다. 이는 URL을 정확하게 공유하고 전달하는 데 도움이 된다.

5. **플랫폼 호환성**  
   일부 플랫폼이나 시스템의 경우 URL의 대소문자를 구분할 수 없는 경우도 있다. 케밥 케이스는 모든 단어를 소문자로 유지하므로 대소문자 호환성 문제를 피할 수 있다. 이는 URL이 여러 플랫폼에서 일관되게 동작하고 호환되는 데 도움이 된다.

따라서 케밥 케이스는 무엇보다도 URL의 가독성과 사용자 친화성을 높이고, 특수 문자 제한을 준수하는 데에 효과적인 방법이고, 다른 사항들을 고려했을 때도 좋은 방법이라고 볼 수 있다.

&nbsp;

네이밍은 실제로 정말 힘든 일이다.

![](1.jpeg)

그치만 url 네이밍은 그렇게 어렵지 않으니, 소문자와 케밥 케이스를 사용하는 것만 신경써보면 어떨까?

![](2.jpeg)

```toc
```