# interface

## 데이터 타입을 인터페이스로 만들기

인터페이스로 타입을 정의할 수 있다.

```ts
interface Person1 {
  name: string;
  age: number;
}

function hello1(person: Person1): void {
  console.log(`안녕하세요! ${person.name} 입니다.`);
}

const p1: Person1 = {
  name: "Mark",
  age: 27,
};

hello1(p1);
```

## optional Property

값으로 받을 수도 있고 아닐 수도 있는 속성을 정의할 수 있다.

```ts
interface Person2 {
  name: string;
  age?: number;
}

function hello2(person: Person2): void {
  console.log(`안녕하세요! ${person.name} 입니다.`);
}

hello2({ name: "Koo", age: 39 });
hello2({ name: "Koo" });
```

`age?` 에서 ? 를 붙히면 받을수도 있고 안받을 수 도 있는 타입이 된다. `age: number | undefined`와 같아 진다.

### 인덱서블 타입

```ts
interface Person3 {
  name: string;
  age?: number;
  [index: string]: any; // 어떤 이름에 프로퍼티가 와도 괜찮음.
}

function hello3(person: Person3): void {
  console.log(`안녕하세요! ${person.name} 입니다.`);
}

const p31: Person3 = {
  name: "koo",
  age: 37,
};

const p32: Person3 = {
  name: "Anna",
  systers: ["Sung", "Chan"],
};

const p33: Person3 = {
  name: "Bokdaengi",
  father: p31,
  mother: p32,
};

hello3(p33);
```

인덱스에 타입을 지정해 주어서 어떤것도 받을 수 있도록 하려면 `[index: string]` 과 같이 사용한다.

## function interface

```ts
interface Person4 {
  name: string;
  age: number;
  hello(): void;
}

const p41: Person4 = {
  name: "Koo",
  age: 27,
  hello: function (): void {
    console.log(`안녕하세요. ${this.name} 입니다.`);
  },
};

const p42: Person4 = {
  name: "Koo",
  age: 27,
  hello(): void {
    console.log(`안녕하세요. ${this.name} 입니다.`);
  },
};

// const p43: Person4 = {
// 	name: "Koo",
// 	age: 27,
// 	hello: (): void => {
// 		console.log(`안녕하세요. ${this.name} 입니다.`);
// 	}
// }

p41.hello();
p42.hello();
```

함수로 선언하는 방법에는 3가지 정도 있다.

- `hello: function(): void {}`
- `hello(): void {}`
- `hello: (): void => {}` : 화살표 함수를 사용할 경우 `this`를 사용하지 못한다.

## class implements

```ts
interface IPerson1 {
  name: string;
  age?: number;
  hello(): void;
}

class Person implements IPerson1 {
  name: string;
  age?: number | undefined;
  constructor(name: string) {
    this.name = name;
  }
  hello(): void {
    console.log(`안녕하세요 ${this.name} 입니다.`);
  }
}

const person: IPerson1 = new Person("Koo");
person.hello();
```

객체지향 언어에서 구현하듯이 클래스에서 interface를 구현할 수 있다. interface를 구현하는 class 는 interface 안에 요소를 구현해야 한다. 반드시 받아야 하는 변수에 경우 생성자를 통해 받지 않으면 에러를 발생시킨다.

## interface extends

```ts
interface IPerson2 {
  name: string;
  age?: number;
}

interface IKorean extends IPerson2 {
  city: string;
}

const k: IKorean = {
  name: "Koo",
  city: "부천",
};
```

interface 에 다른 interface를 상속받을 수 있다.

## function interface

```ts
interface HelloPerson {
  (name: string, age?: number): void;
}

const helloPerson: HelloPerson = (...args) => {
  if (typeof args[1] === "number") {
    console.log(`안녕하세요. ${args[0]} 입니다. 나이는 ${args[1]} 입니다.`);
    return;
  }
  console.log(`안녕하세요. ${args[0]} 입니다.`);
};

helloPerson("mark", 39);
```

실제 타입 검사는 구현하는 함수에서가 아니라 인터페이스에서 한다. 다음과 같은 경우 에러를 발생시킨다.

```ts
interface HelloPerson {
  (name: string, age?: number): void;
}

const helloPerson: HelloPerson = (name: string, age: number) => {
  console.log(`안녕하세요. ${name} 입니다.`);
};
```

잘 생각해보면 helloPerson은 interface `HelloPerson`에 의해서 `age`를 인수로 받을 수도 있고 안받을수도 있다. 그런데 함수를 구현하는 부분에서 무조건 `age`를 받도록 구현했기 때문에 논리적으로 맞지 않다.
