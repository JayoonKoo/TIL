# Fetch: download progress

fetch 를 사용하면 다운로드 과정을 추적할 수 있다. 현재는 업로드를 추적할 수는 없어서 업로드를 추적하려면 `WMLHttpRequest` 를 사용해야 함.

`response.body` 속성을 사용해서 접근할 수 있다. `ReadableStream`이라는 청크 단위로 제공하는 특수 객체를 이요한다.

`reponse.text()`나 `response.json()` 와는 다르게 `reponse.body` 는 전체 과정에을 카운트 할 수 있다.

```js
// instead of reponse.json() and other methods
const reader = reponse.body.getReader();

// infinite loop while the body is downloading
while (true) {
  // done is true for the last chunk
  // value is Uint8Array of the chunk bytes
  const { done, value } = await reader.read();

  if (done) {
    break;
  }
}
```

`await reader.read()`에 결과는 다음 두가지 프로퍼티를 가진 결과이다.

- done : 읽기가 모두 완료 됬으면 `true`, 아니면 `false`
- value : `Uint8Array` 타입인 `Array`

> ReadableStream 은 `for awiat ..of`도 지원한다, 하지만 아직까지 모든 브라우저에서 지원하는 것이 아니기 때문에 여기서는 while를 사용했다.

진행사항을 로깅하는 전체 예제는 다음과 같다.

```js
// step 1 : start the fecth and obtain a reader
let response = await fetch(
  "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100"
);

const reader = response.body.getReader();

// step 2 : get total length
const contentLength = +response.headers.get("Content-Length");

// step 3 : read the data
let recivedLength = 0; // received that many bytes at the momnet
let chunks = []; // array of received binary chunks (comprises the body)
while (true) {
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`);
}

// step 4: concatenate chunks into single Uint8Array
let chunksAll = new Uint8Array(receivedLength);
let position = 0;
for (let chunk of chunks) {
  chunksAll.set(chunk, position);
  position += chunk.length;
}

// step 5: decode into a string
let result = new TextDecoder("utf-8").decode(chunksAll);

// We're done!
let commits = JSON.parse(result);
alert(commits[0].author.login);
```

> "Received 79656 of 0"  
> "Received 437910 of 0"

- `response.json()`을 통해 데이터를 읽지 않았다.
- `Content-Length` 헤더를 통해서 `response`에 길이를 알 수 있다.
- `chunks` 배열에 `chunk`를 모은다. `response`는 한번 읽으면 다시 읽을 수 없기 때문이다.
- `chunksAll`에 하나의 결과로 모은다. 아쉽게도 다른 메서드가 없기 때문에 반복문을 사용햇 가각의 chunk를 .set을 통해 복사한다. 하지만 아직도 바이트 어레이이다.
- byte를 string으로 해석할 필요가 있다. `TextDecoder`은 원하는 딱 이런 작업을 해줌.
