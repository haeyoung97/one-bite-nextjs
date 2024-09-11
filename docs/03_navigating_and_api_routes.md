## Navigating & API Routes

### Navigation

페이지를 이동하고자 할 때, html의 a 태그를 사용하기도 한다.
하지만, SPA 로 동작하는 react의 경우, navigating을 할 수 있도록 기능을 제공한다.

```typescript
import Link from "next/link";

<Link href="/">index</Link>;
```

이는 html의 a 태그와 동일하게 사용 가능하다.

### Pre-fetching

현재 사용자가 보고 있는 페이지를 기준으로 연결되어 있는 "이동 가능한 페이지"를 모두 사전에 불러오는 기능이다.
즉, 빠른 페이지 이동을 위해 제공되는 기능이다.

#### 왜 Pre-fetching이 필요할까?

> 초기 접속 요청이 완료된 이후(FCP ~ TTI 까지 완료되고 난 이후)에 "Client-side 렌더링 방식으로 처리"하고 있다고 배웠는데 왜 Pre-fetching이 필요할까?

페이지 별로 각 컴포넌트들이 분리되어 있고, 초기 접속 요청에는 현재 페이지에 필요한 js bundle 만 전달된다.

이는 다음의 장점을 유지하기 위함이다.

- 전달되는 js 코드의 양을 줄여 초기 접속 요청 시간을 줄일 수 있다.
- Js bundle 의 용량을 줄여서 수화(hydration) 시간을 줄일 수 있다.
  - Js bundle 의 용량이 커지게 되면, 수화(hydration) 과정이 늦어지기 때문이다.

페이지를 이동하려고 할 때, 해당 페이지의 코드를 요청하게 되면 비효율적으로 동작하게 된다.
그래서 pre-fetching 을 해줌으로서 "연결되어 있는 페이지"의 js bundle 을 불러온다.

이를 통해, 초기 접속 속도도 유지하면서, 수화(hydration) 시간도 유지할 수 있다.

### API Routes

NextJS app 내에서 API를 만들 수 있게 해주는 기능이다. `pages/api` 폴더 내의 모든 파일은 `/api/*`에 대응되며, page가 아닌 API 엔드포인트로 취급된다. 즉, 웹 페이지를 정의하는 것이 아니다.

```typescript
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const date = new Date();
  res.json({ time: date.toLocaleDateString() });
}
```

위와 같이 `handler` 함수를 이용하여 API 요청에 따른 `response` 를 정의할 수 있다.

### CSS styling

각 페이지 내의 `index.css` 파일을 import 해보자. 그러면 다음과 같은 에러 메시지를 확인할 수 있다.

```text
Global CSS Cannot be imported from files other then your app: 글로벌 css 파일은 App 컴포넌트가 아닌 곳에서는 불러올 수 없다.
```

이는 Next.js 의 pre-fetching 방식에 영향을 받는 부분이다. 각 페이지를 불러올 때, 연관되어 있는 css 파일을 미리 불러온다. 이 때, `className` 이 겹치는 경우가 생긴다.

이와 같은 문제 상황을 사전에 막기 위해 css styling 방식을 제한하고 있다.

#### 그렇다면, global CSS 에만 css를 정의해야 하나?

아니다. CSS Module 을 사용하여 해결할 수 있다. 다음의 코드를 보자.

```typescript
import style from "./index.module.css";

export default function Home() {
  return (
    <>
      <h1 className={style.h1}>ONEBITE CINEMA</h1>
      <h2 className={style.h2}>H2</h2>
    </>
  );
}
```

파일명을 `*.module.css` 로 작성하여 적용한다면 컴포넌트 단위로 스타일을 적용할 수 있게 된다.

`CSS module`은 클래스 이름에 hash값이 붙여 고유한 값으로 인식할 수 있도록 합니다.
