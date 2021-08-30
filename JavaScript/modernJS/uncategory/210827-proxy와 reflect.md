# Proxy 와 Reflect

`Proxy`는 특정 객체의 행동을 가로챔. 직접 처리하기도 하고 넘겨 주기도 하는 방식으로 동작.

## Proxy

```js
let proxy = new Proxy(target, handler);
```

- `target` 감싸게 될 객체
- `handler` 동작을 가로채는 메서드인 트랩이 담긴 객체

타겟을 처리할 트랩이 있으면 트랩이 실행하고 아니면 target 이 직접 수행함.

```js
let target = {};
let proxy = new Proxy(target, {}); // 빈 핸들러

proxy.test = 5; // 프락시에 값을 씀.

alert(target.test); // target에 프로퍼티가 생김.

alert(proxy.test); // 프락시를 사용해 값을 읽을수도 있음.

for (let key in proxy) alert(key); // test, 반족도 잘 동작함.
```

트랩이 없기 때문에 다음과 같이 동작한다.

1. proxy.test = 하면 target에 값이 설정된다.
2. proxy.test 를 이용해 값을 읽으면 target 에서 값을 읽어온다.
3. proxy를 대상으로 반복을 수행하면 target에 지정한 값이 반환된다.

핸들러가 비어있으면 모든 작업은 target에서 수행된다.

객체의 어떤 작업을 할때는 코드로 확인할 수 없는 내부 메서드를 이용하여 수행한다. 프록시를 사용하면 이 내부 메서드를 가로챈다.

`new Proxy`의 `handler`에 매개변수로 추가할 수 있는 메서드는 아래와 같다.

<img src="./images/210827-proxy와 reflect/1.png" width="500">

> 내부 메서드나 트랩을 쓸 땐 자바스크립트에서 정한 몇 가지 규칙(invariant)를 반드시 따라야 함.

## get 트랩으로 프로퍼티 기본값 설정하기

프로퍼티 읽기를 가로채려면 `handler`에 `get(target, property, receiver)` 메서드가 있어야 한다.

- target: 동작을 전달할 객체로 `new Proxy`dml 첫번째 인자이다.
- property: 프로퍼티 이름
- receiver: 타깃 프로퍼티가 getter 라면 `receiver`는 getter가 호출될 때 `this`이다.

```js
let numbers = [0, 1, 2];

numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // 기본값 undefined 대신에
    }
  },
});

alert(numbers[1]); // 1
alert(numbers[123]); // 0 해당 요소가 없으므로
```

> 프락시로 객체를 감쌌다면 target 객체에 접근할 수 없도록 해야 함. 위에서 number를 덮어씌워 줌으로서 원래의 numbers의 접근하지 못하도록 함.

## set 트랩으로 프로퍼티 값 검증하기

set 메서드의 인수는 아래와 같은 역활을 한다.

`set(target, property, value, receiver)`:

- target: 동작을 전달할 객체로 `new Proxy`의 첫 번째 인자이다.
- property: 프로퍼티 이름
- value: 프로퍼티 값
- receiver: get 트랩과 유사하게 동작하는 객체로, setter 프로퍼티에만 관여한다.

number 일때만 setter 되는 프록시 만들기

```js
let numbers = [];
numbers = new Proxy(numbers, {
	set(target, prop, val) {
		if (typeof var == 'number') {
			target[prop] = val;
			return true;
		} else {
			return false;
		}
	}
});

numbers.push(1);
numbers.push(2);
alert(numbers.length); // 2

numbers.push("test") // Error: 'set' on proxy
```

배열관련 기능들도 여전히 사용할 수 있다.

> true를 반환하는 것을 잊지 말아야 한다.

## ownKeys와 getOwnPropertyDescriptor로 반복 작업하기

`Object.keys`, `for..in` 반복문을 비로한 프로퍼티 순환 관련 메서드 대다수는 내부 메서드 `[[OwnPropertyKeys]]` (트랩 메서드는 (`ownKeys`)) 를 사용해 프로퍼티 목록을 얻는다.

`_`로 시작하는 프로퍼티는 `for..in` 반복문의 순환 대상에서 제외하도록 만듦.

```js
let user {
	name: "John",
	age: 30,
	_password: "***",
};

user = new Proxy(user, {
	ownKeys(target) {
		return Object.keys(target).filter(key => !key.startsWith('_'));
	}
})

for (let key in user) alert(key); // name, age

alert(Object.keys(user)); // name, age;
alert(Object.values(user)); // John, 30
```

`Object.keys`는 `enumerable` 플래그가 있는 프로퍼티만 반환한다. `ownKeys`에서 `enumerable` 플래그가 없는 객체를 반환했다면, `Object.keys`를 호출해도 빈 문자열이 반환된다.

이럴땐 `getOwnPropertyDescriptor`를 사용하면 된다.

```js
let user = {};

user = new Proxy(user, {
	ownKeys(target) { // 프로퍼티 리스트를 받을 때 딱 한번 호출된다.
		return ['a', 'b', 'c'];
	}

	getOwnPropertyDescriptor(target, prop) { // 모든 프로퍼티를 대상으로 호출된다.
		return {
			enumerable: true,
			configurable: true,
			// 이 외의 플래그도 반환할 수 있다. "value:..."도 가능하다.
		}
	}
})

alert(Object.keys(user)); // a, b, c
```

## deleteProperty 와 여러 트랩을 사용해 프로퍼티 보호하기

`_`가 붙은 프로퍼티는 내부에서만 사용하는 프로퍼티를 의미한다. 외부에서 접근해서는 안되는데 기술적으로 접근 가능한 문제가 있다.

프록시를 이요해서 접근하지 못하도록 막아 본다.

- get: 프로퍼티를 읽으려고 하면 에러를 던져줌
- set: 포로퍼티에 쓰려고 하면 에러를 던져줌
- deleteProperty: 프로퍼티를 지우려고 하면 에러를 던져줌
- ownKeys: `for..in` 이나 `Object.keys`같은 프로퍼티 순환 메서드를 사용할 때 `_`로 시작하는 메서드는 제외함.

```js
let user = {
  name: "John",
  _password: "***",
};

user = new Proxy(user, {
  get(target, prop) {
    if (prop.startWith("_")) {
      throw new Error("접근이 제한되어 있습니다.");
    }
    let value = target[prop];
    return typeof value === "function" ? value.bind(target) : value;
  },

  set(target, prop, val) {
    if (prop.startWith("_")) {
      throw new Error("접근이 제한됭있습니다");
    } else {
      target[prop] = val;
      return true;
    }
  },

  deleteProperty(target, prop) {
    if (prop.startWith("_")) {
      throw new Error("접근이 제한되어 잇습니다.");
    } else {
      delete target[prop];
      return true;
    }
  },

  ownKeys(target) {
    return Object.keys(target).filter((key) => !key.startsWith("_"));
  },
});
```

함수를 반환할 때 함수를 target으로 바인딩 해주고 있음을 주목해야 한다. 그냥 사용하려고 프록시 객체로 사용하면 원본 target 객체 메서드에서 내부 변수로 접근할때 this 는 프록시기 때문에 접근이 거부된다.

이 함수에 this를 target 원본으로 바인딩 함으로써 문제를 해결할 수 있다. 하지만 프록시로 여러번 쌓여 있다던지 하면 문제가 또 생긴다. 프록시마다 객체에 가하는 수정이 달라지는 문제도 있다..

따라서 이런 형태의 프록시는 사용하면 안된다.

## has 트랩으로 '범위'내 여부 확인하기

```js
let range = {
  start: 1,
  end: 10,
};
```

`in` 연산자를 사용해 특정 숫자가 `range` 내에 있는지 확인해 본다. `has` 트랩은 `in` 호출을 가로챈다.

`has(target, property)`

- target: new Proxy의 첫 번째 인자로 전달되는 타깃 갳게
- property: 프로퍼티 이름.

```js
let range = {
  start: 1,
  end: 10,
};

range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end;
  },
});

alert(5 in range); // true
alert(50 in range); // false
```

## apply 랩으로 함수 감싸기

`apply(target, thisArg, args)` 트랩은 프락시를 함수처럼 호출하려고 할때 동작한다.

- target: 타깃 객체
- thisArg: this의 값
- args: 인수 목록

일반 함수를 사용하는 데코레이터로 예시를 들어본다.

```js
function delay(f, ms) {
  // 지정한 시간이 흐른 다음에 f 호출을 전달해주는 래퍼 함수를 반환한다.
  return function () {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 래퍼 함수로 감싼 다음에 sayHi 를 호출하면 3초 후 함수가 호출된다.
sayHi = delay(sayHi, 3000);

sayHi("John"); // Hello, John! (3초후)
```

래퍼함수로 감싸고 나면 기존 함수의 프로퍼티 (name, length등 ) 정보가 사라짐.

```js
function delay(f, ms) {
  return function () {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

alert(sayHi.length); // 1 (함수 정의부에서 명시한 인수의 개수)

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 0 (래퍼 함수 정의부엔 인수가 없음)
```

`Proxy` 객체는 타깃 객체에 모든 것을 전달해주므로 훨씬 강력하다.

```js
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms);
    },
  });
}

function sayHi(user) {
  alert(`Hello, %${user}!`);
}

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 1 프락시는 "get length" 연산까지 타깃 객체에 전달해줍니다.

sayHi("John"); // Hello, John! (3초후)
```
