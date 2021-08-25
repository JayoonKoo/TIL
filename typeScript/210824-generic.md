# generic

## generic 과 any 에 다른점

```ts
function helloString(message: string): string {
  return message;
}

function helloNumber(message: number): number {
  return message;
}

// 타입만 다르고 로직은 같은 함수가 반복된다면 ...

function hello(message: any): any {
  return message;
}

// 같은 로직이면 문자로 생각하고 싶지만 any가 나옴
// lnegth 같은 메서드를 사용해도 number 가 아니라 any가 나옴..
console.log(hello("Mark"));
// 같은 로직이면 숫자로 생각하고 싶지만..
console.log(hello(4));

// 만약 string을 넣으면 T 가 string이 되는 것. 마치 변수처럼 사용
function helloGeneric<T>(message: T): T {
  return message;
}

// 리턴 타입은 'Mark'로 추정함.. 리터럴 타입으로
console.log(helloGeneric("Mark").length);
// 리턴 타입을 27로 추정함.
console.log(helloGeneric(27));
// true로 추정함.
console.log(helloGeneric(true));
```

제너릭 타입을 사용하면 함수 안에서 동적으로 받은 타입을 변수처럼 사용할 수 있다. 이를 활용하여 리턴 타입을 명시 하는지에 기능을 사용할 수 있다.

## generic basic

```ts
function helloBasic<T, U>(message: T, coment: U): T {
  return message;
}

// 사용법
// T 는 string U 는 27
helloBasic<string, number>("mark", 27);
// T 는 27 , U 39
helloBasic(27, 39);
```

사용할 때에는 두가지 방법으로 사용 가능하다.

1. `<>` 안에 타입 명시 -> 이렇게 하면 매개변수로 주는 타입을 명시한 터입으로 지정해야 한다.
2. 평범하게 사용, 이렇게 하면 타입스크립트가 추론해서 타입을 정하게 된다. 일반적으로 27과 같은 숫자를 넣으면 number 라고 생각할 수 도 있지만, 타입 스크립트는 타입을 가능한 좁게 가져가기 때문에 타입은 number 가 아니라 27이 된다.

## generics array & tuple

```ts
function helloArray<T>(message: T[]): T {
  return message[0];
}

// T는 string으로 추론됨.
helloArray(["hello", "world"]);
// T는 <string | number> 로 추론함. 유니온 타입이됨.
// string과 number 에서 모두 사용할수 있는 메서드만 사용할 수 있음.
helloArray(["Hello", 5]);

function helloTuple<T, K>(message: [T, K]): T {
  return message[0];
}

// string 이 리턴 타입
helloTuple(["hello", "world"]);
// 리턴 타입이 정확하게 string으로 추정됨.
helloTuple(["Hello", 5]);
```

제너릭에서 배열과 튜플을 활용하는 방법은 다음과 같다. 이때 어떤 타입에 데이터가 인수로 들어올지 알 수 있다면 튜플로 사용하는것이 타입을 더 명시적으로 관리할 수 있다.

## generic function

```ts
type helloFunctionGeneric1 = <T>(message: T) => T;

const helloFuncion1: helloFunctionGeneric1 = <T>(message: T): T => {
  return message;
};

interface helloFunctionGeneric2 {
  <T>(message: T): T;
}

const helloFunction2: helloFunctionGeneric2 = <T>(message: T): T => {
  return message;
};
```

함수에서도 동일하게 generic 을 사용할 수 있다.

## generic class

```ts
// 클래스 전체에서 T는 유효범위를 갖는다.
class Person<T, K> {
  private _name: T;
  private _age: K;

  constructor(name: T, age: K) {
    this._name = name;
    this._age = age;
  }
}

new Person("Mark", 39);

new Person<string, number>("koo", 27);
```

## generic with extends

```ts
class PersonExtends<T extends string | number> {
  private _name: T;

  constructor(name: T) {
    this._name = name;
  }
}

new PersonExtends("Mark");
new PersonExtends(27);
// new PersonExtends(true);
```

generic 에서 extends 는 일반적인 상속과는 다른 개념으로 사용된다. generic 에서 사용하게 되면 타입을 제한하는 역활을 하게 된다. 따라서 코드에서 `new PersonExtends(true)`는 에러를 인수로 `<string | number >` 가 아닌 값을 주었기 때문에 에러를 발생시킨다.

## keyof & type lookup system

```ts
interface IPerson {
  name: string;
  age: number;
}

const person: IPerson = {
  name: "mark",
  age: 39,
};

// key 이름으로 된 유니온 타입이 반환된다.
type Keys = keyof IPerson;

// 리턴 타이에도 문제가 생김...
// IPerson[keyof IPerson]
// => IPerson["name" | "age"]
// => IPerson["name"] | IPerson["age"]
// => string | number
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// key 가 name 일 때 string
// key 가 age 일 때 number
getProp(person, "name");

function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  // 경우에 따라서 넣어야 하는 타입이 달라지기 때문에
  obj[key] = value;
}

setProp(person, "name", "koo");
setProp(person, "age", 27);
```

`keyof` 를 사용하면 인터페이스에 key로 구성된 유니온 타입을 반환한다. 어떤 매개변수끼리 혹은 리턴 값 끼리 서로 관련 성이 있어서 타입이 달라지는 경우 `keyof`와 `extends`를 활용하여 관계성을 정의할 수 있다.
