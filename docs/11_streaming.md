## Streaming

- 큰 용량의 동영상을 아주 빠른 속도로 시청할 수 있게 해준다.
  - 서버에서 클라이언트로 데이터를 넘겨주어야 할 때, 데이터를 잘게 쪼개서 연속적으로 전송하는 것이다.
  - 클라이언트 측에서는 전달된 데이터를 먼저 재생할 수 있다.

Next.js 의 경우, 자체적으로 스트리밍 기능을 제공하고 있다.

- 스트리밍을 이용하게 되면, 뭐라도 빠르게 보여줄 수 있다. (= 비동기 작업이 없는 UI)
- 비동기적으로 불러오는 페이지의 경우, 로딩화면으로 처리할 수 있다.

Streaming 은 Dynamic Page 에 자주 사용된다.

- 빌드타임에는 생성되지 않기 때문에 새롭게 렌더링을 진행해주어야 한다.
  - 오래 걸리지 않는 컴포넌트를 빠르게 렌더링한다.
  - 비동기 작업이 완료되면 후속으로 렌더링을 진행한다.

즉, 오래 걸리는 컴포넌트의 렌더링을 사용자가 좀 더 좋은 환경에서 기다릴 수 있도록 설정해준다.

### 페이지 스트리밍 적용

페이지 스트리밍을 적용하고자 한다면, 해당 경로 하위에 `loading.tsx` 로 파일명을 정의하고 로딩 화면을 구현해야 한다.
즉, 동일한 페이지 라우터 경로에 정의를 한다.

그러면 해당 라우터 하위의 모든 페이지가 스트리밍될 때, 자동으로 해당 컴포넌트를 보여준다.

```typescript
// loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

위와 같이 페이지 스트리밍을 적용할 때, 주의할 점이 있다.

1. 동일한 페이지 하위 경로에 모두 적용된다. 즉, 적용되는 범위가 `layout.tsx` 파일과 동일하다.
2. `async` 로 정의된 페이지 컴포넌트에만 적용된다. 즉, 비동기 컴포넌트에만 로딩화면이 적용된다.
3. 페이지 컴포넌트에만 적용된다. 일반적인 컴포넌트에는 적용할 수 없다.
   - 별도의 컴포넌트에도 적용하고 싶다면, react 의 `<Suspense>` 컴포넌트를 이용해야 한다.
4. 경로 변경이 아닌, 쿼리스트링이 변경될 때는 스트리밍 트리거가 적용되지 않는다.
   - 이 상황에도 적용하고 싶다면, react 의 `<Suspense>` 컴포넌트를 이용해야 한다.

> 쿼리 스트링이 변경될 때에도 적용하는 방법을 알아보자.

```typescript
<Suspense key={searchParams.q || ""} fallback={<div>Loading...</div>}>
  <SearchResult q={searchParams.q || ""} />
</Suspense>
```

`Suspense` 는 최초 한번만 렌더링 된다. 이 때, key 값이 달라지면 새로운 컴포넌트로 인식하게 된다.
즉, key 값을 적용을 한다면 react는 컴포넌트 렌더링을 새롭게 진행한다.\

추가적으로 `Suspense` 를 적용하기 위해서는 dynamic 페이지로 변경해주어야 한다. Static 페이지의 경우 빌드 타임에서 미리 불러오기 때문에 비동기 작업이 없으며, streaming이 동작하지 않는다.

이는 `dynamic` 변수를 통해 적용할 수 있다. (`export const dynamic = "force-dynamic";`)

### 에러 핸들링

에러를 핸들링하기 위해서는 `error.tsx` 파일을 적용하고자 하는 경로에 추가하면 된다. 에러 컴포넌트의 props 로는 `error`, `reset` 등의 값이 있다.

이는 `layout.tsx` 의 적용범위와 동일하게 동작한다. 즉, 중첩된 라우트 안에서 우아하게 런타임 에러를 핸들링할 수 있게 도와준다.

이 에러 핸들링을 위한 컴포넌트는 `클라이언트 컴포넌트` 로 정의되어야 한다. 이는 클라이언트 환경이던 서버 환경이던 에러를 핸들링할 수 있어야 하기 때문이다.

다음의 예시 코드를 보자.

```typescript
"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh();
            reset();
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
```

특히, `onClick` 함수를 보자.

`reset()` 함수의 경우, 에러 상태를 초기화 하고 컴포넌트를 다시 렌더링하도록 동작한다. 하지만, 서버 측에서 실행되는 서버 컴포넌트의 경우, 다시 시도를 하더라도 서버에 캐시된 정보를 보이게 한다. 그래서 `window.location.reload()` 와 같이 화면을 새로 고침하는 로직을 사용해야 한다. 이를 우아하게 처리하기 위해서 `useRouter` 를 사용할 수 있다.

`useRouter`의 `refresh` 함수는 현재 페이지에 필요한 서버 컴포넌트를 Next 서버에 다시 실행해달라고 요청하는 행위를 한다. 또한, 페이지 전체를 새로고침하지 않고 현재 상태를 유지하면서 데이터만 업데이트하고 싶을 때 사용할 수 있다.

#### startTransition 함수

```typescript
startTransition(scope);
```

`scope: () => void` : scope 함수 내부에서는 1개 이상의 set 함수(useState의 반환 값 중 set 함수)가 호출되어야 한다. scope 함수는 즉시 실행되며, 내부에서 호출한 상태 업데이트들은 모두 Transition updates로 처리됩니다. 즉, UI를 non-blocking하며 상태를 업데이트할 수 있게 해준다.

따라서, 위의 예제 코드에서 `startTransition` 을 적용하게 된 이유는 다음과 같다.

Suspense 컴포넌트의 fallback을 활용해 로딩 UI를 만들 수 있다. 그런데, 로딩 UI가 전체 UI 를 다 가리고 표현되면 사용자의 경험을 헤치게된다.
UI를 변경하는 동작을 startTransiton으로 감싸준다면 이 동작은 기존 UI를 blocking하지 않기 때문에 사용자의 경험을 유지할 수 있다.
