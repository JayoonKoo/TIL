
# async와 await
## async함수
사용 법
```js
async function f() {
  return 1;
}
```
`async` 를 붙히면 프로미스를 반환되게 할 수 있다. 함수가 프로미스가 아닌 값을 반환하더라도 이행 상태의 프라미스로 감싼 것으로 반환한다. 

```js
async function f() {
  return 1;
}

f().then(alert); // 1
```
명시적으로 `promise`를 반환되게 하는것도 가능하디.
```js
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```
## await
`await`는 `async` 함수 안에서만 사용할 수 있다. 사용법은 다음과 같다. 
```js
// await는 async 함수 안에서만 동작합니다.
let value = await promise;
```
`await`는 키워드는 프라미스가 처리될때까지 기다린다. 
```js
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("완료!"), 1000)
  });

  let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)

  alert(result); // "완료!"
}

f();
```
`await`는 프라미스가 처리될때까지 함수 실행을 기다리게 한다. 프라미스가 처리 되길 기다리는동안 다른 일(다른 스크립트 실행, 이벤트 처리) 등을 할 수 있어서 CPU 리소스가 낭비되지 않는다. 

`promise.then` 보다 가동성이 좋고 쓰기 좋다. 

사용 예시 
```js
async function showAvatar() {

  // JSON 읽기
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();

  // github 사용자 정보 읽기
  let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // 아바타 보여주기
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // 3초 대기
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  img.remove();

  return githubUser;
}

showAvatar();
```
> - await는 `thenable` 객체를 받는다. `.then`이 구현되어 있으면 받을 수 있다. 
> - async 클래스 메서드 . 클래스 메서드에  `async`를 추가하면 프라미스를 반환하는 메서드를 만들 수 있다. 동일하게 이런 메서드 안에서는 `await`를 사용할 수 있다.


## 에러핸들링
`await promise`에서 만약 에러가 발생하면 에러를 던진 것과 동일하게 동작한다. 
```js
async function f() {
  await Promise.reject(new Error("에러 발생!"));
}
```
위에 코드는 아래 코드와 동일하다.
```js
async function f() {
  throw new Error("에러 발생!");
}
```
`await`가 던진 에러는 `try..catch`문을 이용하여 잡을 수 있다.
```js
async function f() {

  try {
    let response = await fetch('http://유효하지-않은-주소');
  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }
}

f();
```
`try..catch` 가 없으면 함수 결과로 거부된 프라미스과 반환될테니 `.catch()`를 통해 에러를 헨들링할 수 있다.
```js
async function f() {
  let response = await fetch('http://유효하지-않은-url');
}

// f()는 거부 상태의 프라미스가 됩니다.
f().catch(alert); // TypeError: failed to fetch // (*)
```
> `async` 함수 안에서 `await` 키워드를 붙여서 `Promise.all`를 반환 받을 수 있다.

```js
// 프라미스 처리 결과가 담긴 배열을 기다립니다.
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```
