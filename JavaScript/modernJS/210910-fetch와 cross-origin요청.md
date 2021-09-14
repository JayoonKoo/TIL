# fetch와 Cross-Origin 요청

도메인이나 서브도메인, 프로토콜, 포트가 다른 곳에 요청을 보내는 것을 Cross-Origin Request(크로스 오리진 요청) 이라고 한다. 크로스 오리진 요청을 보내려면 리모트 오리진에서 전송받은 특별한 헤더가 필요하다. 이러한 정책을 CORS라고 부른다.

## 왜 CORS 가 필요한가에 대한 짧은 역사

과거 수 년 동안, 한 사이트의 스크립트에서 다른 사이트에 있는 콘텐츠에 접근할 수 없다는 제약이 있었다. 더 강력한 작업을 위해서 다른 웹사이트로에 요청이 필요했다.

여러가지 트릭이 있었지만, 오랜 논의 끝에 크로스 오리진 요청을 허용 하기로 결정했다. 대신 크로스 오리진 요청은 서버에서 명시적으로 크로스 오리진 요청을 '허가' 했다는 것을 알려주는 특별한 헤더를 전송받았을 때만 가능하도록 제약을 걸었다.

## 안전한 요청

안전한 요청은 다음과 같은 두 가지 조건 모두를 충족한다.

1. 안전한 메서드 - GET이나 POST, HEAD를 사용한 요청
2. 안전한 헤더 - 다음 목록에 속하는 헤더
   - Accept
   - Accept-Language
   - Content-Language
   - 값이 application/x-www-form-urlencoded나 multipart/form-data, text/plain 인 Content-Type

표준이 아닌 헤더가 들어있거나 안전하지 않은 메서드를 사용한 요청은 안전한 요청이 될 수 없다. 그런데 시간이 지나고 개발자가 스크립트를 사용해 안전하지 않은 요청을 보낼 수 있게되자, 브라우저는 안전하지 않은 요청을 서버에 전송하기 전에 preflight 요청을 먼저 전송해 서버가 크로스 오리진 요청을 받을 준비가 되어있는지 확인한다.

이때 서버에서 크로스 오리진 요청은 허용하지 않는다는 정보를 담은 헤더를 브라우저에 응답하면 안전하지 않은 요청은 서버에 전송되지 않는다.

## CORS와 안전한 요청

크로스 오리진 요청을 보낼 경우 브라우저는 항상 `Origin`이라는 헤더를 요청에 추가해서 자신에 도메인을 적는다.

```
GET /request
Host: anywhere.com
Origin: https://javascript.info
...
```

서버는 `Origin`을 검사하고 요청을 받아들이기로 동의한 상태라면 특별한 헤더 `Access-Control-Allow-Origin`을 응답에 추가한다. 여기에 오리진 정보나 \* 를 붙히면 응답에 성공하고 그렇지 않으면 실패하게 된다.

이때 브라우저는 중재인의 역할을 수행한다.
서버에서 크로스 오리진 요청을 수행한 경우, prefilght 요청에 응답은 다음과 같은 형태를 뛴다.

```
200 OK
Content-Type:text/html; charset=UTF-8
Access-Control-Allow-Origin: https://javascript.info
```

<img src="./images/210910-fetch와 cross-origin요청/1.png" width="500">

## 응답 헤더

크로스 오리진 요청이 이루어진 경우, 자바스크립트는 기본적으로 안전한 응답 헤더로 분류되는 헤더에만 접속할 수 있다.

- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma

이 외의 응답 헤더에 접근하면 에러가 발생한다.

> 위 리스트엔 `Contnet-Length`헤더는 없다.

안전하지 않는 응답 헤더에 접근하려면 서버에서 `Access-Contorol-Expose-Headers`라는 헤더를 보내줘야 한다. 여기에 자바스크립트 접근을 허용하는 안전하지 않은 헤더 목록이 담겨 있다.

```js
200 OK
Content-Type:text/html; charset=UTF-8
Content-Length: 12345
API-Key: 2c9de507f2c54aa1
Access-Control-Allow-Origin: https://javascript.info
Access-Control-Expose-Headers: Content-Length,API-Key
```

## 안전하지 않은 요청

요츰엔 `GET`, `POST` 뿐만 아니라 `PATCH`, `DELETE` 등 어떤 메서드도 사용할 수 있다.

과거에는 get 과 post 만 가능한 웹서버만 있었고 요즘도 종종 있다. 혼란스런 상황을 방지하기 위해서 안전하지 않은 요청( 위에서 안전한 요청에 조건을 벗어나는 요청) 을 보낼 때는 바로 요청을 보내지 않고 `preflight` 요청을 사전에 보낸다.

preflight 요청은 `OPTIONS` 메서드를 사용하고 두 헤더가 함께 들어가며, 본문은 비어있다.

- `Access-Control-Request-Method` - 안전하지 않은 요청에 사용하는 메서드 정보
- `Access-Contorl-Request-Header` - 안전하지 않은 요청에 사용하는 헤더 목록

안전하지 않은 요청을 허용하기로 협의했다면 서버는 본문이 비어있고 상태 코드가 200인 응답을 다음과 같은 헤더와 함께 브라우저로 보낸다.

- `Access-Contorl-Allow-Origin` - `*`나 요청을 보낸 오리진
- `Access-Control-Allow-Method` - 허용된 메서드 정보
- `Access-Control-Allow-Headers` - 허용된 헤더 목록
- `Access-Control-Max-Age` - 퍼미션 체크 여부를 몇 초간 캐싱해 놓을지를 명시. 이렇게 캐싱해 놓으면 브라우저는 일정 기간 동안 preflight 요청을 생략하고 안전하지 않은 요청을 보낼수 있다.

<img src="./images/210910-fetch와 cross-origin요청/2.png" width="500">

실제 `PATCH` 메서드를 사욭하는 예시를 통해서 확인해 본다.

```js
let response = await fetch("https://site.com/service.json", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "API-Key": "secret",
  },
});
```

위 요청은 안전한 요청에 조건을 벗어나므로 안전하지 않은 요청이다.

### 1 단계 priflight 요청

```
OPTIONS /service.json
Host: site.com
Origin: https://javascript.info
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: Content-Type,API-Key
```

### 2 단계 priflight 응답

```
200 OK
Access-Control-Allow-Origin: https://javascript.info
Access-Control-Allow-Methods: PUT,PATCH,DELETE
Access-Control-Allow-Headers: API-Key,Content-Type,If-Modified-Since,Cache-Control
Access-Control-Max-Age: 86400
```

### 3 단계 실제 요청

이제 부터는 안전한 요청에 대한 프로세스와 동일하다. 본 요청은 크로스 오리진 요청이기 때문에 `Origin` 헤더가 붙는다.

```
PATCH /service.json
Host: site.com
Content-Type: application/json
API-Key: secret
Origin: https://javascript.info
```

### 4단계 실제 응답

서버에서 본 응답에 `Access-Contorl-Allow-Origin` 헤더를 반드시 붙여야 한다.

```
Access-Control-Allow-Origin: https://javascript.info
```

> preflight 요청은 자바스크립트를 사용해 관찰 할 수 없다. preflight 요청이 거부된 경우 에러만 확인할 수 있다.

## 자격 증명

크로스 오리진 요청은 기본적으로 자격 증명이 함께 전송되지 않는다. 이렇게 한 이유는 크로스 오리진 요청 시 자격 증명을 함께 전송할 수 있으면 사용자 동의 없이 자바스크립트로 민감한 정보에 접근할 수 있기 때문이다.

그럼에도 불구하고 자걱 증명이 담긴 헤더를 명시적으로 허용하겠다는 세팅을 서버에 해줄 수 있다.

`fetch` 메서드에 자격 정보를 함께 전송하려면 다음과 같이 `credentials: "include"` 옵션을 추가하면 된다.

```js
fetch("http://another.com", {
  credentials: "include",
});
```

서버에서 자격 증명 정보가 담긴 요청을 받아들이기로 했다면 응답에 `Access-Control-Allow-Origin` 헤더와 함께 `Access-Conrol-Allow-Credentials: true` 헤더를 추가해서 보낸다.

```
200 OK
Access-Control-Allow-Origin: https://javascript.info
Access-Control-Allow-Credentials: true
```

이때, `Access-Contorl-Allow-Origin`에 \*를 쓸 수 없다. 정확한 오리진 정보만 명시되어야 서버에서 신뢰할 수 있기 때문이다.
