# Fecth API

fetch에 api에 대해서 알아본다.

다음은 기본값과 함께 가능한 모든 fetch 옵션에 전체 목록이다.

```js
let promise = fetch(url, {
  method: "GET", // POST, PUT, DELETE, etc.
  headers: {
    // the content type header value is usually auto-set
    // depending on the request body
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined // string, FormData, Blob, BufferSource, or URLSearchParams
  referrer: "about:client", // or "" to send no Referer header,
  // or an url from the current origin
  referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
  mode: "cors", // same-origin, no-cors
  credentials: "same-origin", // omit, include
  cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
  redirect: "follow", // manual, error
  integrity: "", // a hash, like "sha256-abcdef1234567890"
  keepalive: false, // true
  signal: undefined, // AbortController to abort request
  window: window // null
});
```

## referrer, refererPolicy

`Referer`헤더를 어떻게 설정할지를 결정한다. 보통 자동오르 설정된다. 대부분의 경우 자동으로 사용하지 않지만, 보안상의 이유로 제거하거나 줄이는 경우가 있다.

referrer를 보내고 싶지 않다면 빈 문자열을 입력한다.

```js
fetch("/page", {
  referrer: "", // no Referer header
});
```

current origin 내에서 referrer 를 설정할 수 있다.

```js
fetch("/page", {
  // assuming we're on https://javascript.info
  // we can set any Referer header, but only within the current origin
  referrer: "https://javascript.info/anotherpage",
});
```

`referrerPolicy` 는 `Referer`를 설정하는 일반적인 규칙이다.

리퀘스틑 3가지 타입으로 나뉜다.

1. 같은 origin에서 리퀘스트
2. 다른 origin에서 리퀘스트
3. HTTPS 에서 HTTP로 리퀘스트 (안전한 프로토콜에서 안전하지 않은 프로콜로)

`referrerPolicy` 에 가능한 설정은 다음과 같다.

- `no-referrer-when-downgrade` : 전체 참조자는 HTTPS 에서 HTTP(덜 안전한) 프로토콜로 요처을 보내지 않는한 전체가 보내진다.
- `no-referrer` : Referer을 보내지 않는다.
- `origin` : Referer로 항상 origin만 보내도록 설정한다.
- `origin-when-cross-origin` 같은 origin에서는 full로 보내지만 cross origin에 경우에는 origin만 보낸다.
- `same--origin` : 같은 origin에서는 full로 보내고 cross origin에 경우에는 보내지 않는다.
- `strict-origin` : https -> http 인 경우는 보내지 않고 남지는 origin을 보낸다.
- `strict-origin-when-cross-origin` : same origin에 경우 full로, cross origin에 경우 origin만 보낸다. HTTPS->HTTP에 경우 아무것도 보내지 않는다.
- `unsafe-url` : 항상 full로 보낸다. HTTPS->HTTP인 경우도 포함.

표는 다음과 같다.
