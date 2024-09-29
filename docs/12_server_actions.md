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
