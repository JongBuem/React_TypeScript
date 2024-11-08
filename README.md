# React_TypeScript

- 11월 06일

  - CRA Typescript 시작
  - git branch 생성
  - 기존 소스 fork

- 11월 07일

  - 기존 소스코드 컨버팅 시작
  - 맨뒤에 "!" 는 non-null assertion operator 이거는
  - ex) data.result!
  - 1차 진행 파일: index.tsx, App.tsx, App.test.tsx, router/index.tsx, auth/authConfig.ts, auth/getData.ts,
  - 2차 진행 파일: router/index.tsx, auth/authConfig.ts, auth/getData.ts,

- 11월 08일
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

- 1차 진행 파일: router/ScheduleRouter.tsx, pages/schedule/index.tsx, components/schedule/InfoContents.tsx, components/schedule/EditContents.tsx,
- 2차 진행 파일: components/schedule/EditContents.tsx, Item.tsx
