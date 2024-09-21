## App Router 란?

- React 18 신규 기능 추가
- 데이터 페칭 방식 변경
- 레이아웃 설정 방식 변경
- 페이지 라우팅 설정 방식 변경

### app 폴더 를 통해 페이지 라우터를 구성한다.

- app/page.tsx : `/` 라우터를 구성한다.
- app/search/page.tsx : `/search` 라우터를 구성한다.
- app/book/[id]/page.tsx : `/book/1` 라우터를 구성한다.

### 레이아웃 설정하기

- 특정 파일 하위에 `layout.tsx` 파일을 생성하게 되면, 해당 라우터 하위의 모든 파일에 적용되는 레이아웃을 구성할 수 있다.
- 중첩 라우터 구조에서 `layout.tsx` 파일이 각 라우터 하위에 존재한다면, 설정된 `layout` 이 모두 중첩되어 표현된다.
  - 즉, `app/search/layout.tsx` 와 `app/search/setting/layout.tsx` 파일이 있다면, `app/search/setting/page.tsx` 라우터는 두 개의 레이아웃 구성이 모두 적용된다.

### 여러 라우터 중 일부에 공통되는 레이아웃을 적용하고 싶다면?

Route Group을 설정하면 된다. `Router Group` 을 설정하기 위해서는 폴더명을 `()` 로 묶어서 표현하면 된다.
`()`로 묶인 것은 라우터로 인식하지 않고 그룹을 만들어 준다.
즉, `(with-searchbar)` 라는 폴더 하위에 라우터들을 구성하게 되면, 해당 폴더 하위에 존재하는 라우터는 공통된 `layout.tsx` 파일을 적용할 수 있다.
