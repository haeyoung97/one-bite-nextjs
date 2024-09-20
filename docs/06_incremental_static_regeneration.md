## Incremental Static Regeneration

- 증분 정적 재생성
  - 단순히 SSG로 생성된 페이지의 '유통기한' 을 설정하고, 일정 주기로 페이지를 재생성 하는 것
  - SSG의 단점을 보완한 방식.
  - '유통기한' 시간 이후에 페이지를 요청할 경우, 요청 발생 시점에는 기존 페이지를 반환하고, 백그라운드에서 새로운 페이지를 재생성 해두고 그 다음 요청부터 재생성한 페이지를 전달해준다.

### 어떻게 ISR 을 적용할 수 있을까?

다음의 예제 코드를 확인해보자.

```typescript
export const getStaticProps = async () => {
  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);

  return { props: { allBooks, recoBooks }, revalidate: 3 };
};
```

`getStaticProps` 함수의 `return` 값을 보면, `revalidate` 값이 추가된 것을 확인할 수 있다.

`revalidate` 은 `재검증하다` 라는 뜻으로, 작성된 시간(초)을 기준으로 재검증을 시도한다.

### On-Demand ISR

매우 빠른 속도로 응답이 가능하고, 최신 데이터를 반영할 수 있다.
시간 기반의 ISR 을 적용하기 어려운 페이지도 존재한다.

- 즉, 사용자의 동작에 따라 페이지가 변경되어야 하는 경우, 불필요한 페이지 재생성 로직을 수행하거나 최신 정보를 제공하기 어려울 수 있다.

요청을 받을 때 마다 페이지를 다시 생성하는 ISR 을 `On-Demand ISR` 이라고 부른다.

- 즉, 페이지 재생성 요청을 직접 전달하는 방식이다.

`On-Demand ISR` 를 적용하는 방법을 알아보기 위해, 다음의 예제 코드를 살펴보자.

```typescript
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await res.revalidate("/"); // 전달되는 경로를 revalidate 적용한다.
    return res.json({ revalidate: true });
  } catch (err) {
    res.status(500).send("Revalidation Failed");
  }
}
```

`revalidate` 요청 (즉, 재생성 요청)을 전달하기 위해서 `api` 의 `handler` 를 작성한다. 이 `handler`에서는 `await res.revalidate("/")` 와 같이 `revalidate` 함수를 호출한다. 이 함수의 파라미터로는 "재 생성을 요청하는 페이지의 경로" 를 작성한다.

이 함수를 정의해두고 해당 `api` 를 호출하게 되면 전달된 경로의 페이지를 재생성한다.

### SEO 설정하기

"next/head"의 `Head` 태그를 사용하여 설정할 수 있다.

다음의 예제 코드를 보자.

```typescript
return (
  <>
    <Head>
      <title>{title}</title>
      <meta property="og:image" content={coverImgUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
    <div className={style.container}></div>
  </>
);
```

`Head` 태그 내부에 SEO 를 위한 기본적인 정보를 작성할 수 있다.

#### 또한, `Head` 태그 내부에 동적으로 불러온 데이터를 적용하고 싶을 때는 어떻게 할까?

SSG 페이지로 동작할 때, 적용할 수 있다.

- 즉, `getStaticPaths` 로 설정한 경로들은 사전에 페이지를 생성해두기 때문에 동적으로 불러온 데이터를 적용할 수 있다.
- 다만, 사전에 생성하지 않은 페이지는 SEO 정보를 확인할 수 없다.
  - fallback 상태가 끝났을 때, SEO 정보를 적용할 수 있기 때문에 `router.isFallback` 조건문에서는 "기본적인 SEO 설정 태그"를 작성해두는 것도 좋다.
