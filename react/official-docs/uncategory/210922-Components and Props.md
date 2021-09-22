# Components and Props

컴포넌트를 사용하면 UI를 재사용 가능한 개별적인 여러 조각으로 나누고, 개별적으로 살펴 볼 수 있다.

개념적으로 Components 는 JavaScript에 함수 와 같다. props라고 불리는 임의의 입력을 받고 화면에 표시하고 싶은 정보를 담은 React elements를 반환한다.

## Function and Class Components

컴포넌트를 표현하는 두가지 방법이 있다.

첫번째로, Javascript에 함수 작성방법과 같은 `function components`가 이다. 이 함수는 props라는 객체 인자를 받고 React elements를 반환한다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

다음으로 class를 사용하는 `class components` 가 있다.

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

실습 코드

```jsx
function WelcomeFunction(props) {
  return <h1>Hello, {props.name}!</h1>;
}

class WelcomClass extends React.Component {
  render() {
    <h1>Hello, {this.props.name}</h1>;
  }
}
```

리엑트에 관점에서 보면 두 컴포넌트는 모두 동일하다 몇가지 추가적인 기능이 있는데 이는 다음 장에서 설명한다.

## Rendering a Component

지금 까지는 DOM 테그 이름을 통해서 React element를 렌더링 했는데 유저가 만든 컴포넌트 이름으로 나타낼 수 도 있다.

```jsx
const elemnt = <Welcome name="Sara" />;
```

리엑트는 유저가 만든 컴포넌트를 발견하면 jsx 어트리뷰트와 자식을 해당 컴포넌트에 단일 객체로 전달한다. 이를 props라고 한다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(element, document.getElementById("root"));
```

실습 코드

```jsx
function WelcomeFunction(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return <WelcomeFunction name="Jayoon" />;
}
```

> 컴포넌트의 이름은 항상 대문자로 시작하도록 작성한다. 리엑트는 소문자로 시작하는 테그를 DOM 태그로 보기 때문이다.

## Composing Components

컴포넌트는 자신의 출력에 다른 컴포넌트를 참조할 수 있다. 이는 모든 단계에서 추상 컴포넌트를 사용할수 있음을 의미한다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

실습 코드

```jsx
function WelcomeFunction(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <WelcomeFunction name="Jayoon" />
      <WelcomeFunction name="daHee" />
      <WelcomeFunction name="ok" />
    </div>
  );
}
```

## Extracting Components

컴포넌트를 여러개의 작은 컴포넌트로 나누느 것을 두려워 하지 마라.

`Comment` 예제를 살펴보자.

```jsx
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img
          className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">{props.author.name}</div>
      </div>
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">{formatDate(props.date)}</div>
    </div>
  );
}
```

이 예제는 props 안에 author, text, date를 갖는데, 중첩된 구조로 되어 있어서 변경하기도 어렵고 재상하기도 어렵게 된다. 컴포넌트를 추출해 보도록 한다.

먼저 Avatar 를 추출한다:

```jsx
function Avatar(props) {
  return (
    <img className="Avatar" src={props.user.avatarUrl} alt={props.user.name} />
  );
}
```

Avatar는 자신이 Comment 내에서 렌더링된다는 것을 알 필요가 없다. 따라서 autor 라는 속성 이름 대신에 user라는 일반적인 이름을 사용하기로 한다.

props에 이름은 context가 아닌 컴포넌트 자체의 관점에서 짓는 것을 권장한다.

Comment 를 당므과 같이 단순화 할 수 있다:

```jsx
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">{props.author.name}</div>
      </div>
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">{formatDate(props.date)}</div>
    </div>
  );
}
```

다음으로, Avatar 옆에 사용자의 이름을 렌더링하는 UserInfo 컴포넌트를 추출한다:

```jsx
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">{props.user.name}</div>
    </div>
  );
}
```

Comment 가 더욱 단순해 진다:

```jsx
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">{formatDate(props.date)}</div>
    </div>
  );
}
```

실습 코드

```jsx
const comment = {
  date: new Date(),
  text: "I hope you enjoy learning React!",
  author: {
    name: "Hello Kitty",
    avatarUrl: "https://placekitten.com/g/64/64",
  },
};

function formatDate(date) {
  return date.toLocaleDateString();
}

function Avatar(props) {
  return (
    <img className="Avatar" src={props.user.avatarUrl} alt={props.user.name} />
  );
}

function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">{props.user.name}</div>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">{formatDate(props.date)}</div>
    </div>
  );
}

function App() {
  return (
    <Comment author={comment.author} text={comment.text} date={comment.date} />
  );
}
```

이런 작업이 지루해 보일수 있으나 큰 프로젝트를 할때 도움이 된다. UI가 여려번 반복되거나 UI 일부가 자체적으로 복잡한 경우에는 별도의 컴포넌트로 만드는 것이 좋다.

## Props are Read-Only

함수 컴포넌트나 클래스 컴포넌트 모두 props를 수정하면 안된다.

함수는 pure function과 impure function이 있다. pure function은 입력값을 수정하려 고 하지 않아서 동일한 입력에 대해서 동일한 출력을 반환하는 반면에, impure function은 입력값을 변경한다.

pure function:

```jsx
function sum(a, b) {
  return a + b;
}
```

impure function:

```jsx
function withdraw(account, amount) {
  account.total -= amount;
}
```

react는 매우 유연하지만 한가지 엄격한 규칙이 있는데 모든 React 컴포넌트는 자신의 props를 다룰 때 반드시 순수 함수처럼 동작해야 한다.

애플리케이션의 UI는 동적으로 변화하기 때문에 props를 변화 시키지 않고 순수함수로 동작시킬수 없지 않을까 싶지만, React 는 state를 사용해 이 문제를 해결한다. state는 다음 장에서 설명하도록 한다.
