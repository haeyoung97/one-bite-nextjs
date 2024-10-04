## Parallel and Intercepting route

### Parallel route

- `병렬 라우트` 라고 부른다.
- 하나의 화면 안에 병렬로 페이지 컴포넌트들을 함께 렌더링하는 패턴이다.

#### Slot (슬롯)

`src/app/parallel/@sidebar`

- 병렬로 렌더링 될 페이지 컴포넌트를 보관하는 폴더로서 `@` 를 폴더 이름에 붙혀서 작성한다.
- 슬롯은 라우트 세그먼트가 아니며, URL 구조에 영향을 주지 않는다.
- 해당 폴더에 페이지 컴포넌트를 정의하게 되면, 상위의 `layout.tsx` 컴포넌트에 props로 전달된다. 즉, 폴더명인 `sidebar` 라는 이름으로 props가 전달된다.
  - 슬롯에는 갯수 제한이 없으므로, 작성하는데로 자유롭게 적용할 수 있다.

```typescript
export default function Layout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div>
      {sidebar}
      {children}
    </div>
  );
}
```

슬롯 하위에 새로운 페이지를 추가할 수 있다. 예를 들어 `src/app/parallel/@sidebar/setting/page.tsx` 와 같이 페이지를 추가 하였을 때, `/parallel/setting` 라우터에 접근할 수 있다.
해당 슬롯의 페이지만 업데이트가 되고, 해당되지 않은 슬롯의 페이지는 기존의 값을 그대로 유지한다.

페이지를 새로고침했을 경우, 해당 페이지에 처음 접속하는 것과 동일하고, 그렇기 때문에 이전 페이지의 기록을 알 수 없다. 즉, 해당 슬롯의 이전 값을 알 수 없기 때문에 404 페이지로 전달된다.

그래서 디폴트 값을 정의해놓는 것이 좋다. default 값은 `default.tsx` 파일을 생성하여 적용할 수 있다.

### Intercepting Route

- 가로채다, 뺏어가다.
- 사용자가 동일한 페이지에 접근하더라도, 특정 조건에 맞는다면 다른 라우터로 이동하도록 할 수 있다.
- 이 조건은 "초기 접속(=클라이언트 사이드 렌더링)" 여부 이다.

`src/app/(.)book/[id]/page.tsx`

`.` 의 의미는 상대 경로를 의미한다. 즉, `.` 이기 때문에 동일한 경로에 존재하는 라우터를 인터셉트 한다는 것을 의미한다.

- (.)는 동일한 수준의 세그먼트와 일치
- (..)는 한 수준 위의 세그먼트와 일치
- (..)(..)는 두 수준 위의 세그먼트와 일치
- (...)는 루트 앱 디렉토리부터의 세그먼트와 일치

사용자가 클라이언트 사이드 렌더링으로 `/book/1` 에 접속을 요청했을 때, 가로채기 조건에 맞기 때문에 가로챈 화면이 보여지게 된다.

```typescript
export default function Modal({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      dialogRef.current?.scrollTo({ top: 0 });
    }
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={style.modal}
      onClose={() => router.back()}
      onClick={(e) => {
        if ((e.target as any).nodeName === "DIALOG") router.back();
      }}
    >
      {children}
    </dialog>,
    document.getElementById("modal-root") as HTMLElement
  );
}
```

위의 예시 코드와 같이 `<dialog>` 태그와 `createPortal` 을 사용하여 모달 형태의 UI 를 구현할 수 있다.
