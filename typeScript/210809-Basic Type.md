# Basic Type
JavaScript 는 다이나믹 타입으로서 실행되는 도중에 타입이 바뀐다. 

TypeScript 는 static 타입으로서 실행되기 전에 타입을 정한다.

## 제공되는 타입
### 기본 자료형
- Boolean
- Number
- String
- Null
- Undefined
- Symbol
- Array: object

### 프로그래밍을 도울 몇가지 타입
- Any, Void, Never, Unknown
- Enum
- Tuple: object

## Primitive Types
오브젝트나 레퍼런스 형태가 아닌 실제 값을 저장하는 자료형
- boolean
- number
- string
- symbol
- null
- undefined

literal 값으로 Primitive 타입의 서브 타입을 나타낼 수 있다. 

또는 래퍼 객체로 만들 수 있다. 
```ts
new Boolean(false) // typeof : object
new String('world') // typeof: object
new Number(42) // typeof: object
```
but, 이렇게 만든건 객체임 primitive type 이 아니다. 

TypeScript primitives type은 모두 소문자 이다. 따라서 TypeScirpt 에서 type을 명시할때 래퍼 객체를 사용하면 안된다. 

## boolean
래퍼 객체로 타입을 정하 지 않는다. 
```ts
let isDone: boolean = false;

isDone = true;

console.log(typeof isDone); // boolean
```

## number
10진수 , 16진수, 8진수, 2진수, 모두 가능. 

NaN 가능. 

1_000_000과 같은 표현 가능.
```ts
let decimal: number = 6;

let hex: number = 0xf00d;

let binary: number = 0b1010;

let octal: number = 0o744;

let NotANumber: number = NaN;

let underscoreNum: number = 1_000_000;
```

## string
```ts
const fullName: string = "JayoonKoo";
const age: number = 30;

const sentence: string = `Hello, My name is ${fullName}.

I'll be ${age + 1} years old next month.`;

console.log(sentence);
```

## symbol
`new Symbol`로 사용할 수 없다. 
Symbol 함수를 사용해서 만들어야 한다. 

기본 설정으로 tsc를 만들었다면 오류가 날 수 있다. 
`tsconfig.json`으로 이동한 후에 `lib`를 열어서 ES2015, DOM을 추가해 준다. 

Symbol 은 프리미티브 타입의 값을 담아서 사용한다. 
고유하고 수정 불가능한 값을 만들어 주는데 주로 접근을 제어하는 용도로 사용하는 경우가 많다. 

```ts
console.log(Symbol("foo") === Symbol("foo"));

const sym = Symbol();

const obj = {
  [sym]: "value",
};

console.log(obj[sym]);
```

## undefined, null
undefined 로 선언한 변수는 undefined, void만, null 로 선언한 변수는 null 만 받을 수 있다.
따라서 변수 자체로는 할 수 있는게 별로 없다. 

null 과 undefined 는 다른 모든 타입의 서브 타입이다. 
`--strictNullCheck` 설정을 사용하지 않으면 `number` 에 null 또는 undefined가 할당될 수 있어서 문제가 있다. 
따라서 해당 옵션을 항상 켜 놓는것이 좋다. 
`"strict": true` 로 해 두면 그 안에 있는 `strictNullCheck` 도 켜지게 된다. 

하지만 number 같은 경우 undefined 나 null 이 될때가 있을 텐데 불편할 수 있다. 그럴때에는 `union type`을 사용한다. 
나중에 타입 가드를 사용하여 제외하는 식으로 사용 된다. 

```ts
let union: string | null = null;

let u: null = null;

union = "Mark";

console.log(u);
console.log(typeof u);
```

### JS 에서 null
무언가 사용할 준비가 덜 된 상태 
null 이라는 타입은 null 이라는 값만 가질 수 있다. 

런타임에서는 `typeof null`은 `object`이다. 

### JS 에서 undefined
값을 할당하지 않는 변수를 undefined라고 함. 
무언가 아예 준비가 안된 상태.
프로퍼티가 없을 때에도 undefined 이다. 

런타임에서 `typeof undefined` 하면 `undefined`이다. 


## object
non-primitive type 으로서 primitive type이 아닌 것을 사용할때 명시한다. 

### non-primitive type
not (number, string, boolean, bigint, symbol, null, or undefined.)

## Array 
원래 JS에서는 object이다.
같은 타입에 데이터만 가능하다. 

사용 방법 :
- Array<타입>
- 타입[]

```ts
// 보통은 이 방법을 사용함.
let list: number[] = [1, 2, 3];

let listUnion: (number | string)[] = [1, 2, 3, "4"];

// 만약 데이터의 순서나 상황을 알고 있다면 튜플을 사용할 것

// jsx 에서 충돌 할수도 있음.
let list2: Array<number> = [1, 2, 3];
```

## tuple
순서도 맞아야 하고, 타입도 맞아야 하고, 길이도 맞아야 한다. 
```ts
let x: [string, number];

// 순서도 맞아야 되고 타입도 맞아야 되고 길이도 맞아야 한다.
x = ["hello", 39];

const person: [string, number] = ["mark", 49];

// 첫번째는 string, 두번째는 number임이 확실해 진다.
// 세번째를 추가하면 오류가 나게 된다.
const [first, second] = person;
```

## any
귀찮다고 아무렇게나 사용하면 type system을 무너뜨릴 수 있다. 

어떤 타입이어도 상관 없는 타입이다. 

이걸 최대한 사용하지 않는것이 핵심이다. (타입 체크가 안되기 때문에 )

컴파일 옵션 중에는 any를 써야하는데 쓰지 않으면 오류를 뱉도록 하는 옵션도 있다. 
(noImplicitAny)

any 는 계속해서 개체를 통해 전파된다. 

결국, 타입 안정성을 잃는 대가로 이어짐. 

```ts
function returnAny(message: any): any {
  console.log(message);
}

const any1 = returnAny("리턴은 아무거나");

any1.toString();

// 어떻게 전파 되는가?
let losselyTyped: any = {};

const d = losselyTyped.a.b.c.d;

// 동적인 경우는? any를 피하기 위해서
function leakingAny(obj: any) {
  const a = obj.num;
  // b 도 any 가 됨
  const b = a + 1;
  return b;
}

// c 도 any 가 됨
const c = leakingAny({ num: 0 });

function leakingAny1(obj: any) {
  const a: number = obj.num;
  // b 도 any 가 됨
  const b = a + 1;
  return b;
}

// but 함수 안에서 사용하기 전에 처리를 하거나  type guard 를 사용하는 것이 좋음.
```

## unknown
any 가 전파되는 등의 문제를 해결하기 위해서 unknown을 사용한다. 

type guard 를 연계해서 사용할 수 있다. 
스코프 안 (type guard) 안에서는 특정 자료형임을 확정 지을 수 있다. 

```ts
declare const maybe: unknown;

if (maybe === true) {
  const aBoolean: boolean = maybe;
}

if (typeof maybe === "string") {
  const aString: string = maybe;
}
```

any 보다 type-Safe 한 타입이다. 
any와 같이 아무거나 할당할 수 있지만, 컴파일러가 타입을 추론할 수 있게끔 타입의 유형을 좁히거나 타입을 확정해 주지 않으면 다른 곳에 할당 할 수 없고, 사용할 수 없다. 

## never
보통은 `return` 에 사용된다. 
`never`를 리턴하게 되면 아무것도 리턴 하지 않는다는 의미가 된다. 
따라서 함수가 끝나버리면 안되고 에러를 던지는 등의 동작을 하게 된다. 

- never는 모든 타입의 서브타입이여서 모든 타입에 할당할 수 있다. 
- 하지만 never에는 어떤 것도 할당할 수 없다. 
- any 조차도 never에게 할당할 수 없다. 
- 잘못된 타입을 넣는 실수를 막고자 할 때 사용하기도 한다.

```ts
function error(message: string): never {
  throw new Error(message);
}

// 이때도 never라고 추론하게 된다.
function fail() {
  return error("faild");
}

// 무한 반복에 예시에서 never를 사용할 수 있다.
function infinitiLoop(): never {
  while (true) {}
}

let a: string = "hello";

// 잘못된 타입을 넣는 실수를 막을 수 있다.
// a 는 스코프 안에서 never가 된다.
if (typeof a !== "string") {
  a;
}

declare const b: string | number;

// b는 number 가 된다.
// 이런식으로 type guard를 사용할 수 있다.
if (typeof b !== "string") {
  b;
}
```

## void
void로 지정된 변수에는 undefined도 할당할 수 없다. 
void를 리턴하는 함수의 경우 리턴받은 void 변수를 가지고 어떤것도 하지 않겠다는 의미이다. 

명시적으로 void 로 선언해서 리턴 타입을 가지고 아무것도 하지 않겠다는 의미임. 
