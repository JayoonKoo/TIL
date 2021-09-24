# XMLHttpRequest

브라우저에 내장 객체이다. 자바스크립트로 request를 보낼 수 있게 해준다. 이름과 달리 XML 뿐만 아니라 다른 어떤 형식에 대해서도 가능하다.

요즘은 fetch라는 모던한 기능이 있어서 더이상 사용되지 않는다. 모던 웹에서 3가지 이류로 사용된다.

1. 예전 코드에 이미 적용된 경우
2. 플로필 하고 싶지 않고 옛날 브라우저에서도 가능하게 하려면 사용해야 함.
3. 업로드 과정을 트래킹 한다든지 아직 fetch에서 지원하지 않는 기능을 사용하려면

## the basic

`XMLHttpRequest`에는 비동기와 동기 동작이 있다. 주로 사용되는 동기 동작부터 알아본다.

1. `XMLHttpRequest` 생성

```js
let xhr = new XMLHttpRequest();
```

2. 보통 생성하고 나서 초기화 한다.

```js
xhr.open(mehtod, URL, [async, user, password]);
```

- `method` : HTTP method 보통 `GET`이나 `POST`이다.
- `URL` : 리퀘스트 보내는 URL, 스트링이나 URL 오브젝트가 될 수 있다.
- `async` : 만약 `false`로 설정할 경우 동기로 동작한다.
- `user`, `password` : 기본 HTTP에서 인증을 위해 사용함. 필요할때 추가한다.

`open`이라는 메서드는 request를 구성한다고 생각하면 된다. 실제적으로 요청을 보내는 것은 `send`라는 메서드를 통해서 진행된다.

3. 보내기

```js
xhr.send([body]);
```

실제 적으로 연결을 open 하고 서버로 데이터를 request 한다. body 파라미터를 통해서 데이터를 보낼 수 있는데, `GET`메서드의 경우 body 파라미터가 필요 없을 수 있다. `POST` 메서드로 요청을 보낼때 body에 데이터를 담아서 보낸다.

4. 응답에 대한 xhr 이벤트를 듣는다.

다음에 세가지 이벤트가 주로 폭넓게 사용된다.

- `load` : request가 완전히 완료 되었을때(심지어 400 이나 500에 상태코드를 받았을 때도), 응답이 완전히 받아졌을때도
- `error` : request가 만들어지지 않았을때, 잘못된 URL이거나 하는 등..
- `progress` : 얼마나 다운로드 됬는지 리포트 한기 위해서 주기적으로 트리거 된다.

```js
xhr.onload = function () {
  alert(`Loaded: ${xhr.status} ${xhr.response}`);
};

xhr.onerror = function () {
  // only triggers if the request couldn't be made at all
  alert(`Network Error`);
};

xhr.onprogress = function (event) {
  // triggers periodically
  // event.loaded - how many bytes downloaded
  // event.lengthComputable = true if the server sent Content-Length header
  // event.total - total number of bytes (if lengthComputable)
  alert(`Received ${event.loaded} of ${event.total}`);
};
```

progress 를 프린트하는 전체 예제는 다음과 같다.

```js
// 1. Create a new XMLHttpRequest object
let xhr = new XMLHttpRequest();

// 2. Configure it: GET-request for the URL /article/.../load
xhr.open("GET", "/article/xmlhttprequest/example/load");

// 3. Send the request over the network
xhr.send();

// 4. This will be called after the response is received
xhr.onload = function () {
  if (xhr.status != 200) {
    // analyze HTTP status of the response
    alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
  } else {
    // show the result
    alert(`Done, got ${xhr.response.length} bytes`); // response is the server
  }
};

xhr.onprogress = function (event) {
  if (event.lengthComputable) {
    alert(`Received ${event.loaded} of ${event.total} bytes`);
  } else {
    alert(`Received ${event.loaded} bytes`); // no Content-Length
  }
};

xhr.onerror = function () {
  alert("Request failed");
};
```

서버가 응답하면 다음에 xhr 속성에서 결과를 받아올 수 있다.

`status` : HTTP status code를 확인할 수 있다. HTTP가 아닌 오류의 경우에는 0이 될 수 있다.

`statusText` : HTTP status message를 확인할 수 있다. (OK, Not Found 같은거..)

`response`(오래된 스크립트는 `responseText`를 사용할 것이다.) : 서버에 응답 본문이다.

또한, timeout 프로퍼티를 설정해서 설정한 시간동안 응답을 받이 못하면 `timeout` 이벤트가 트리거 되게 할 수 도 있다.

```js
xhr.timeout = 10000; // timeout in ms, 10 seconds
```

> 파라미터를 설정하고 적절히 인코딩 되는것을 보장하기 위해서 URL Object를 사용할 수 도 있다.

```js
let url = new URL("https://google.com/search");
url.searchParams.set("q", "test me!");

// the parameter 'q' is encoded
xhr.open("GET", url); // https://google.com/search?q=test+me%21
```

## Response Type

`xhr.responseType` 프로퍼티를 사용하엿 응답 포멧을 설정할수 있다.

- `""` : string
- `"text"` : string
- `"arraybuffer"` : `ArrayBuffer`
- `"blob"` - `Blob`
- `"document"` - XML document
- `"json"` - JSON

JSON으로 응답 받는 예제는 다음과 같다.

```js
let xhr = new XMLHttpRequest();

xhr.open("GET", "/article/xmlhttprequest/example/json");

xhr.responseType = "json";

xhr.send();

// the response is {"message": "Hello, world!"}
xhr.onload = function () {
  let responseObj = xhr.response;
  alert(responseObj.message); // Hello, world!
};
```

> 예전에는 `xhr.responseText` 나 `xhr.responseXML` 같은걸 사용했는데 요즘에는 `xhr.responseeType`을 설정하고 `xhr.response`를 받는 방법을 주로 사용한다.

## Ready states

`XMLHttpRequest`는 진행됨에 따라서 상태가 바뀐다. 접근 가능한 상태는 다음과 같다.

```js
UNSENT = 0; // initial state
OPENED = 1; // open called
HEADERS_RECEIVED = 2; // response headers received
LOADING = 3; // response is loading (a data packed is received)
DONE = 4; // request complete
```

순서는 다음과 같아 진다. 0 -> 1 -> 2 -> 3 -> ... -> 3 -> 4, 3이 반복되는 이유는 네트워크에서 패킷을 받을때마다 3 상태가 되기 때문이다.

`readystateChange`이벤트를 통해 트래킹 할 수 있다.

```js
xhr.onreadystatechange = function () {
  if (xhr.readyState == 3) {
    // loading
  }
  if (xhr.readyState == 4) {
    // request finished
  }
};
```

이 이벤트는 예전에 사용하던 것으로 역사적인 이유로 남아있다. 요즘은 `open/ error / progress` 같은것을 사용하면 된다.

## Aborting request

`xhr.abort()` 를 호출하면 즉시 request를 중단할 수 있다.

```js
xhr.abort();
```

`abort`가 트리거 되면. `xhr.status` 는 0 이 된다.

## Synchronous requests

`open`에 3번째 파라미터인 `async`에 값이 `false` 로 절정되면 요청이 비동기로 실행될 것이다. 이는 alert 이나 prompt와 같이 실행이 멈춘되 응답을 받으면 다시 실행된다는 것을 의미한다.

```js
let xhr = new XMLHttpRequest();

xhr.open("GET", "/article/xmlhttprequest/hello.txt", false);

try {
  xhr.send();
  if (xhr.status != 200) {
    alert(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    alert(xhr.response);
  }
} catch (err) {
  // instead of onerror
  alert("Request failed");
}
```

동기를 사용하면 사이트가 멈춘것 처럼 보이기 때문에 거의 사욯아지 않는다. 또한 진행 사항을 보는 기능이던지 timout을 설정하는 기능이던지 `XMLHttpRequest`에 정의되어 있는 기능을 사용할 수 없게 된다. 따라서 대부분의 경우는 비동기를 사용하면 된다.

## HTTP-headers

`XMLHttpRequests`에 요청에 헤더를 설정하고 헤더를 읽을 수 도 있다.

### `setRequestHeader(name, value)`

리퀘스트에 헤더를 설정한다.

```js
xhr.setRequestHeqader("Content-Type", "application/json");
```

> 헤더 제한 : 몇몇에 헤더들은 브라우저에 의해서 관리된다. (`Referer` and `Host`)
> 헤더를 제거할 수는 없다. 헤더는 추가 설정되지 덮어씌워지지 않는다.

```js
xhr.setRequestHeader("X-Auth", "123");
xhr.setRequestHeader("X-Auth", "456");

// the header will be:
// X-Auth: 123, 456
```

### `getResponseHeader(name)`

header를 주어진 이름을 통해서 얻는다. (`Set-Cookie`나 `Set-Cookie2` 제외)

```js
xhr.getReponseHeader("Content-Type");
```

### `getAllResponseHeaders()`

`Set-Cookie` 나 `Set-Cookie2`를 제외한 모든 헤더를 얻는다.

```
Cache-Control: max-age=31536000
Content-Length: 4260
Content-Type: image/png
Date: Sat, 08 Sep 2012 16:53:16 GMT
```

개행은 항상 `\r\n`이다. os에 의존하지 않는다.

헤더 덮어씌우기 예제

```js
let headers = xhr
  .getAllResponseHeaders()
  .split("\r\n")
  .reduce((result, current) => {
    let [name, value] = current.split(": ");
    result[name] = value;
    return result;
  }, {});

// headers['Content-Type'] = 'image/png'
```

## POST, FormData

POST로 리퀘스트를 보낼때 FormData Object를 사요할 수 있다.

```js
let formData = new FormData([form]); // create an object
formdata.append(name, value); // appends a field
```

form을 설정하면 `xhr.open('POST', ...)` POST 메서드로 리퀘스트를 설정하고, `xhr.send(formData)` 에 send 메서드에 formData를 전달해서 리퀘스트 할 수 있다.

```html
<form name="person">
  <input name="name" value="John" />
  <input name="surname" value="Smith" />
</form>

<script>
  // pre-fill FormData from the form
  let formData = new FormData(document.forms.person);

  // add one more field
  formData.append("middle", "Lee");

  // send it out
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/article/xmlhttprequest/post/user");
  xhr.send(formData);

  xhr.onload = () => alert(xhr.response);
</script>
```

form 은 기본적으로 `multipart/form-data`로 보내진다. 만약 json으로 보내고 싶으면 `JSON.stringfy()` 를 통해 스트링으로 변환 후 보내면 된다. 이때, 헤더에 `Content-Type: applicatioin/json`을 설정해 두면 서버 측에 프레임워크에서 자동으로 JSON으로 디코딩 할수 있는 정보를 줄수 있다.

```js
let xhr = new XMLHttpRequest();

let json = JSON.stringify({
  name: "John",
  surname: "Smith",
});

xhr.open("POST", "/submit");
xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

xhr.send(json);
```

`sned(body)` 에서 body에는 정말로 다양한 매개변수를 받을 수 있다. 사용 가능한 예로는 `body`, `Blob` 그리고 `BufferSource` 객체가 있다.

## Upload progress

`progress` 이벤트는 다운로드 할때만 동작한다. post 요청이 보내지고 업로드가 완료되고 나면 response가 오는데 이때 추적을 할 수 있다.

만약 Upload에 트랙킹을 사용하고 싶다면 이때 사용하는 다운로드를 트래킹할때 사용하는 `xhr.onprogress`는 도움이 되지 못할 것이다. 대신에 xhr에서는 명시적으로 업로드를 트래킹할 수 있는 `xhr.upload`를 제공한다.

다음에 이벤트를 발생시킨다.

- `loadstart` - upload started
- `progress` - triggers periodically during the upload
- `abort` - upload aborted.
- `error` - non-HTTP error.
- `load` - upload finished successfully.
- `timeout` - upload timed out (if `timout` property is set.)
- `loadend` = upload finished with either success of error.

헨들러 예제 :

```js
xhr.upload.onprogress = function (event) {
  alert(`Uploaded ${event.loaded} of ${event.total} bytes`);
};

xhr.upload.onload = function () {
  alert(`Upload finished successfully.`);
};

xhr.upload.onerror = function () {
  alert(`Error during the upload: ${xhr.status}`);
};
```

실전 예제 :

```html
<input type="file" onchange="upload(this.files[0])" />

<script>
  function upload(file) {
    let xhr = new XMLHttpRequest();

    // track upload progress
    xhr.upload.onprogress = function (event) {
      console.log(`Uploaded ${event.loaded} of ${event.total}`);
    };

    // track completion: both successful or not
    xhr.onloadend = function () {
      if (xhr.status == 200) {
        console.log("success");
      } else {
        console.log("error " + this.status);
      }
    };

    xhr.open("POST", "/article/xmlhttprequest/post/upload");
    xhr.send(file);
  }
</script>
```

## Cross-origin requests

기본적으로 fetch의 정책와 같이 `Cross-origin` request 를 보낼 수 있다. fetch 와 바찬가지로 cookie와 HTTP-authorization을 다른 origin으로 보낼 수 없는데 이를 이런 설정을 사용하기 위해서는 `xhr.withCredentials`이 `true`가 되어야 한다.

```js
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.open('POST', 'http://anywhere.com/request');
...
```
