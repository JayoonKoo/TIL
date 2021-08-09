# 프라미스 API
`Promise` 클래스에는 5가지 정적 메서드가 있다. 

## Promise.all
복수의 `Promise`를 처리할 때 
```js
let promise = Promise.all([...promises...])
```
배열로 넘겨준 promises 가 모두 처리가 끝나면 결과값을 담은 배열을 `result` 로 하는 새로운 `promise`를 반환한다. 

```js
Promise.all([
	new Promise(resolve => setTimeout(()=> resolve(1), 3000)),
	new Promise(resolve => setTimeout(()=> resolve(2), 2000)),
	new Promise(resolve => setTimeout(()=> resolve(3), 1000))
]).then(console.log);
```
프라미스는 3초후에 실행되고 결과값인 `result` 는 `[1,2,3]` 이 된다. 
처리된 순서가 아니라 배열로 넘겨준 순서이다. 

`fetch`에 응용할 수 있다. 
```js
let urls = [
	'https://api.github.com/users/iliakan',
	'https://api.github.com/users/remy',
	'https://api.github.com/users/jeresig',
]

// fetch를 이용해서 url을 promise로 매핑
let requests = urls.map(url => fetch(url));

Promise.all(requests)
	.then(responses => responses.forEach(
		response => console.log(response.url + response.status)
	));
```

`Promise.all`에서 넘겨준 배열에서 하나라도 에러가 발생하면 에러가 발생한 시점에서 모든 프로미스가 거부되고 `.catch`가 실행된다. 

> Promise.all에 넘겨주는 값이 이터러블 객체가 아니더라도 값을 넘겨줄수 있다. 값을 넘겨주면 넘겨준 값 그대로 반환 된다. 
> 이미 값을 구한 프라미스는 그냥 전달해 주기만 하면 된다. 

```js
Promise.all([
	new Promise((resolve, reject) => {
		setTimeout(() => resolve(1), 1000)
	}),
	2, 
	3
]).then(console.log); // 1, 2, 3 (1초 후 )
```

## Promise.allSettled
> 구식 브라우저에서는 폴리필 필요

모든 프라미스가 처리될 때까지 기다린다. 
- 응답이 성공한 경우 - `{status: "fulfilled", value: result}`
- 에러가 발생한 경우 - `{status: "rejected", value: error}`

`fetch` 로 보낸 여러 요청 중 실패하더라도 성공한 요청은 남아있어야 하는 경우라면
```js
let urls = [
	'https://api.github.com/users/jayoonKoo',
	'https://no-such-url',
];

Promise.allSettled(urls.map(url => fetch(url)))
	.then(result => {
		result.forEach((result, num) => {
			if (result.status == "fulfilled") {
				console.log(`${urls[num]}: ${result.value.status}`);
			}
			if (result.status == "rejected") {
				console.log(`${urls[num]}: ${result.reason}`);
			}
		});
	});
```

### 폴리필
```js
if(!Promise.allSettled) {
	Promise.allSettled = function(promises) {
		return Promise.all(promises.map(p=> Promise.resolve(p).then(value => ({
			status: 'fulfilled',
			value
		}), reason => ({
			status: 'rejected',
			reason
		}))));
	};
}
```

## Promise.race
가장 먼저 처리되는 프라미스의 결과(혹은 에러)를 반환한다.
```js
let promise = Promise.race(iterable);
```

```js
Promise.race([
	new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
	new Promise((resolve, reject) => setTimeout(() => reject(new Error("애러 발생")), 2000)),
	new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).then(console.log); // 1 
```

## Promise.resolve/reject 
`async/awiat` 문법이 나온 이후로 잘 사용하지 않음. 
### Promise.resolve
다음과 같음.
```js
let promise = new Promise(resolve => resolve(value));
```
```js
let cache = new Map();

function loadCached(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url)); // (*)
  }

  return fetch(url)
    .then(response => response.text())
    .then(text => {
      cache.set(url,text);
      return text;
    });
}
```
### Promise.reject
다음과 같음.
```js
let promise = new Promise((resolve, reject) => reject(error));
```
