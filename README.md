# React_TypeScript

- 11월 17일

  - 진행 파일: schedule.constant.ts, pages/schedule/components/LeftContents.tsx
  - schedule.constant.ts export를 export default로 변경

- 11월 16일

  - 진행 파일: schedule.constant.ts
  - enum vs as const : Typescript에서 가독성을 높이기 위한 일환으로 서로 연관된 상수들을 하나의 namespace에 묶어 관리할 때, enum키워드를 사용해 Enum type을 선언하거나 객체 리터럴에 as const라는 type assertion을 사용합니다. 그렇지만 두 문법엔 차이점이 있다.
  - enum: 다른 언어의 Enumeration 문법처럼 서로 연관된 상수들을 하나의 namespace로 묶어 추상화시키기 위해 도입된 것입니다. 이를 통해 코드만 보더라도 의도를 명확히 알 수 있어 가독성을 높일 수 있습니다.
  - 그렇지만 enum은 Tree-shaking이 되지않는다.
  - Tree-shaking: 사용하지 않는 코드를 제거하여 코드를 가볍게 만드는 최적화 과정을 말한다.
  - 정리하자면 번들러과정에서 데드코드를 제거해야하는데 enum은 실제 컴파일된 코드에서는 enum 코드가 살아 있게 된다.
  - as const: type assertion의 한 종류로써 리터럴 타입의 추론 범위를 줄이고 값의 재할당을 막기 위한 목적으로 만들어졌습니다. 특히 object나 array 타입의 경우 참조 타입이 아니기 때문에 const로 선언하더라도 내부 프로퍼티의 추론범위가 한정되지도 않고 변경된다. 그래서 as const를 사용하여 객체의 모든 프로퍼티들을 readonly로 변경하고 각 프로퍼티의 타입이 할당된 값으로 추론시킨다.
  - 이렇듯, as const를 사용하면 원시 타입이든 참조 타입이든 값의 재할당을 막아버리기 때문에 의도치 않은 변경으로 인한 오류를 없앨 수 있습니다. 또한, 리터럴 타입의 추론 범위가 리터럴 값 자체로 한정되면서 좀 더 안전하게 코드를 작성할 수 있다.
  - 그래서 as const와 enum중 어떤 선택이 정답인지 물어본다면 이는 회사의 정책또는 팀에따라 다를 것이라고 생각한다. enum의 단점이 정말 서비스에 크리티컬한 데미지를 줄 수 있는지에 대한 계산이 가능할까? 라는 의문과 이미 다른 language에서는 대체적으로 많이 쓰이고 있기때문에 리딩시 enum은 상수구나 라고 바로 알 수 있기 때문이다.

- 11월 14일

  - 진행 파일: pages/schedule/components/Tab.tsx, pages/schedule/components/Item.tsx, log.constant.ts
  - Tab.tsx파일 오류 수정
  - 어제 ts변환중 new Set()관련해서 TS2802 오류코드에 대해서 알아보았다.
  - 해당 오류는 ES6기능을 사용하여 배열을 유니크한 값으로 변환하려고 할 때 TypeScript에서 발생하는 문제입니다.
  - 해결방법은 tsconfig.json에 "target": "es2015" 또는 "downlevelIteration": true 를 추가 하면된다.
  - 그리고 문득 반복문으로(List) 유니크한 값을 찾는 것과 Set을 사용하는 것중 어느것이 더빠른지 찾아보았다.
  - List: 중복을 검사하기위해 모든 요소를 비교해야하므로 시간복잡도는 O(n^2)
  - Set: 내부적으로 해시를 사용해 데이터를 저장하기 때문에, 요소 추가와 중복 검사의 시간복잡도는 O(n)

- 11월 13일

  - 진행 파일: pages/schedule/components/Tab.tsx, pages/schedule/components/Item.tsx, log.constant.ts
  - namespace는 사용하지 않는편이 좋겠다.
  - 우리는 export를 통해 이미 모듈을 import로 네이밍 하고있다.
    그래서 namespace로 래핑하는 경우는 일반적으로 불필요하다고 생각한다. ...구지?
    그 이유는 모듈을 사용할 때 추가적인 레벨의 간접참조를 추가하게 된다.
    그러면 시스템이 확장 될수록 중첩 레이어를 과도하게 추가될 수 있는 경향이 있다.

  - namespace를 지정하는 일반적인 목적은 구조의 논리적 그룹을 제공하고 이름 충돌을 방지하기 위함입니다.
    모듈 파일이 이미 스스로 논리적 그룹을 형성하고 있기 때문에, 최상위 이름은 이를 가져오는 코드에 의해 정의되고
    내보내는 객체를 위한 추가적인 모듈 계층을 사용할 필요가 없습니다.
    참고자료 : https://typescript-kr.github.io/pages/namespaces-and-modules.html

```javascript
//shapes.ts
export namespace Shapes {
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
}
```

```javascript
//shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
```

- 11월 12일

  - 진행 파일: pages/monitoring/index.tsx
  - 아키텍처변경: 도메인별 기능 아키텍처로 변경

- 11월 11일
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

- 11월 07일

  - 진행 파일: index.tsx, App.tsx, App.test.tsx, router/index.tsx, authConfig.ts, getData.ts
  - 기존 소스코드 컨버팅 시작
  - 맨뒤에 "!" 는 non-null assertion operator 이거는
  - ex) data.result!

- 11월 06일

  - CRA Typescript 시작
  - git branch 생성
  - 기존 소스 fork
