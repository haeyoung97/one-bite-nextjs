## Page Router 란?

- React Router 처럼 페이지 라우팅 기능을 제공한다.

### Pages folder structure

- Pages 폴더 구조를 기반으로 라우팅을 진행한다.
- 파일 혹은 폴더 명 기반으로 라우터를 구성하게 되며, 하위에 js 파일을 존재 시킨다.
  - typescript 로 개발할 경우, 하위에 ts 파일이 존재하게 된다.
- 파일 혹은 폴더 명 기반으로 라우터를 구성할 수 있으며, 다음과 같이 작성할 수 있다.
  - 파일로 라우터를 구성할 경우
    - `~/` 에 접속하게 되면, `pages/index.js` 가 실행된다.
    - `~/about` 에 접속하게 되면, `pages/about.js` 가 실행된다.
  - 폴더로 라우터를 구성할 경우
    - `pages/index.js` 으로 폴더 및 파일을 구성할 경우, `~/` 에 접속 가능하다.
    - `pages/about/index.js` 으로 폴더 및 파일을 구성할 경우, `~/about` 에 접속 가능하다.
- 동적 경로 (Dynamic Routes)도 설정할 수 있으며, 다음과 같이 작성한다.
  - `pages/item/[id].js` 와 같이 폴더 및 파일을 구성하게 되면, `~/item/1` `~/item/001` 등과 같이 동적 경로로 접속할 수 있다.

> Page Router의 경우, 14 버전에서 안정적으로 사용이 가능하다.

### Next.js v4 의 기본 구조

#### public folder

- 정적인 파일들이 보관되어 있다.

#### src folder

- pages 와 관련된 코드들이 모아져 있다.
- react와 비슷하게 pages 와 관련된 코드 및 컴포넌트들을 작성할 수 있다.

#### src/pages folder

- \_app.tsx

  - react에 존재하는 app component와 동일한 기능을 수행한다.
  - 즉, 모든 컴포넌트들의 root (부모) 컴포넌트이며 그 기능을 수행한다.

    ```typescript
    export default function App({ Component, pageProps }: AppProps) {
      return <Component {...pageProps} />;
    }
    ```

    - Component: page 역할을 할 컴포넌트
    - pageProps: page 역할을 할 컴포넌트의 props

  - \_app.tsx 를 활용하면, 공통으로 사용되는 비즈니스 로직을 적용할 수 있다.

- \_documemt.tsx
  - 모든 페이지에 공통으로 적용되어야 하는 html 의 코드이다.
  - react의 index.html 파일과 동일한 역할을 수행한다.

#### src/pagnext.config.mjs

- next.js 의 config 를 설정하는 파일이다.
- `reactStrictMode: false`로 설정한 이유
  - react는 application에 존재하는 잠재적인 문제를 해결하고자 할 때, 렌더링을 2번 하게 된다. (즉, `useEffect`, `console.log` 등등이 2번 실행 됨.)

### ReatStrictMode

#### reactStrictMode 란?

- react의 Strict Mode는 application 에서 잠재적인 문제를 강조하기 위한 개발 모드 전용 기능이다.
- nextjs가 아닌, react에서 관련 부분은 <Reacrt.StrictMode>를 하는 것과 같다고 할 수 있다.

#### Why react strictmode render twice?

> React는 작성하는 모든 구성 요소가 순수 함수라고 가정합니다. 즉, 작성하는 React 구성 요소는 동일한 입력(props, state 및 context)이 주어지면 항상 동일한 JSX를 반환해야 합니다.
> 이 규칙을 위반하는 구성 요소는 예기치 않게 동작하여 버그를 일으킵니다. 실수로 순수하지 않은 코드를 찾는 데 도움이 되도록 엄격 모드는 개발 중에 일부 함수(순수해야 하는 함수만)를 두 번 호출합니다. 여기에는 다음이 포함됩니다.

- 구성 요소 함수 본문 (최상위 논리만 있으므로 이벤트 핸들러 내부의 코드는 포함되지 않음)
- useState, setfunctions , useMemo또는 에 전달하는 함수useReducer
- constructor, render, 같은 일부 클래스 구성 요소 메서드 shouldComponentUpdate( 전체 목록 참조 )

> 함수가 순수한 경우 순수한 함수는 매번 동일한 결과를 생성하기 때문에 함수를 두 번 실행해도 동작이 변경되지 않습니다. 그러나 함수가 순수하지 않은 경우(예를 들어, 수신하는 데이터를 변경하는 경우) 그 순수하지 않은 코드를 두 번 실행하는 것은 눈에 띄는 경향이 있습니다(그것이 함수를 순수하지 않게 만듭니다!) 이렇게 하면 버그를 조기에 발견하고 수정하는 데 도움이 됩니다.

### Dynamic Routes

#### useRouter 사용 방법

- next.js 의 v4에서는 다음과 같이 `useRouter`를 import 하여 사용할 수 있다.

  ```typescript
  import { useRouter } from "next/router";
  ```

- next.js 의 v5에서는 다음과 같이 `useRouter`를 import 하여 사용할 수 있다.

  ```typescript
  import { useRouter } from "next/navigation";
  ```

- query string 값은 다음과 같이 얻어올 수 있다.

  ```typescript
  export default function Page() {
    const router = useRouter();
    const { q } = router.query;

    return <h1>Search {q}</h1>;
  }
  ```

#### Dynamic Segments

[id].tsx

- router의 query로 값을 얻어올 수 있다.

  ```typescript
  const router = useRouter();
  const { id } = router.query;
  ```

#### Catch-all Segments

[...id].tsx

- 모든 구간에 대응하는 라우더로 설정할 수 있다.
  - 즉, `pages/book/[...id].tsx`로 적용 시 `~/book/12/34/56/78` 과 같이 router에 접근할 수 있다.
  - query의 값은 배열 형태로 전달 된다.
- 단. `index.tsx` (`~/book`)는 대응해주지 못한다.

#### Optional Catch-all Segments

[[...id]].tsx

- 모든 구간에 대응 + `index.tsx` 대응 하는 라우터로 설정할 수 있다.
  - 즉, `pages/book/[[...id]].tsx`로 적용 시 `~/book/12/34/56/78` 및 `~/book` 모두 router에 접근할 수 있다.
