## Full Route Cache

- Next 서버 측에서 빌드 타임에 특정 페이지의 렌더링 결과(렌더링, 리퀘스트 메모이제이션, 데이터 캐시)를 캐싱하는 기능이다.
- SSG 의 기능과 동일하게 페이지를 캐싱해주는 기능이다.

- 어떤 기능을 사용하느냐에 따라 자동으로 나뉜다.
  - Static Page (정적 페이지): Dynamic Page가 아니면 정적 페이지로 관리된다. (= default)
    - 동적 함수 (쿠키, 헤더, 쿼리스트링)을 사용하지 않으면서, 데이터 캐시 기능을 사용하는 경우
  - Dynamic Page (동적 페이지): 특정 페이지가 접속 요청을 받을 때 마다 매번 변화가 생기거나, 데이터가 달라질 경우
    - 캐시되지 않는 Data fetching을 사용할 경우 (ex. no-store)
    - 동적 함수 (쿠키, 헤더, 쿼리스트링)을 사용하는 컴포넌트가 있을 경우

Static Page (정적 페이지)에 full route cache가 자동으로 적용된다.

- Dynamic Page (동적 페이지)가 안티 패턴은 아니다. Full Route Cache 기능을 사용하지 못할 뿐이지, 이외의 장점은 모두 사용 가능하다.
- Static page로 빌드 타임에 렌더링이 진행되더라도, revalidate가 적용된 로직이 포함되어 있다면 ISR 과 유사하게 동작한다.

### Change page type from Dynamic Page to Static page

예제 코드를 빌드해보면 `useSearchParams() should be wrapped in a suspense boundary` 에러가 발생하는 것을 확인할 수 있다.
이는, useSearchParams에서 제공하는 쿼리 스트링은 빌드타임에 "당연히" 없다. 즉, 해당 컴포넌트가 클라이언트 측에서만 실행되도록 설정해야 한다.

이를 해결하는 방법은 `Suspense` 컴포넌트로 감싼다.

- Suspense는 `미완성` 이라는 뜻을 가지고 있다.
- 곧바로 렌더링 되지 않고, 하위에 포함된 컴포넌트의 비동기 작업이 완료되기를 기다린다. 기다리는 동안 `fallback` props로 전달된 컴포넌트를 렌더링한다.
- 서버 측에서 빌드타임에 렌더링하려는 로직을 방지할 수 있다.

```typescript
<Suspense fallback={<div>Loading...</div>}>
  <Searchbar />
</Suspense>
```

### Dynamic Routes를 Static Page로 적용하기

`/book/[id]`와 같이 동적 라우트로 적용된 페이지의 경우, 동적 페이지로 설정된다.

이를 정적 페이지로 적용하기 위한 방법을 살펴보자.

```typescript
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
```

동적으로 제공되는 params의 정보를 static으로 정의해놓는 함수이다. 이 함수를 정의해놓는다면 빌드 타임에 미리 렌더링을 완료할 수 있으며, full route cache를 적용할 수 있다.

다음의 설정값도 추가할 수 있다.

```typescript
export const dynamicParams = false;
```

해당 값을 `false`로 설정한다면, generateStaticParams 에서 설정한 파라미터 이외의 값은 동적 라우트로 처리하지 않는다. (기본 값은 `true` 이다.)

이를 `404 not found` 로 처리하기 위해서는 다음과 같은 코드를 작성할 수 있다.

```typescript
import { notFound } from "next/navigation";

--snip--
const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${params.id}`
);
if (!response.ok) {
    if (response.status === 404) notFound();
    return <div>오류가 발생했습니다...</div>;
}
```

즉, `generateStaticParams` 에서 정의되지 않은 라우터로 접속 요청을 할 경우, status가 404로 설정되어 `Not Found` 페이지로 이동된다.
