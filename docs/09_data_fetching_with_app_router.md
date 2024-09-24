## Data fetching with app router

### Page Router 버전에서는?

- SSR, SSG, ISR 등을 적용할 수 있는 함수를 정의한다.
- 해당 함수에서 리턴하는 값을 props로 전달 받는다.
- 최상단의 컴포넌트로부터 props를 전파해야 한다.

### App Router 에서는?

- Server Component가 추가되었기 때문에 props로 전파하지 않아도 된다.
- 클라이언트 컴포넌트에는 Async 키워드를 사용할 수 없었다. (브라우저에서 동작 시, 문제를 일으킬 수 있기 때문에 권장되지 않음)
- 즉, Server Component를 비동기 함수로 적용하여 서버 측 데이터를 요청하여 사용할 수 있다.
- `Fetching data where it's needed` = 데이터는 필요한 곳에서 직접 불러와라.

서버 컴포넌트에서 어떻게 데이터를 fetching 해올 수 있을까?
다음의 예제 코드를 보자.

```typescript
async function AllBooks() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`
  );
  if (!response.ok) return <div>오류가 발생했습니다...</div>;

  const allBooks: BookData[] = await response.json();

  return (
    <div>
      {allBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
```

데이터를 요청해오기 위해서는 `비동기 함수`로 선언되어야 하며, `async function` 키워드로 선언해야 한다. 이후, 컴포넌트 내부에서 API를 fetch 하여 데이터를 불러온다.

#### 환경 변수 적용

- `NEXT_PUBLIC_` prefix 를 붙히는 이유: 클라이언트 컴포넌트에서도 사용 가능하도록 하기 위함이다.
- 즉, `NEXT_PUBLIC_` prefix를 붙히지 않으면, 서버 컴포넌트에서만 접근하여 사용할 수 있는 환경변수로 선언된다.

### 데이터 캐시

- fetch 메서드를 활용해 불러온 데이터를 Next 서버에서 보관하는 기능이다.
- 불필요한 데이터 요청의 수를 줄일 수 있다.

데이터 캐시 기능을 사용하기 위해서는 오직 `fetch` 메서드에서만 활용이 가능하다.

`fetch` 메서드에 다양한 데이터 캐시 옵션들을 제공하는데, 다음의 설명과 예제 코드를 보자.

- `no-store`: 데이터 페칭의 결과를 저장하지 않는 옵션. 즉, 캐싱을 아예 하지 않도록 설정하는 옵션이다. (= default value)

  ```typescript
  const response = await fetch(`~/api`, { cache: "no-store" });
  ```

- `force-cache`: 요청의 결과를 무조건 캐싱. 한번 호출된 이후에는 다시는 호출되지 않는다.

  ```typescript
  const response = await fetch(`~/api`, { cache: "force-cache" });
  ```

- `next: { revalidate: 3 }`: 특정 시간을 주기로 캐시를 업데이트. 마치 Page Router의 ISR 동작과 비슷하다.

  ```typescript
  const response = await fetch(`~/api`, { next: { revalidate: 3 } });
  ```

- `next: { tags: ['a'] }`: On-Demand Revalidate. 요청이 들어왔을 때, 데이터를 최신화 한다.

  ```typescript
  const response = await fetch(`~/api`, { next: { tags: ["a"] } });
  ```

### Request Memoization

중복된 API 요청들을 자동으로 캐시처리 한다. 이는 데이터 캐시와는 다르게 동작한다.

`Request Memoization`은 하나의 페이지를 렌더링 하는 동안에 중복된 API 요청을 캐싱하기 위해 존재한다. 따라서, 렌더링이 종료되면 모든 캐시가 소멸된다.

`데이터 캐시`는 백엔드 서버로부터 불러온 데이터를 거의 영구적으로 보관하기 위해 사용되며, 서버 가동 중에는 영구적으로 보관된다.
