---
emoji: 🕶️
title: 'Matrix, Sharding과 함께 하는 CI 속도 개선'
date: '2025-04-08'
categories: Dev
---

![](0.jpg)

> 99년도 영화를 아주 재밌게 본 99년생이 쓰는 글

&nbsp;

나는 대부분 모노레포 환경에서 개발을 해왔는데, 각 패키지의 규모가 커지면 커질수록 CI에 대한 고충도 커져갔다.
CI에서 의존성 설치에 시간이 오래 걸린다면 Yarn berry의 Zero-Install을 활용해볼 수 있겠고,
빌드에 시간이 오래 걸린다면 여타 다른 번들러나 빌드 시스템을 써볼 수도 있다.

*하지만 이미 프로젝트에서 Pnpm을 쭉 사용해왔다면? Vite나 Turborepo를 쭉 사용해왔다면?*

**GitHub/GitLab Actions API**를 적극적으로 사용하는 것이 최선의 방법일 것이다.

&nbsp;

## Matrix

매트릭스란 무엇인가?

![](1.jpg)
> 침대 매트리스 아니다.

&nbsp;

Matrix의 뜻은 행렬이다. 영화 매트릭스에서의 매트릭스 또한 수식의 행렬처럼 이미 구조화된 세계를 뜻한다.

GitHub Actions는 Matrix의 기능을 다음과 같이 설명한다.  
**"각 작업에 대한 변형을 정의하는 행렬을 만듭니다."**

> [Matrix를 어떻게 활용할 수 있는지는 공식 문서를 참고하길 바란다.](https://docs.github.com/ko/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow)

기본적으로 가용성에 따라 병렬로 실행되는 작업 수를 알아서 최대화하기 때문에, Matrix를 활용한다면 작업에 소요되는 시간을 줄일 수 있다.

그렇다면..  
*"모노레포 환경에서 패키지들을 Matrix 변수로 정의한다면 여러 작업들을 병렬적으로 실행할 수 있지 않을까?!"*

&nbsp;

```yml
jobs:
  lint_tsc:
    steps:
      - name: Run Lint
        run: pnpm run lint
      - name: Run TypeScript Check
        run: pnpm run tsc
      - name: Run Test
        run: pnpm run test
  build:
    steps:
      - name: Build
        run: pnpm run build
```
위와 같은 워크플로우를 가진다고 해보자.
패키지 A, B, C가 있다고 했을 때, 패키지 A에만 변경이 발생했더라도 모든 패키지에 대해 lint/tsc/build를 수행하게 된다.

&nbsp;

### 1. 변경점이 존재하는 패키지를 걸러내자

```sh
#!/bin/bash

# develop 기준으로 변경된 파일 목록 가져오기
CHANGED_FILES=$(git diff --name-only origin/${GITHUB_BASE_REF:-develop}...HEAD)

# 패키지 목록 초기화
CHANGED_PACKAGES=()

# apps 하위의 변경된 디렉토리를 찾아서 패키지 리스트에 추가
for dir in $(echo "$CHANGED_FILES" | grep -oE '^apps/[^/]+' | sort -u); do
  CHANGED_PACKAGES+=("$(basename "$dir")")
done
```

> 물론 yaml에 작성할 수도 있겠지만, 가독성에 거슬리니 별도의 쉘 스크립트로 작성해주었다.

&nbsp;

위 쉘 스크립트를 실행하는 job을 작성해주자.

```yml
jobs:
  detect_changed_packages:
    outputs:
      changed_packages: ${{ steps.changed-packages.outputs.packages }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run Change Detection Script
        id: changed-packages
        run: bash .github/scripts/detect-changed-packages.sh
```
위 job을 먼저 실행해준다면, lint_tsc와 build 단계에서 잘 활용해볼 수 있을 것이다.

&nbsp;

### 2. 패키지들을 Matrix 변수에 넣어주자

```yml
jobs:
  lint_tsc:
    if: ${{ needs.detect_changed_packages.outputs.changed_packages != '[]' }}
    strategy:
      matrix:
        package: ${{ fromJson(needs.detect_changed_packages.outputs.changed_packages) }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run Lint
        run: pnpm --filter=${{ matrix.package }} run lint
      - name: Run TypeScript Check
        run: pnpm --filter=${{ matrix.package }} run tsc
```

우리는 `package`라는 단일 변수를 지정하여 1차원 행렬을 만든 것이다.

`packageA`와 `packageB`에 변경이 발생했다면, 다음과 같은 과정을 거치게 된다.
1. 값 `[packageA와, packageB]`를 사용하여 변수 `package`를 정의한다.
2. 워크플로우는 변수의 각 값에 대해 하나씩 총 두 개의 작업을 실행한다.
3. 각 작업은 `matrix.package` 컨텍스트를 통해 `package` 값에 액세스하고 해당 값을 하위 작업으로 전달한다.

> 빌드 과정 또한 위 작업과 동일하기에 생략해주도록 하겠다.

&nbsp;

"엇, 그럼 테스트는?"

물론 테스트 또한 위 전략을 동일하게 활용할 수 있다.
하지만 테스트에는 또 최적화를 위한 엄청난 기능이 존재하는데..

&nbsp;

## Sharding

Shard는 데이터베이스에서 사용되는 개념으로, 데이터의 수평 분할을 뜻한다.
데이터를 분산시킴으로써 병렬 처리 및 성능 향상을 가능하게 한다.
이러한 샤딩을 테스트 과정에서도 적용해볼 수 있다.

우리(프론트엔드 개발자)가 흔히 사용하는 테스트 도구인 Jest와 Vitest 모두 샤딩을 지원한다.
Vitest를 기준으로 한 번 살펴보도록 하자.

**"테스트 샤딩은 테스트 케이스를 여러 개의 작은 조각으로 나누어 한 번에 일부만 실행하는 것을 의미합니다."**

&nbsp;

사용법은 다음과 같다.

1. 테스트를 여러 번 나눠서 실행하려면, `--reporter=blob` 옵션과 함께 `--shard` 옵션을 사용하면 된다.
  ```sh
  vitest run --reporter=blob --shard=1/3 # 1st machine
  vitest run --reporter=blob --shard=2/3 # 2nd machine
  vitest run --reporter=blob --shard=3/3 # 3rd machine
  ```

2. 각 머신에서 `.vitest-reports` 디렉토리에 저장된 결과를 모은 뒤, `--merge-reports` 옵션을 사용해 병합하면 된다.
  ```sh
  vitest --merge-reports
  ```

&nbsp;

그 다음이 예상되지 않는가? 샤드의 인덱스와 샤드의 총 개수 또한 Matrix 변수로 사용해된다는 것이..

그렇다면 뭐다? 여러 변수를 지정하여 **다차원 행렬**을 만들게 되는 것이다!

![](2.jpg)

&nbsp;

### 3. Matrix를 사용하여 테스트 Sharding을 하자

```yml
jobs:
  test:
    if: ${{ needs.detect_changed_packages.outputs.changed_packages != '[]' }}
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
        package: ${{ fromJson(needs.detect_changed_packages.outputs.changed_packages) }}

    steps:
      - uses: actions/checkout@v4

      - name: Run Tests
        run: pnpm --filter=${{ matrix.package }} run test --reporter=blob --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }} --outputFile=../../.vitest-reports/blob-${{ matrix.shardIndex }}-${{ matrix.package }}.json

      - name: Upload blob report to GitHub Actions Artifacts
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: blob-${{ matrix.shardIndex }}-${{ matrix.package }}
          path: .vitest-reports/blob-${{ matrix.shardIndex }}-${{ matrix.package }}.json
          include-hidden-files: true
          retention-days: 1
```

> `--outputFile` 옵션을 디폴트로 사용할 경우, 모노레포 최상단에서 찾지 않고 각 패키지에서 `.vitest-reports` 를 찾는 문제가 있어 상대경로로 작성해주었다.

&nbsp;

행렬은 변수 순서에 따라 작업이 생성되는 순서가 결정된다.
위 작업에서 행렬은 다음과 같은 순서로 작업을 만들 것이다.
- {shardIndex: 10, shardTotal: 4, package: packageA}
- {shardIndex: 10, shardTotal: 4, package: packageB}
- {shardIndex: 12, shardTotal: 4, package: packageA}
- {shardIndex: 12, shardTotal: 4, package: packageB}
- {shardIndex: 14, shardTotal: 4, package: packageA}
- {shardIndex: 14, shardTotal: 4, package: packageB}

테스트 샤딩을 실행한 후, GitHub Actions Artifacts에 결과물을 업로드해주면 된다.

&nbsp;

그리고 마지막으로, 테스트 결과물을 병합해주자.

```yml
jobs:
  merge_reports:
    if: ${{ !cancelled() && needs.detect_changed_packages.outputs.changed_packages != '[]' }}
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Download blob reports from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: .vitest-reports
          pattern: blob-*
          merge-multiple: true

      - name: Merge reports
        run: npx vitest --merge-reports
```

test 단계에서 테스트가 깨지는 케이스가 있다면 merge_reports에서 확인할 수 있다.

&nbsp;

shard 개수가 증가할수록 부하도 증가할 수밖에 없다. matrix를 사용하는 것도 결국 각각의 VM을 띄우는 것이기에 리소스 부담이 증가하게 된다.
그러니 현재 상황에 알맞은 방식으로 문제를 해결해나가도록 하자!

&nbsp;

YAML 작성이 생소하다면 조금 어려울 수도 있는 내용일 듯하다.
> 그렇습니다. 제가 YAML이 생소합니다..😇  
> 그래서 틀리거나 비효율적인 로직이 있을 수도 있으니 감안해주시면 감사하겠습니다.  
> (피드백은 언제나 환영!)

PR/MR을 올릴 때마다 속이 터지는 경험을 하고 계신 분들께, 이 글이 도움이 되기를 바랍니다 :)

![](3.jpg)

```toc
```