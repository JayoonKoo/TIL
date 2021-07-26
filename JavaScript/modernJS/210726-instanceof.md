# instanceof 로 클래스 확인하기
instanceof 를 사용하면 특정 클래스에 속하는지 확인할 수 있다. 

이를 통해 특적 인스턴스의 상속 관계까지도 확인할 수 있다.

다양한 곳에서 사용할 수 있는데 이번 챕터에서는 다형적인 함수를 만드는데 사용해 보도록 한다.

<br/>

## instanceof 연산자
기본 사용법
```js
obj instanceof Class
```
obj 가 Class에 속하거나 Class를 상속받는 클래스에 속하면 true를 반환한다.

instanceof는 보통 프로토타입 체인을 거슬러 올라가며 인스턴스 여부나 상속 여부를 확인한다. 

그런데 정적 메서드 `Symbol.hasInstance`를 사용하면 직접 확인 로직을 설정할 수 도 있다. 

동작 방식은 다음과 같다. 

1. Class 안에 Symbol.hasInstance가 구현되어 있으면, obj instanceof Class문이 실행될때 `Class[Symbol.hasInstance](obj)` 가 실행됨. 호출결과는 true 이거나 false 이어야 한다. 

```js
// canEat 프로퍼티가 있으면 animal이라고 판단할 수 있도록
// instanceOf의 로직을 직접 설정합니다.
class Animal {
  static [Symbol.hasInstance](obj) {
    if (obj.canEat) return true;
  }
}

let obj = { canEat: true };

alert(obj instanceof Animal); // true, Animal[Symbol.hasInstance](obj)가 호출됨
```

2. 대부분의 클래스엔 Symbol.hasInstance가 구현되어 있지 않음. 따라서 프로토타입 체인을 거치면서 하나와 일치하면 true를 반환함. 

<br/>

## 보너스: 타입 확인을 위한 Object.prototype.toString
toString 을 사용하면 typeOf 나 instancof의 좋은 대안이 될 수 있다.

toString 알고리즘은 내부적으로 this를 검사하고 this에 상응하는 결과를 반환한다.

```js
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```

### Symbol.toStringTag
특수 객체 프로퍼티 Symbol.toStringTag를 사용하면 toString의 동작ㅇ을 커스터마이징 가능하다.
```js
let user = {
  [Symbol.toStringTag]: "User"
};

alert( {}.toString.call(user) ); // [object User]
```

객채의 확인 뿐만 아니라 문자열로 받고 싶다면 `{}.toString.call`를 활용하면 됨.

[과제1](js/210726-instanceof/1.js)


<br/>
