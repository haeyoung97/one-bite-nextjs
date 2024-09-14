## Server Side Rendering

### Data Fetching

기존의 리액트는 서버로부터 어떻게 데이터 패칭을 해왔을까?

1. 불러온 데이터를 보관할 state 를 생성한다.
2. 데이터 페칭 함수를 생성 한다. (= fetchData)
3. 컴포넌트 마운트 시점에 호출할 수 있도록 useEffect 함수를 사용한다.
4. 데이터 로딩 중일 때는 예외 처리로 UI 를 처리한다.

이 방식에는 단점이 존재한다.

- 초기 접속 요청부터 데이터 로딩까지 오랜 시간이 걸린다.
- 컴포넌트 마운트가 되고 난 이후에 useEffect 함수를 이용하여 데이터를 요청하기 때문이다.
- 즉, FCP 이후에 데이터를 요청하고 기다려야 한다. (= API request & response)

그렇다면 next.js 는 어떻게 해결하고 있을까?

- 사전 렌더링 기술을 이용하여 단점을 극복한다.
- JS 실행 (렌더링) 과정에서 API request & response 를 교환한다.
- 즉, 이미 데이터 페칭이 완료된 js bundle 을 받는다.

그렇다면, 여기서 질문! API request & response 가 오래걸린다면?

- Next.js 는 사전 렌더링이 오래걸릴 것 같다면, 빌드 타임(build time)에 사전 렌더링을 미리 진행한다.
- 다음과 같이 3가지의 사전 렌더링 기능을 제공한다.
  1. 서버 사이드 렌더링 (SSR)
     - 요청이 들어올 때 마다 사전 렌더링을 진행 함.
  2. 정적 사이트 생성 (SSG)
     - 빌드 타임에 미리 페이지를 사전 렌더링 해 둠.
  3. 증분 정적 재생성 (ISR)

### SSR (서버 사이드 렌더링) 방식이란?

- 요청이 들어올 때 마다 사전 렌더링을 진행 함.

다음의 함수 예제를 보자.

```typescript
export const getServerSideProps = () => {
  const data = "hello";
  return {
    props: { data },
  };
};
```

위의 함수를 작성하게 되면, SSR 방식으로 진행될 것임을 암시한다.
즉, 서버 사이드에서 실행될 함수의 이름을 `getServerSideProps` 로 약속하고, 이 함수를 만들어서 export 하면 해당 파일을 서버 사이드에서 실행될 것으로 인식하게 만든다.

정리를 해보자면 다음과 같은 특징이 있다.

1. 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터를 불러온다.
2. 브라우저를 읽어올 수 없다. 즉, `getServerSideProps` 함수는 서버 사이드에서 실행이 되기 때문에 `window`와 같은 객체를 읽어 올 수 없다.
3. 컴포넌트는 총 2번 렌더링 된다. 서버에서 렌더링 되면서 1번, 브라우저에서 렌더링 되면서 1번 호출되기 때문이다.

- 만약, 서버 사이드에서 렌더링 되는 컴포넌트에서 window 객체를 사용하고자 한다면, useEffect 를 작성하고 `window.location` 등을 호출하면 정상적으로 동작한다.
- useEffect 는 브라우저 환경에서 동작할 것이기 때문이다.

### SSR 에서 API 요청 방법

다음의 예제 코드를 보자.

```typescript
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const q = context.query.q;
  const books = await fetchBooks(q as string);
  return { props: { books } };
};

export default function Page({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <></>;
}
```

`getServerSideProps` 함수에서 `GetServerSidePropsContext` 타입의 `context` 값을 가져올 수 있다.
이는 사용자가 브라우저에 요청한 내용을 얻을 수 있는 property 이다.

`getServerSideProps` 함수에서 리턴한 값을 컴포넌트에서 사용할 수 있다.
사용하기 위해서는 `InferGetServerSidePropsType<typeof getServerSideProps>` 과 같은 타입을 명시하고, props 로 전달된 값을 사용하면 된다.
