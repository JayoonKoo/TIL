# Introducing JSX

```js
const element = <h1>Hello, world!</h1>;
```

위에 예시에 테그는 문자열도 아니고 html도 아니다. 이것은 JSX라고 불린다. React는 JSX로 UI를 표현하기를 추천한다. JSX는 템플릿을 상기시키지만 자바스크립트에 모든 기능이 포함되어 있다.

JSX는 React에 엘리먼트를 생성한다. 우리는 이것이 DOM으로 렌더링 되는것을 다음 섹션에서 살펴볼 것이다. JSX에 기본적인 내용은 아래와 같다.

## Why JSX?

React는 렌더링 로직이 본질적으로 다른 UI로직과 결합된다는 것을 받아들인다. (어떻게 이벤트가 다뤄지지, 어떻게 시간이 흐름에 따라 상태가 변하지, 디스플레이를 위해 데이터가 어떻게 준비되지...)

인위적으로 기술을 마크업 과 로직을 분리한 파일로 넣음으로서 분리하는 대신에 리액트는 관심사를 컴포넌트라고 불리는 로직과 마크업을 포함한 느슨한 단위 결합으로 나눈다.

리액트가 JSX를 필수적으로 필요로 하는것은 아니지만, 자바스크립트 코드로 UI를 작업할때 시각적으로 많은 도움이 된다는것을 많은 사람들이 발견했다. 또한 이는 리액트가 유용한 에러와 경고 메세지를 표시할수 있도록 해줍니다.

## Embedding Expression in JSX

변수를 램핑해서 사용할 수 있다.

```js
function App() {
  const name = "koo";
  const element = <h1>Hello {name}</h1>;
  return element;
}
```

어떤 자바스크립트에 표현식도 이 안에 서용할 수 있다.

```js
function userNameElemnt(user) {
  return (
    <h1>
      내 이름은 {user.name} 이고 {user.age}살이야.
    </h1>
  );
}

const user = {
  name: "koo JaYoon",
  age: 27,
};

function App() {
  const element = <header>{userNameElemnt(user)}</header>;
  return element;
}
```

함수를 넣는것도 가능하다. 필수는 아니지만 가독성을 위해 줄을 나눌 것과 자동 세미콜론 방지를 위해서 괄호로 래핑할 것을 추천한다.

## JSX is an Expression Too

편집이 끝나면, JSX 표현식이 자바스크립트 정규 함수로 호출되고 자바스크립트에 객채로 평가 된다.

이것은 JSX를 if 나 for 에 사용해서 인수를 넣거나 할당하거나 리턴할 수 있단느 것을 의미한다.

```js
function getStranger(user) {
  if (user) {
    return <h1>{userNameElemnt(user)}</h1>;
  }
  return <h1>Hello Stranger</h1>;
}

function App() {
  const element = <header>{getStranger()}</header>;
  return element;
}
```

## Specifying Attributes with JSX

스트링 문자열을 quotes를 사용해 속성으로 정의할 수 있다. 또한 중괄호를 사용해서 자바스크립트 표현식을 속성으로 사용할 수 도 있다.

```js
const element = <div tabIndex="0"></div>;

const cuElemnt = <img src={user.avatarUrl}></img>;
```

중괄호를 사용할때 qutos를 사용하지 않도록 주의해라.

> JSX는 HTML 보다는 JavaScript에 가깝기 때문에 camelCase를 프로퍼티로 사용한다.

## Specifying Children with JSX

빈태그일 경우 XML 과 비슷하게 `/>`를 사용해서 닫아준다.

```js
const element = <img src={user.avatarUrl} />;
```

JSX 태그는 자식 태그를 포함할 수 있다.

```jsx
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

## JSX Prevents Injection Attacks

유저에 입력을 JSX에 삽입시키는 것은 안전하다.

```jsx
const title = response.potentiallMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

기본적으로 React DOM 은 렌더링 하기전에 JSX 내장된 어떤 값이든 이스케이프 한다. 그러므로 애플리 케이션에서 명시적으로 적히지 않은 내용은 주입되지 않는다. 모든 것은 렌더링 하기전에 문자열로 변환된다. 이것은 XSS 공격을 막는데 도움을 준다.

## JSX Represents Objects

Babel은 JSX를 `React.createElement()`에 호출로 컴파일한다.

아래 두개는 동일하다.

```jsx
const element = <h1 className="greeting">Hello, world!</h1>;
```

```jsx
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

`React.createElement()' 너가 버그 없는 코드를 작성하하도록 도움이되는 몇가지 체크를 수행한다. 하지만 이것은 본질적으로 다음에 객체를 생상한다.

```jsx
// Note: this structure is simplifed
const element = {
  thpe: "h1",
  props: {
    className: "greeting",
    children: "Hellok world!",
  },
};
```

이 객체는 React elements라고 불린다. 이것을 너가 스크린에서 보고싶은 것에 설명이라고 생각할 수 있다.
React는 이 객체를 DOM 을 생상하고 최신상태로 유지하는데 사용한다.

다음 섹션에서 React elements가 DOM으로 렌더링 되는것을 살펴볼 것이다.

> 당신의 에디터에 Babel 언어 설정을 선택하기를 추천한다. 그러면 ES6 와 JSX 코드가 하이라이트 될것이다.
