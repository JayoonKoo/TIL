# 프라미스 체이닝
프라미스 체이닝을 이용한 비동기 처리에 대해서 알아본다. 

```js
new Promise(function(resolve, reject) {
	setTimeout(() => resolve(1), 1000);
})
	.then(function(result) {
		console.log(result); // 1
		return result * 2;
	})
	.then(function(result) {
		console.log(result); // 2
		return result * 2;
	})
	.then(function(result) {
		console.log(result); // 4
		return result * 2;
	})
```

이런게 되는 이유는 `.then` 을 호출하면 프라미스가 반환되기 때문이다. 
한편으로는 핸들러에서 반환하는 값이 프라미스의 `result`가 된다. 

초보자들이 흔히 하는 실수 중 하나는 프라미스 하나에 여러가지 .then 을 추가한 후 에 체이닝이라고 생각하는 것이다. 
```js
let promise = new Promise(function(resolve, reject) {
	setTimeout(() => resolve(1), 1000);
})

promise.then(function(result) {
	console.log(result) // 1
	return result * 2;
})

promise.then(function(result) {
	console.log(result) // 1
	return result * 2;
})

promise.then(function(result) {
	console.log(result) // 1
	return result * 2;
})
```

<br/>

## 프라미스 반환하기
`.then`으로 등록한 핸들러에서 프라미스를 반환하는 경우도 있다. 
이 경우에는 프라미스 처리가 완료된 이후에 다음 `.then` 이 호출된다. 

```js
new Promise(function(resolve, reject) {
	setTimeout(() => resolve(1), 1000);
})
	.then(function(result) {
		console.log(result) //1
		return new Promise(function(resolve, reject) => {
			setTimeout(() => resolve(result * 2), 1000);
		})
	})
	.then(function(result) {
		console.log(result) //2
		return new Promise(function(resolve, reject) => {
			setTimeout(() => resolve(result * 2), 1000);
		})
	})
	.then(function(result) {
		console.log(result) //4
	})
```
1초에 시간씩 기다린 후에 표시 된다. 

<br/>

## loadScript 예시 개선하기
```js
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // 불러온 스크립트 안에 정의된 함수를 호출해
    // 실제로 스크립트들이 정상적으로 로드되었는지 확인합니다.
    one();
    two();
    three();
  });
```

화살표 함수를 이용해서 줄이기

```js
loadScript("/article/promise-chaining/one.js")
  .then(script => loadScript("/article/promise-chaining/two.js"))
  .then(script => loadScript("/article/promise-chaining/three.js"))
  .then(script => {
    // 스크립트를 정상적으로 불러왔기 때문에 스크립트 내의 함수를 호출할 수 있습니다.
    one();
    two();
    three();
  });
```

> thenable : .then 이라는 메서드를 가진 객체는 모두 `thenable`이라고 부른다. 핸들러는 모두 `thenable`객체를 반환한다고도 할 수 있다 이점을 활용해서 Promise를 상속받지 앋고도 커스텀 객체를 사용해 프라미스 체이닝을 만들 수 도 있다. 


<br/>

## fetch와 체이닝 함께 응용하기
기본 문법
```js
let promise = fecth(url);
```
해당 url로 요청을 보내고 응답을 기다리는 프라미스를 반화한다.
그런데 해당 프라미스는 응답이 완전히 완료 되기전에 이행상태가 되어버린다.
`fetch.text()` 를 호출해서 테스트가 완전히 다운로드 되면 `result` 값으로 갖는 이행된 프라미스를 반환하게 할 수 있다. 

```js
fetch('/example/user.json')
	// 원격 서버가 응답하면 .then 아래 코드가 실행됩니다.
	.then(function(response) {
		// response.text()는 응답 텍스트 전체가 다운로드되면
		// 응답 텍스트를 새로운 이행 프라미스를 만들고, 이를 반환
		return response.text()
	})
	.then(function(text) {
		// 원격에서 받아온 파일의 내용
		console.log(text);
	})
```
그러나 `reponse.json()`을 사용하면 json으로 파싱까지 할 수 있다. 
```js
// 위 코드와 동일한 기능을 하지만, response.json()은 원격 서버에서 불러온 내용을 JSON으로 변경해줍니다.
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan, got user nam
```
GitHub 에 요청을 보내 사용자 프로필을 불러오고 아바타를 출력해 보는 예제
```js
fetch('article/promise-chaining/user.json')
	.then(response => reponse.json())
	.then(user => fetch(`http://api.github.com/users/${user.name}`))
	.then(reponse => reponse.json())
	.then(githubUser => {
		let img = documnet.createElement('img');
		img.src = githubUser.avatar_url;
		img.className = "promise-avatar-example";
		documnet.body.append(img);

		setTimeout(() => img.remove(), 3000); // (x)
	})
```
x 부분에 흔히들 한흔 실수가 있다. 
만약 아바타를 잠깐 보였다가 사라진 이후에 무언가를 하고 싶으면 어떻게 해야 할까? 
지금으로선 방법이 없는데 체인을 사용해 프로미스를 반환하도록 하자.

```js
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise(function(resolve, reject) { // (*)
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser); // (**)
    }, 3000);
  }))
  // 3초 후 동작함
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
```
이제 사진이 사라진 후에 동작을 정의할 수 있게 됬다. 

결론 적으로 말하면 비동기 동작을 할때는 항상 프라미스를 반환하는 것이 좋다. 
지금은 당장 쓰지 않더라도 나중에 확장하기 용이하기 때문이다. 

### .then(f1).catch(f2) vs .then(f1, f2) 다를까?
다르다. 
`.then(f1).catch(f2)`의 경우 f1 에서 에러가 발생했다면 catch 에서 처리 할 수 있다. 

반면에, `.then(f1, f2)`의 경우에는 f1에서 에러가 발생하면 이어지는 체인이 없기 때문에 처리할 수 없다. 
