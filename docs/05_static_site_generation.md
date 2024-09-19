## Static Site Generation

Server Side Rendering 의 단점

- 데이터 요청이 늦어질 경우, 모든 것이 늦어진다.

### Static Site Generation 란?

- 빌드 타임에 페이지를 미리 사전 렌더링 해두는 방식.
- 데이터 요청이 늦어지더라도, 사용자의 경험에는 불편함을 초래하지 않음.

> 즉, 사전 렌더링에 많은 시간이 소요되는 페이지더라도 사용자의 요청에는 매우 빠른 속도로 응답이 가능하다.
> 단, 매번 똑같은 페이지만 응답하며 최신 데이터 반영은 어렵다.

개발 모드에서는 매번 빌드해서 변경점 표시
prduction 레벨에서 실행해보면 빌드타임에서 1번만 호출되는 것을 확인할 수 있음.

> SSG 에서 query 값을 알 수 있을까?

- 빌드 타임에는 query 값을 알 수 없다.
- 런타임에서 query 값을 직접 사용하는 로직으로 변경해야 한다. (useEffect, useState 활용)

### 다이나믹 페이지 (Dynamic page)

- 사전 렌더링을 하기 위해서 `경로 설정하기` -> `사전 렌더링` 과정이 필요하다.
- 즉, 어떤 경로들이 존재할 수 있는지 파악할 수 있어야 한다.
- getStaticPaths 함수를 이용하여 존재할 수 있는 경로를 설정해두어야 한다.

다음의 예제를 보자.

```typescript
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { id: "1" } }, // 반드시 문자열로 설정해야 한다.
      { params: { id: "2" } },
      { params: { id: "3" } },
      { params: { id: "4" } },
    ],
    fallback: false,
  };
};
```

어떤 경로들이 존재하는지 설정하기 위해서는 `getStaticPaths` 함수를 작성해야 한다.

> fallback 옵션에 대해 알아보자.

- false: 404 Not Found 반환.
- blocking: 즉시 생성 (Like SSR) > `fallback: "blocking"`
  - 최초 요청 시, 렌더링되는데 시간이 걸릴 수 있다.
  - 재요청할 때에는 저장된 페이지를 빠르게 반환한다.
  - 페이지의 크기가 크다면, 요청된 결과를 받아오는 데 시간이 걸릴 수 있다. 이럴 경우, `true` 옵션을 사용한다.
- true: 즉시 생성 + 페이지만 미리 반환.
  - props (getStaticProps 로 전달 받는 값) 가 없는 페이지를 먼저 반환한다.
  - 즉, 데이터가 없는 상태의 페이지 렌더링을 먼저 진행한다.

#### `blocking` 또는 `true` 로 설정 시, 페이지를 불러오고 있을 때는 다음과 같이 처리해보자.

```typescript
const router = useRouter();
if (router.isFallback) return "로딩 중입니다.";
```

`router` 객체가 제공하는 `isFallback` 을 이용하여 fallback 처리 중인이 여부를 확인할 수 있다.

#### `존재하지 않은 데이터` 를 요청했을 때, 어떻게 처리하면 좋을까?

```typescript
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id));

  if (!book) return { notFound: true };
  return { props: { book } };
};
```

`getStaticProps` 의 return 값을 `{ notFound: true }` 로 설정한다면, `Not Found` 페이지로 리다이렉트 시켜줄 것이다.
