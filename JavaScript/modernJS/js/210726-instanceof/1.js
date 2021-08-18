// 아래 예시에서 a는 B()를 통해 생성하지 않았습니다. 그런데도 instanceof는 왜 true를 반환할까요?
function A() {}
function B() {}

A.prototype = B.prototype = {};

let a = new A();

console.log(a instanceof B); // true

// A와  b의 프로토 타입이 같으므로 , instancof를 호출할때 prototype을 확인하면서 일치 여부를 반환하기 때문에
