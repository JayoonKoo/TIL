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

쿠키에 접근 가능한 도메인을 설정한다. 아무것도 설정하지 않으면 쿠키를 설정한 도메인에서만 접근할 수 있다. 까다로운 제약사항이 하나 더 있는데 서브 도메인에서 쿠기 정보를 얻을 수 없다는 점이다.

이것은 안정성을 위한 제약 사항이다. 특정 도메인에서 설정한 쿠키 정보가 다른 도메인에서 읽을 수 있다면 쿠키를 도난당하는 일이 벌어질 수 도 있기 때문이다.

그럼에도 불구하고 서브 도메인에서 쿠키를 사용해야 한다면 명시적으로 domain을 설정해 주면 된다.

```js
document.cookie = "user=John; domain=site.com";
```

이렇게 설정하면 `forum.stie.com` 같은 `site.com`에 서브 도메인에서도 쿠키에 접근할 수 있다. domain에 `doamin=.site.com`과 같이 사용하는 것도 동일하게 동작하는데 구식 브라우저에서 사용하기 위해서 이렇게 사용한다.

## expires 와 max-age

해당 옵션이 설정되어 있지 않으면 브라우저가 닫힐때 쿠키고 삭제된다. 이를 `seccion cookie` 라고 한다. 옵션을 설정하면 브라우저가 닫혀도 쿠키가 삭제되지 않는다.

- `expires=Tue, 19 Jan 2038 03:14:07 GMT`

브라우저는 해당 옵션에 설정된 기간까지 쿠키를 저장한다. 옵션에 포멧은 `GMT` 포멧을 사용해야 하는데 `data.toUTCString` 을 사용하면 쉽게 얻을 수 있다.

```js
let date = new Date(Date.now() + 86400e3);
date = date.toUTCString();
document.cookie = "user=John; expries=" + date;
```

만약 해당 옵션이 과거로 설정되어 있으면 쿠키는 삭제된다.

- `max-age=3600`
  현제부터 쿠키를 유지할 시간까지 초 단위로 지정한다.

0이나 음수 값을 설정하면 쿠키는 바로 삭제된다.

```js
document.cookie = "user=John; max-age=3600";
```

## secure

쿠키는 도메인을 가리지만 프로토콜을 가라지 않기 때문에 동일한 도메인이면 `http` 나 `https` 에서 모두 읽을 수 있따. 그러나 `https` 만 사용하고자 하는 경우에는 `secure` 옵션을 설정해야 한다.

```js
document.cookie = "user=John; secure";
```

## samesite

이 옵션은 크로스 사이트 오청 위조(cross-site request forgery, XSRF) 공격을 막기 위해 만들어진 옵션이다.

## XSRF 공격

XSRF 공격은 브라우저에 토큰을 사용해서 사용자로 위장해 악의적인 행동을 하는것을 말한다. 예를들어 어떤 은행도메인에 로근이 되었다고 가정해 보자. 이때 사용자가 뜻하지 않게 `evil.com` 도메인에 접속했는데 이 도메인은 자동으로 해커에서 돈을 입금하는 폼이 보내진다. 모든 요청에는 쿠키를 실어서 보내기 때문에 서버는 받은 쿠키로 사용자를 판단하는데 같은 쿠키 이기 때문에 사용자라고 판단 돈을 보낼 것이다.

요즘 웹사이트는 이런걸 방지하기 위해서 `XSRF` 보호 토큰을 사용한다. 모든 폼에 보호 토큰을 셋팅해서 토큰 정보를 통해서 사용자를 한단계 더 나아가 인증하는 것이다. 그러나 이렇게 토큰을 설정하는 것이 조금은 번거러운 작업이라 생각 될 수 있는데 이때 토큰 없이도 사용자를 인증할 수 있는 옵션이 `samesite` 이다.

## samesite 옵션
