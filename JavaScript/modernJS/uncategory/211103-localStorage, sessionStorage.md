# localStorage, sesionStorage

- 자바스크립트로만 조작할 수 있다.
- 서버에 보내지지 않는다.
- 오리진에(domain, port/ protocol) 묶여 있다.

다양한 메서드를 지원한다.

- setItem(key, value)
- getItem(key)
- removeItem(key)
- clear() - 모두삭제
- key(index) - 인덱스에 해당하는 키를 받아옴.
- length - 저장된 항목의 개수를 얻음.

## localStorage 데모

- 오리진이 같은 경우 데이터는 모든 탭과 창에서 공유됩니다.
- 브라우저나 OS가 재시작하더라도 데이터가 파기되지 않습니다.

## 일반 객체처럼 사용하기

일반 객체처럼 사용할수 있지만 추천되진 않는다. `length`나 `toString` 과 같은 내장 메서드를 설정할 수 있는데 에러가 발생한다.

## 키 순회하기

아쉽게도 스토리지 객체는 iterable 객체가 아닙니다. 앞에서 보았더 `key()` 메서드를 응용해서 일반 반복문으로 인덱스를 넘겨주는 방법으로 순해할 수 있다.

`for key in localStorage` 이 방법을 사용할 수 도 있는데 내장 프로퍼티까지 조회 되기 때문에 추천하지 않는다.

이럴때는 `hasOwnProperty` 를 사용해서 프로토타입에서 상속받은 메서드를 골라낸다.

`Object.keys` 는 객체에서 정의한 키만 반환하기 때문에 해당 방법으로도 조회할 수 있다.

## 문자열만 사용

반드시 문자열만 사용해야 한다. 일반 객체를 넘겨주면 toString 이 작동해서 object Object로 보인다. 이럴땐 JSON.stringfy를 사용할 수 있다.

## settionStorage

`localStorage` 에 비해 자주 사용되지 않는다. 현재 떠이는 탭 내에서만 유지된다. 그래서 iframe 에서도 유지 되긴 하는데 탭을 새로 열거나 하면 사라진다.

## storage 이벤트

`localStorage` 나 `sessionStorage`에 데이터가 갱신될때 storage 이벤트가 실행된다. 다음과 같은 프로퍼티를 갖는다.

- `key` – 변경된 데이터의 키(`.clear()`를 호출했다면 `null`)
- `oldValue` – 이전 값(키가 새롭게 추가되었다면 `null`)
- `newValue` – 새로운 값(키가 삭제되었다면 `null`)
- `url` – 갱신이 일어난 문서의 url
- `storageArea` – 갱신이 일어난 `localStorage`나 `sessionStorage` 객체

window 전역에서 발생하기 때문에 다른 창간에 이벤트를 발생 여부를 확인할수 있게 창간에 이벤트를 통해 메시지를 교환하는 작업 등도 할 수 있다.
