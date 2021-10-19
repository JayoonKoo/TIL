# 쿠키와 document.cookie

서버가 `Set-Cookie` 와 함께 내용을 전달하면 브라우저는 쿠키에 이 정보를 저장함. 동일한 도메인에서 `Cookie` 헤더에 인증 정보가 담긴 고유값을 함께 실어서 서버에 요청을 보낸다. 여기에 인증 정보같은 것을 저장할 수 있다.

## 쿠키 읽기

`document.cookie` 를 사용하여 쿠키정보를 읽을 수 있다.

## 쿠키 쓰기

`document.cookie` 에 값을 할당하면 , 브라우저는 이 값을 받아 해당 쿠키를 갱신한다. 이때, 다른 쿠키의 값은 변경되지 않는다. 왜냐하면 `cookie` 는 일반적인 프로퍼티가 아니라 접근자 프로퍼티이기 때문이다. (setter 같은거)

```js
document.cookie = "user=John";
```

쿠키에는 어떤 값도 가능하지만 특수 값을 사용하는 경우가 있을 수 있기 때문에 반드시 `encodeURLComponent` 를 사용하여 인코딩 한다.

```js
// 특수 값(공백)은 인코딩 처리해 줘야 합니다.
let name = "my name";
let value = "John Smith";

// 인코딩 처리를 해, 쿠키를 my%20name=John%20Smith 로 변경하였습니다.
document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

alert(document.cookie); // ...; my%20name=John%20Smith
```

> 쿠키의 한계:
>
> 1. 쿠키는 4kb를 넘을 수 없다.
> 2. 브라우저 마다 다르지만 20여개 정도 로 개수에 한계가 있다.

쿠키는 `;` 를 통해 구분해서 나열할 수 있다.

```js
document.cookie = "user=John; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT";
```

## path

`path=/admin` 과 같이 설정하면 설정한 하위 디렉토리에서 쿠키에 접근할 수 있다. 일반적으로는 `path=/` 과 같이 설정하면 모든 페이지에서 쿠키에 접근할 수 있도록 한다.

## domain
