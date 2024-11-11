# React_TypeScript

- 11월 06일

  - CRA Typescript 시작
  - git branch 생성
  - 기존 소스 fork

- 11월 07일

  - 진행 파일: index.tsx, App.tsx, App.test.tsx, router/index.tsx, authConfig.ts, getData.ts
  - 기존 소스코드 컨버팅 시작
  - 맨뒤에 "!" 는 non-null assertion operator 이거는
  - ex) data.result!

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

- 11월 09일
  - 진행 파일: pages/schedule/index.tsx, CmwApis.ts
  - type과 interface는 상속이 가능하다.

```javascript
type Person = {
  name: string,
  age: number,
};
type Student = Person & {
  school: string,
};
```

```javascript
interface Person {
  name: string;
  age: number;
}
interface Student extends Person {
  school: string;
}
```

```javascript
interface Person {
  name: string;
  age: number;
}
type Student = Person & {
  school: string,
};
```

```javascript
type Person = {
  name: string,
  age: number,
};
interface Student extends Person {
  school: string;
}
```

- type은 선언적확장이불가하다 interface는 선언적확장이 가능하다
- 선언적확장이란 동일한 이름으로 선언하면 자동으로 확장되는 것을 의미한다

```javascript
//불가능
type Person = {
  person: Person,
  name: string,
};
type Person = {
  person: Person,
  name: string,
};
```

```javascript
interface Person {
  name: string;
  age: number;
}
interface Person {
  school: string;
}
```

- type은 원시자료형에 쓰인다. (원시값, 유니언, 튜플)
- interface는 원시자료형에 사용할 수 없다.

```javascript
type name = string; // 원시값(primitive)
type age = string | number; // 유니언(union)
type middlePerson = [string, number, boolean]; // 튜플(tuple)
type highPerson = string[]; // 배열(array)
//배열: 여러 개의 데이터들을 모은 집합. 추가와 삭제가 가능하다. [ ]로 사용한다.
//튜플: 리스트와 동일하게 여러 객체를 모아서 담는다. 하지만 튜플 내의 값은 수정이 불가하다. 추가도, 삭제도 안 된다. ( )로 사용한다.
```

```javascript
//불가능
interface name = string
```

- type은 computed value 사용이 가능하다.
- interface는 computed value 사용이 불가능하다.

```javascript
type Subjects = 'math' | 'science' | 'sociology';
type Grades = {
  [key in Subjects]: string;
}
```

```javascript
type Subjects = 'math' | 'science' | 'sociology';
//매핑된 유형은 속성이나 메서드를 선언할 수 없습니다.
interface Grades {
  [key in Subjects]: string; // ❗️Error: A mapped type may not declare properties or methods.

}
```
