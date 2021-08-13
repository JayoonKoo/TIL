# type system
## 작성자와 사용자의 관점으로 코드 바라보기 
### 타입 시스템 
컴파일러가 자동을 타입을 추론하는 시스템이 있고 컴파일러에게 사용하는 타입을 명시적으로 지정하는 시스템이 있다. 

### 타입 스크립트의 타입 시스템 
두가지 모두 가능하다. 

#### 타입이란 해당 변수가 할 수 있는 일을 결정한다. 
```js
function f1(a) {
	return a;
}
```
a 가 할 수 있는 일은 a 의 타입이 결정한다.

#### 함수 사용법에 대한 오해를 야기한다. 
```js
function f2(a) {
	return a * 38;
}

console.log(f2(10)) // 380
console.log(f2('Mark')) // NaN
```
사용자가 직접 f2를 까보지 않는 이상 함수 인수로 뭘 넣어야 하는지 모를 수 있다. 

이는 타입 스크립트의 추론에만 의지하는 경우도 마찬가지이다. 

#### noImplicitAny 옵션
타입을 명시적으로 작성하지 않아 any 로 추론되면 에러를 발생 시켜서 타입을 명시적으로 작성하도록 함. 

#### nuber 타입으로 추론된 리턴 타입
```ts
function ft(a: number) {
	if (a > 0) {
		return a * 38;
	}
}

console.log(f4(5)); // 190
console.log(f4(-5) + 5); // NaN
```
a에 음수를 넣었기 때문에 undefined 가 리턴되는데 typescript 에서는 undefined도 number안에 속한 타입으로 추론한다.

#### strictNullChecks 옵션을 켜면 
모든 타입에 자동으로 포함되어 있는 null 과 undefined를 제거 한다. 
무조건 켜야 함.

옵션을 켜게 되면 f4의 결과는 더이상 number 가 아니라 `number | undefined` 가 된다. 따라서 f4의 결과와 number를 더하기 할때에 오류가 발생한다. 

그런데 5를 넣은 경우에도 이는 마찬가지이다. 런타임에서 두가지 모두 가능하기 때문에 typescript 에서는 `undefined` 일때는 에러를 던진다던지 하는 처리를 하는것을 권장한다. 

#### 리턴을 명시적으로 작성

```ts
function f4(a: number): number {
	if (a> 0) {
		return a* 38;
	}
}
```
이렇게 해도 오류가 발생 else인 겨웅에 리턴은 undefined 이기 때문이다. 

#### noImplicitReturns 
옵션을 켜면 함수 내에서 모든 코드가 값을 리턴하지 않으면 컴파일 에러를 발생 시킨다. 
```ts
function f4(a: number) {
	if (a> 0) {
		return a* 38;
	}
}
```
에러 발생 return이 code path 존재. 

#### 매개 변수가 object 가 들어오면 object literal
```ts
function f7(a: {name: string, age: number}): string {
	return `${a.name}이고 나이는 ${a.age}`;
}
```

#### 나만의 타입을 만드는 방법 
```ts
interface PersonInterface {
	name: string;
	age: number;
}

type PersonTypeAlias = {
	name: string;
	age: number;
};
```


## Structural Type System vs Nominal Type System
nominal type system 은 이름이 다르면 다른 타입으로 여긴다. 반면에 
타입 스트립트는 structural type system 이다. 
따라서, 구조가 같으면 같은 타입으로 여긴다. 

```ts
interface IPerson {
	name: string;
	age: number;
	speak(): string;
}

type PersonType = {
	name: string;
	age: number;
	speak(): string;
};

let personInterface: Iperson = {} as any;
let personType: PersonType = {} as any;

personInterface = personType;
personType = personInterface;
```


## type 호환성 (Type Compatibility)
서브타임과 슈퍼타입

슈퍼 타입 안에 서브타입이 있기 때문에 서브타입은 슈퍼 타입으로 넣을 수 있다. 하지만 서브타입 변수에 슈퍼타입에 변수를 할당하려고 하면 할수 없다. 

array 는 object 의 서브 타입이다. 따라서 object 타입에 변수에 array 타입 변수를 할당하는것은 가능하지만 서브타입인 array 변수에 object 타입을 할당하는 것은 불가능하다. 

number 배열과 number로 이루어진 튜플이 있다고 할때 number 배열은 number 튜플에 슈퍼 타입이 되고 튜플은 서브 타입이 된다. 
따라서 number 배열에 튜플 타입을 할당할수 있지만 반대로 튜플 타입에 number 배열 을 할당할 수 는 없다. 

any는 모든 타입의 슈퍼 타입이다. 하지만 이친구는 이상하게도 서브 타입에 할당할 수 도 있다. 

never 타입은 number 타입의 서브 타입이다. number 타입에 never 타입에 변수를 할당하는 것은 가능하지만 never 타입의 변수에 number 타입에 변수를 할당하는 것은 불가능하다.

상속관계에서 상속 받는 관계에 있는 클래스는 서브 타입이 된다. 상속해 주는 클래스에 상속 받는 클래스를 할당할 수는 있지만 상속 해주는 클래스를 상속 받는 클래스로 할당하려면 오류가 발생한다. 사실 확장한 메서드가 없기 때문에 구조도 다르다. 

### 공변 
같거나 서브 타입인 경우, 할당이 가능하다. 

### 반병
함수의 매개변수 타입만 같거나 슈퍼타입인 경우, 할당이 가능하다.
```ts
class Person{}
class Developer extends Person {
	coding() {}
}
class StartupDevloper extends Developer {
	burning() {}
}

function tellme(f: (d: Developer) => Developer) {}

tellme(function dToD(d: Developer): Developer {
	return new Developer();
})

tellme(function pToD(d: Person): Developer {
	return new Developer();
})

tellme(function sToD(d: StartupDeveloper): Developer {
	return new Developer();
})
```

strictFunctionTypes 옵션을 켜면 함수를 할당할 시에 함수의 매개변수 타입이 같거나 슈퍼타입인 경우가 아닌 경우, 에러를 통해 경고한다. 

이 옵션을 키면 마지막 줄에 tellme 는 에러일 것이다. 

## 타입 별칭 (Type Alias)
만들어진 타입의 refer로 사용함. 타입을 만드는것은 아니다. 

### Aliasing Primitive
```ts
type myStringType = string;
const str = 'world';
let myStr: MyStringType = 'hello';
myStr = str;
```

### Aliasing Union Type
```ts 
let person: string | number = 0;
person = 'Mark';

type StringOrNumber = string | number;

let another: StringOrNumber = 0;
another = 'Anna';
```
타이핑 해야 하는 야이 줄어들 수 있다. 

### Aliasing Tupele
```ts
type PersonTuple = [string, number];
```

### Aliasing Function
```ts
type EatType = (food: string) => void;
```
어떤 타입이 타입으로서의 존재가치와 목적이 명확하면 `interface`를 사용하고 단지 가르킬 뿐이라면 `type`를 사용함.

물론 기술적으로도 차이가 있음. 

