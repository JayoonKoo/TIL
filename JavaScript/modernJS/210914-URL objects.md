# URL objects

URL 객체를 사용할 수 있다. 물론 string을 사용해도 충분 하지만 유요한 기능을 제공 하기도 한다.

## Creating a URL

```js
new URL(url, [base]);
```

- `url` - full url 이나 베이스가 설정되어 있다면 패스 만
- `base` - base가 설정 되어 있으면 base와 관련지어서 생성된다.

다음에 두가지 url은 같다.

```js
let url1 = new URL("https://javascript.info/profile/admin");
let url2 = new URL("/profile/admin", "https://javascript.info");
```

url 객체를 사용하면 객체에 구성소에 바로 접근할 수 있다.

```js
let url = new URL("https://javascript.info/url");

alert(url.protocol); // https:
alert(url.host); // javascript.info
alert(url.pathname); // /url
```

url에 구조는 다음과 같다.

<img src="images/210914-URL objects/1.png" width="500">

> 네트워킹 메서드에 문자열 대신에 URL Object를 전달할 수 있다.
> 예를 들면 `fetch`나 `XMLHttpRequest`에서

## SearchParams "?.."

파라미터는 만약 공백이 포함되어 있거나 라틴 글자가 아니면 인코딩이 필요하다.

글새 `url.searchParams`는 유용한 메서드를 제공한다.

- `append(name, value)` - name에 해당하는 파라미터를 추가한다.
- `delete(name)` - name 에 해당하는 파라미터를 제거한다.
- `get(name)` - name 에 해당하는 파라미터를 얻는다.
- `getAll(name)` - name 에 해당하는 파라미터를 모두 얻는다.(여러개일 경우)
- `has(name)` - name에 해당하는 파리머터가 있는지 체크한다.
- `set(name, value)` - set/relace 파리미터
- `sort()` - 이름으로 정렬한다, 드물게 필요하다.

사용 예시는 다음과 같다.

```js
let url = new URL("https://google.com/search");

url.searchParams.set("q", "test me!"); // added parameter with a space and !

alert(url); // https://google.com/search?q=test+me%21

url.searchParams.set("tbs", "qdr:y"); // added parameter with a colon :

// parameters are automatically encoded
alert(url); // https://google.com/search?q=test+me%21&tbs=qdr%3Ay

// iterate over search parameters (decoded)
for (let [name, value] of url.searchParams) {
  alert(`${name}=${value}`); // q=test me!, then tbs=qdr:y
}
```

## Encoding

url에 가능한 글자가 RFC3986에 정의 되어 있다. 제공되지 않는 문자열에 경우 인코딩이 필요하다.

다행인건, URL Object를 사용하면 자동으로 이 작업을 해준다.

```js
let url = new URL("https://ru.wikipedia.org/wiki/Тест");

url.searchParams.set("key", "ъ");
alert(url); //https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%81%D1%82?key=%D1%8A
```

### Encoding String

URL Object가 아니라 문자열을 사용하는 경우 특수 문자를 수동으로 인코딩/ 디코딩 해야 한다.

몇가지 내장된 메소드는 다음과 같다.

- `encodeURI`
- `decodeURI`
- `encodeURIComponent` - 파라미터나 헤쉬 값 같은 것
- `decodeURIComponent`

`encodeURI`와 `encodeURIComponent`에 차이는 무엇일까?

예시 url

```
https://site.com:8080/path/page?p1=v1&p2=v2#hash
```

`:`, `?`, `=`, `&`, `#`와 같은 문자가 url에서 허용된다. 파라미터로 사용되는 문자열에는 이런 문자열이 포함되어야 하는데 url에 허용되는 문자열이기 때문에 인코딩 되지 않는 문제가 있다.

따라서 이러한 문자는 형식을 깨드리지 않고 인코딩되어야 한다.

전체 URL은 `encodeURI`를 사용한다.

```js
// using cyrillic characters in url path
let url = encodeURI("http://site.com/привет");

alert(url); // http://site.com/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82
```

매개변수를 사용하는 경우 `encodeURIComponent`를 대신해서 사용해야 한다.

```js
let music = encodeURIComponent("Rock&Roll");

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock%26Roll
```

`encodeURI`와 비교하면 다음과 같다.

```js
let music = encodeURI("Rock&Roll");

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock&Roll
```

& 은 Rock 그리고 Roll 이라는 파라미터를 의미하고 이는 적절히 인코딩 되어야 한다. 그런데 encdoeURI를 사용하면 &를 허용하기 때문에 인코딩 되지 않는 문제가 있다.
