# 모듈 내보내고 가져오기

## 선언부 앞에 export 붙이기

```js
// 배열 내보내기
export let month = ["Jan", "Feb", "Mar"];

// 상수 내보내기
export const MODULES_BECAME_STANDARD_YEAR = 2015;

// 클래스 내보내기
export class User {
  constructor(name) {
    this.name = name;
  }
}
```

`export class` 나 `export function` 뒤에는 세미콜론을 붙이지 않는다.

## 선언부와 떨어진 곳에 export 붙이기

```js
// say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

export { sayHi, sayBye };
```

## import \*

무언갈 가져오고 싶을 때

```js
import { sayHi, sayBye } from "./say.js";

sayHi("John");
sayBye("John");
```

```js
import * as say from "./say.js";

say.sayHi("John");
say.sayBye("John");
```

편하긴 하지만 구체적으로 무엇을 가져올지 명시적으로 알려주는것이 좋다.

1. 웹팩과 같은 모던 빌드 툴은 로딩 속도를 높이기 위해 모듈들을 한데 모으는 번들링과 최적화를 수행한다. 이 과정에서 사용하지 않는 리소스가 삭제되기도 한다.
2. 더 간결하게 적을 수 있다.
3. 어디에 어떤게 쓰이는지 명확하기 때문에 리팩토링이나 유지보수에 도움이 된다.

## import 'as'

```js
import { sayHi as hi, sayBye as bye } from "./say.js";

hi("John");
bye("John");
```

## Export 'as'

이름 바꿔서 내보낼 수 있다.

```js
export { sayHi as hi, sayBye as bye };
```

## export default

`export default` 라는 특별한 문법을 지원한다. 이는 해당 모듈엔 개체가 하나만 있다는 사실을 명백히 나타낼 수 있다.

```js
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

보통 파일 하나엔 `export default`가 하나만 있다.

이렇게 내보내면 `import` 에서 `{}`를 제거할 수 있다.

```js
import User from "./user.js"; // {User} 가 아니라 User 이다.

new User("John");
```

이름으로 가져오는 방식을 `named export`라고 한다.

파일 하나에 `named export`와 `export default`를 함께 사용해도 문제가 되지는 않는다. 하지만 실무에선 파일 하나에 둘중 하나만 사용하는 것이 일반적이다.

또한 `export default`의 경우에는 중괄호 없이 내보낼 것이 하나밖에 없다고 정한 것이기 때문에 이름없이 내보내는것이 가능하다. 하지만 `named export`에서는 이름을 반드시 명시해 주어야 한다.

### `default` name

```js
function sayHi(user) {
  alert(`Hello, ${user}`);
}

// 함수 선언분에 export default 한 것과 똑같다.
export { sayHi as default };
```

흔하진 않지만 default를 사용해서 동시에 가져올 수 있다.

```js
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}`);
}
```

```js
import { default as User, sayHi } from "./user.js";

// 혹은

import * as user from "./user.js";

let User = user.default;
new User("John");
```

### default export 의 이름에 관한 규칙

default export 는 꼭 파일내에서 내보내는 이름으로 불러오지 않아도 되기 때문에 같은 모듈이라도 사용하는 사람에 따라서 불러온 이름이 다를 수 있다. 이는 혼란을 야기할 수 있는데 이것을 방지하기 위해서 이름을 정하는 규칙이 있다.
보통 파일이름에 첫 글자는 대문자인 형식으로 사용한다.

## 모듈 다시 내보내기

```js
export { sayHi } from "./say.js"; // sayHi를 다시 내보냄

export { default as User } from "./user.js"; // default export 를 다시 내보내기 함.
```

가져온 객체를 즉시 다시 내보내기 할수 있다. 내보낼 기능을 패키지 전반에 분산하여 구현한 후 필요한 파일에서 가져온후 다시 내보내는 방식으로 활용할 수 있다.

### default export 다시 내보내기

```js
// user.js
export default class User {
  //...
}
```

1. `User`를 `export User from './user.js` 로 다시 내보내기 할 때 문법 에러가 발생한다. `export {default as User}`를 사용해야 한다.
2. `export * from './user.js'`를 사용했다면 `dafault export`는 무시 되고 `named export` 만 다시 내보내진다.

동시에 하기 위해서는 다음과 같이 사용해야 한다.

```js
export * from "./user.js"; // named export를 다시 내보내기
export { default } from "./user.js"; // default export 다시 내보내기
```
