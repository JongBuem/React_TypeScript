# React_TypeScript

<br>
- 11월 06일
  - CRA Typescript 시작
  - git branch 생성
  - 기존 소스 fork

<br>
- 11월 07일
  - 진행 파일: index.tsx, App.tsx, App.test.tsx, router/index.tsx, authConfig.ts, getData.ts
  - 기존 소스코드 컨버팅 시작
  - 맨뒤에 "!" 는 non-null assertion operator 이거는
  - ex) data.result!

<br>
- 11월 08일
  - 진행 파일: ScheduleRouter.tsx, pages/schedule/index.tsx, InfoContents.tsx, EditContents.tsx, Item.tsx
  - Items.ts 파일에 많은 component들이 있어 한번에 하기 힘들 것 같아 Item.tsx에 필요한 부분만 생성후 변경
  - tag내 map함수사용시 변수로 따로 생성함
  - ex) 생성

```javascript
interface monitoringData {
  id: string;
  name: string;
  sku: Array<any>;
  location: string;
  statuses: string;
}

const subscriptions: monitoringData[] = hostList;
```

<br>
- 11월 09일
  - 진행 파일: Item.tsx, NewContents.tsx, pages/schedule/index.tsx, schedule.constant.ts, CmwApis.ts
  - CmwApi.js에서 ts변환 과정에서 swr라이브러리의 타입설정에서 어려움이있어 다음작업 때 재시도 예정
  - 배열의 타입을 결정시 "Array<interfaceName>" 또는 "interfaceName[]" 으로 작성 할 수 있다.
  - Array<interfaceName>은 제네릭타입 쓸때
  - 제네릭타입: 타입에 유연성을 제공하여 컴포넌트 등에서 재사용을 가능하게 해주는 타입이다.
  - 아직 잘 이해가 되지 않지만, 동적으로 타입을 주고 변경 불가능하다? 라고 이해해 보겠다.

```javascript
function wrapInArray<T>(item: T): Array<T> {
  return [item];
}

const wrappedItem = wrapInArray({ id: "123" });
```

<br>
