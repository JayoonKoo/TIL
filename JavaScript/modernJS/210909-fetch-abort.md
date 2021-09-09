# Fetch: Abort

fetch 는 promise를 반환하고 자바스크립트에서는 fetch를 중단하는 개념이 없다. 이런 목적을 위해 내장된 객체인 `AbortController`가 있다.
이것은 fetch 뿐만 아니라 비동기 작업에서도 사용될 수 있다.

## The AbortController object

```js
let controller = new AbortController();
```

반환하는 객체는 간단하다.

- `abort()` 메서드를 갖는다.
- 이벤트 등록을 위한 `signal` 프로퍼티를 갖는다.

`abort()`가 호출되었을 때

- `controller.signal` 은 `abort` 이벤트를 내보낸다.
- `controller.signal.aborted` 프로퍼티가 `true`가 된다.

취소 가능한 작업을 `controller.signal`에 리스너로 등록한다. `controller.abort()`를 호출할때 리스너가 트리거 된다.

fetch를 포함하지 않은 예제는 다음과 같다.

```js
let controller = new AbortController();
let signal = controller.signal;

// teh party that performs a cancelable operation
// gets "signal" object
// and sets the listener to trigger when controller.abort() is called
signal.addEventListener("abort", () => alert("abort!!"));

// the other party, that cancels (at any point later)
controller.abort(); // abort!!

//the event triggers and signal.aborted becomes true
alert(signal.aborted); // true
```

코드에서 AbortController 없이 비슷한 작업을 할 수 있지만 fecth 가 AbortController 객체와 함께 작동하고 통합된다는것이 중요하다.

## Using with fetch

`AbortController`에 `signal`프로퍼티를 `fetch`에 옵션으로 전달해 주면 된다.

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal,
});
```

fetch가 중단되면 `AbortError`를 던진다. `try..catch`를 통해서 에러를 잡을 수 있다.

전체 예제

```js
// abort in 1 second
let controller = new AbofrtController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch("/article/fetch-abort/demo/hang", {
    signal: controller.signal,
  });
} catch (err) {
  if (err.name == "AbortError") {
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

## AbortController is scalable

`AbortController`은 확장가능햇 한번에 여러 fetch를 중단시킬 수 있다.

```js
let urls = [...];

let controller = new AbortController();

// an array of fetch promises
let fetchJobs = urls.map(url => fetch(url, {
	signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// if controller.abort() is called from elsewhere, it aborts all fetches
```

다른 비동기 작업도 `fetch`와 함께 하나의 `AbortController`로 멈출 수 있다.

우린 단지 `abort` 이벤트를 들으면 된다.

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) =>  {
	// our task
	controller.signal.addEventListener('abort', reject);
})

let fetchJobs = urls.map(url => fetch(url, {
	signal: controller.signal
}));

// Wait for feches and our tast in parallel
let results = await Promise.all([...fetchJobs, ourJob]);

// if controller.abort() is called from elsewhere, it aborts all fetches and our Job
```
