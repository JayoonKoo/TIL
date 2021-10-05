# Conditional Rendering

React 에서는 JavaScript에서 조건문을 사용하듯이 컴포넌트를 조겅부로 렌더링할 수 있다.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById("root")
);
```

## 논리 && 연산자로 if를 인라인으로 표현하기

JavaScript에서 `true && expression` 은 항상 `expression`으로 평가되고 `false&& expression`은 항상 `false`로 평가된다.

따라서 && 뒤에 조건이 `true`일때 출력되고 `false`일때 React는 무시한다.

```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

const messages = ["React", "Re: React", "Re:Re: React"];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById("root")
);
```

## 삼항 연산자로 if else 표현하기

```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

삼항 연산자를 사용하면 if else로 조건부 렌더링을 할 수 있다.

## 컴포넌트가 렌더링하는 것을 막기

렌더링 하는 대신에 `null`을 반환하면 렌더링하는 것을 막을 수 있다.

```jsx
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return <div className="warning">Warning!</div>;
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showWarning: true };
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState((state) => ({
      showWarning: !state.showWarning,
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? "Hide" : "Show"}
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
```

컴포넌트의 render 메서드로부터 null을 반환하는 것은 생명주기 메서드 호출에 영향을 주지 않는다. 그 예로 `componentDidUpdate`는 계속해서 호출되게 된다.
