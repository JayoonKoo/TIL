# 프라미스와 에러 핸들링
존재하지 않는 url로 fetch 하는 예제를 살펴본다.
```js
fetch("https://no-such-server.blabla")  // 거부
	.then(reponse => reponse.json)
	.catch(console.log) // TypeError
```

<br/>

## 암시적 try..catch
예외가 발생하면 암시적 보이지 않는 암시적 `try..catch` 에서 에러를 잡고 이를 reject처럼 다룬다. 
따라서 `.catch` 를 통해서 던져진 에러를 핸들링 할 수 있다. 

`executor` 안에서 잡혀진 에러는 거부된 상태에 파리미스로 반환된다.
따라서 제어 흐름이 가장 가까운 에러 헨들러로 넘어간다. 

<br/>

## 다시 던지기
마지막에 `.catch` 를 통해서 여러개의 `.then` 에서 발생한 모든 에러를 처리할 수 있다. 
`try..catch`에서 처리할수 없는 에러를 다시 던진 것처럼 프라미스에서도 비슷하게 처리할 수 있다. 

```js
//실행 순서 : catch -> catch
new Promise((resolve, reject) => {
	throw new Error("에러 발생");
})
	.catch(err => {
		if (err instanceof URIError) {
			// 에러처리
		} else {
			console.log('처리할 수 없는 에러');
			throw err; // 에러 다시 던지기
		}
	})
	. then(() => {
		// 여기는 실행되지 않는다.
		// 에러가 잘 처리되지 않고 다시 던져졌기 때문에 
	})
	.catch(err => {
		console.log(`알수 없는 에러 발생: ${err}`);
	});
```

<br/>

## 처리되지 못한 거부
에러가 발생했는데 만약 `.catch`를 통해서 잡지 않았다면 에러가 갇히게 된다. 
실무에서는 끔찍한 상황이 벌어지게 된다. 

만약 에러를 처리하지 못했다면 전역 에러를 발생시킨다. 부라우저 환경에선 에러가 발생했는데 `.catch` 가 없으면 `unhandledrejection` 핸들러가 트리거 된다. 이 이벤트로 원하는 작업을 할 수 도 있다. 

<br/>

## executor 안에서 비동기적으로 발생한 에러
```js
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("에러 발생!");
  }, 1000);
}).catch(alert);
```
위 코드에서 암시적 `try..catch`로 인해 `catch`에서 에러가 처리될거 같지만, 실제로는 setTimout에 의해서 비동기적으로 처리되는 부분에서 에러가 발생했으므로 catch에서 에러가 처리되지 않는다. 
