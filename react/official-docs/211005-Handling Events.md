# Handling Events

React 에서 이벤트를 처리하는 방식은 DOM 에서 이벤트를 처리하는 방식과 거의 유사하다. 몇가지 차이점이 있는데 다음과 같다.

1. 소분자가 아닌 camelCase를 사용한다.
2. 이벤트 헨들러를 string으로 전달하는것이 아니라 함수로 전달한다.

DOM:

```html
<button onclick="activateLasers()">Activate Lasers</button>
```

React:

```jsx
<button onClick={activateLasers}>Activate Lasers</button>
```

DOM 에서는 기본 동작을 막기 위헤서 `return false`를 사용할 수 있는 반면에 React 에서는 기본 동작을 막기 위해 `preventDefault`를 사용해야 한다.

DOM:

```html
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>
```

React:

```jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

React 에서는 DOM 엘리먼트를 생성한 후에 이벤트 리스너를 추가 하기 위해서 `addEventListenter`를 호출할 필요가 없다. 렌더링 될때 리스너를 제공하는 방법을 사용한다.

```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // 콜백에서 this 가 작동하려면 this를 바인딩 해주어야 한다. -> 호출 시점에서 this는 undefined이기 때문이다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((pre) => ({
      isToggleOn: !pre.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}
```

콜백 함수 내에서 this를 사용하고 싶다면 생성자에서 바인딩을 해주어야 한다. 이는 React 내에서의 특징이 이나리 일반적인 JavaScript에 특징이다. 만약 매번 바인딩 하기 싫다면 다음과 같은 방법을 사용해도 된다.

publick class fiedls syntax :

```jsx
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log("this is:", this);
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

화살표 함수 사용하기:

```jsx
class LoggingButton extends React.Component {
  handleClick() {
    console.log("this is:", this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return <button onClick={() => this.handleClick()}>Click me</button>;
  }
}
```

화살표 함수를 사용할때에 문제점은 컴포넌트가 렌더링 될때마다 콜백이 새로 생성된다는 것이다. 대부분의 경우는 문제가 되지 않으나, 콜백이 하위 컴포넌트에 props로서 전달된다면 그 컴포넌트들은 추가로 다시 렌더링을 수행할 수 도 있다.
