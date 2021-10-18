# Jest Matcher

## jest란?

jest 는 자바스크립트 코드를 테스트 할수 있게 해주는 도구이다. 패키지만 다운받으면 별도의 설정없이 바로 사용할 수 있는것이 특징이다.

## 최소한의 설정?

패키지 설정 및 스크립트 설정에 관한 부분으로 거의 할게 없다.

`npm init -y` : npm 초기화

`npm i jest -D` : 개발 과정에서만 사용할 것이므로 jest를 -D 옵션을 붙여서 설치한다. --save-dev 와 똑같다.

package.json으로 이동하여 script를 수정한다.

```json
{
  "name": "jest-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest" // test 부분에 jest 추가
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "jest": "^27.3.0"
  }
}
```

`npm test` : 테스트 코드 실행 가능

test 코드는 test.js 등의 이름이나. `__tests__` 폴더 아래 있는 모든 파일을 찾아서 실행한다.

## matcher

matcher는 테스트에서 예상한 부분과 실제 결과가 맞는지 매칭시키는 함수를 의미한다. jest 다양한 matcher 가 존재하는데 모두다 외울 필요는 없고 필요할때 확인하면 된다.
보통 expect().matcher()를 사용하여 검사하는데 맞지 않는경우를 조사하려면 not을 붙혀서 expect().not.matcher()를 사용하면 된다.

- toBe() : 결과가 같은지 확인, 아닌 경우를 판단하려면 expect().not.matcher()를 사용하면 된다.

```js
test("1은 1이야.", () => {
  expect(1).toBe(1);
});
```

- toEqaul() : 결과가 같은지 확인, 배열 객체 등의 요소는 재귀적으로 판단해야 하기 때문에 이것을 사용해야 한다.

```js
test("이름과 나이를 전달받아서 객체를 반환해줘", () => {
  expect(fn.makeUser("mike", 30)).toEqual({
    name: "mike",
    age: 30,
  });
});
```

- toStrictEqual() : 보다 엄격한 검사를 실시한다.
- toBeNull() : Null 값인지 검사
- toBeUndefined() : undefined인지 검사
- toBeDefined
- toBeTruthy : truthy인 값을 리턴하는지 검사.

```js
test("비어있지 않은 문자열은 truly 입니다.", () => {
  expect(fn.add("koo", "ja")).toBeTruthy();
});
```

- toBeFalsy : falsy인 값을 리턴하는지 검사.

숫자 관련된 matcher도 있다.

- toBeGraterThan() : 큰지 검사
- toBeGraterThanOrEqual() : 크거나 같은지 검사
- toBeLessThan() : 작은지 검사
- toBeLessThanOrEqual() : 작거나 같은지 검사

```js
test("Id 는 10글자 보다 작아야 한다.", () => {
  const ID = "ID_KJDB_";
  expect(ID.length).toBeLessThanOrEqual(10);
});
```

근사치를 검사해야하는 경우도 있는데 이럴땐 toBeCloseTo를 사용하면 된다.

- toBeCloseTo : 근사치 검사

```js
test("0.1 더하기 0.2는 0.3 이다.", () => {
  expect(fn.add(0.1, 0.2)).toBeCloseTo(0.3);
});
```

문자열 관련해서 정규 표현식을 사용할 수 있는데 toMatch를 사용하면 된다.

- toMatch(regex) : 정규표현식과 매칭 되는지

```js
test("Hello World 에 H라는 글자가 있나?", () => {
  expect("Hello World").toMatch(/H/);
});
```

배열 관련된 matcher 도 있다.

- toContain(요소) : 인자로 넘겨준 요소가 매열내의 포함되어 있는지

```js
test("유저 리스트에 Mike가 있는지", () => {
  const user = "Mike";
  const users = ["Tom", "Mike", "Kai"];
  expect(users).toContain(user);
});
```

에러가 발생하는지 여부도 확인할 수 있다.

- toThrow() : 인자를 넘겨주면 특정 에러인지 확인하고 인자를 넘겨주지 않으면 에러를 발생시키는 여부만 확인한다.

```js
test("이거 에러 나나?", () => {
  expect(() => fn.throwErr()).toThrow();
});
// 어떤 내용인지 확인하려면 인수로 전달하면 된다.
test("이거 xx 에러인가? ", () => {
  expect(() => fn.throwErr()).toThrow("xx");
});
```
