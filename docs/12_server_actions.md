## Server Actions

- 브라우저에서 호출할 수 있는 서버에서 실행되는 비동기 함수
- Server Actions are asynchronous functions that are executed on the server.

```typescript
export default function Page() {
  const saveName = async (formData: FormData) => {
    "use server"; // 서버에서 동작하는 함수임을 명시한다.
    const name = formData.get("name");
    await aql`INSERT INTO Names (name) VALUES (${name})`;
  };

  return (
    <form action={saveName}>
      <input name="name" placeholder="이름을 알려주세요..." />
      <button type="submit">제출</button>
    </form>
  );
}
```

`use server` 지시자를 명시하게 되면, 서버에서 실행되는 함수임을 정의한다. 즉, 서버 액션을 정의한다.

서버 액션을 만들고, 호출하게 되면 https request가 전달된다. request header에 Next-Action이라는 프로퍼티를 통해 해시 값이 전달되며, payload에 ACTION_ID (해시값)이 포함된다.

코드가 매우 간결해진다. 서버 측에서만 실행되기 때문에 보안상 민감한 데이터를 다룰 때 편리하게 사용할 수 있다.

### 재검증 요청

`revalidatePath` 함수

넥스트 서버 측에 재검증을 요청하는 기능을 수행한다. 즉, 해당 페이지가 재생성되고 다시 렌더링이 된다.
이 함수는 오직 서버측에서만 실행할 수 있기 때문에 클라이언트 컴포넌트에서는 호출할 수 없다.

함수에 전달되는 경로의 페이지에 대해서 다시 재검증/재요청을 하는 것이다. 즉, 데이터 캐시도 함께 무효화된다. (`cache: "force-cache"` 로 설정되어도 무효화가 된다.)

풀 라우트 캐시와 데이터 캐시를 모두 purge 하고, 각종 fetch 를 다시 진행한다. 그리고 이 때에는 풀 라우트 캐시를 업데이트 하지 않는다. 이후에 새로 고침 등과 같이 사용자가 해당 페이지를 다시 요청했을 때에는 풀 라우트 캐시를 업데이트 한다.

#### 다양한 재검증 방식

1. 특정 주소의 해당하는 페이지만 재검증

```typescript
revalidatePath(`/book/${bookId}`);
```

2. 특정 경로의 모든 동적 페이지를 재검증

```typescript
revalidatePath(`/book/[id]`, "page"); // 폴더/파일의 경로를 명시해야 한다.
```

3. 특정 레이아웃을 갖는 모든 페이지 재검증

```typescript
revalidatePath(`/(with-searchbar)`, "layout"); // 폴더/파일의 경로를 명시해야 한다.
```

4. 모든 데이터 재검증

```typescript
revalidatePath(`/`, "layout"); // 폴더/파일의 경로를 명시해야 한다.
```

5. 태그 기준, 데이터 캐시 재검증

```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`,
  { next: { tags: [`review-${bookId}`] } }
);

revalidateTag(`review-${bookId}`); // 해당 태그를 가진 모든 데이터 캐시를 재검증한다.
```

### 클라이언트 컴포넌트에서 서버 액션 사용하기.

로딩 상태를 클라이언트 컴포넌트에 표시해보자. 이를 위해서 react v19 부터 제공되는 `useActionState` 을 사용하면 된다.

```typescript
const [state, formAction, isPending] = useActionState(createReviewAction, null);
```

`useActionState`는 폼 액션의 결과를 기반으로 `state`를 업데이트할 수 있도록 제공하는 Hook 입니다.

Hook의 리턴 값으로 제공되는 `state`는 폼을 마지막으로 제출했을 때 액션(= `formAction`)에서 반환되는 값입니다. 폼이 제출되기 전이라면 전달한 초기 state (= `null`)와 같습니다.

Server Action과 함께 사용하는 경우, `useActionState`를 사용하여 hydration이 완료되기 전에도 폼 제출에 대한 서버의 응답을 보여줄 수 있습니다.
