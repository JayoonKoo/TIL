# State and Lifecycle

이번 섹션에는 저번 섹션에서 만들었던 Clock 컴포넌트를 완전히 재사용 가능하고 캡슐화 하는 방법을 배운다. `Clock` 컴포넌트는 스스로 타이머를 설정할 것이고 업테이트 할 것이다.

```jsx
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(<Clock date={new Date()} />, document.getElementById("root"));
}

setInterval(tick, 1000);
```

위 코드는 며번 새로 컴포넌트를 생성하고 렌더링하고 있다. 원하는 동작은 `Clock` 컴포넌트가 스스로 state를 가지고 state에 변경에 따라서 스스로를 업데이트 하게 하는 것이다.

state라는 개념이 처음 사용되었는데, state는 props와 유사하지만, 변경 가능하고 컴포넌에 의해 완전히 제어되는 값이라고 생각하면 된다.

## Converting a Function to a Class

`function Component`를 `Class Component` 로 변경하기 위해서는 다음에 단계를 거치면 된다.

1. `React.Component`를 상속받는 클래스 생성
2. `render()`라고 불리는 메서드 생성
3. 함수형 컴포넌트에 내용을 `render()`안으로 옮기기
4. `props`를 `this.props`로 변경하기
5. 함수 선언부분 삭제

```jsx
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

`Clock`은 이제 클래스로 정의된다.

`render` 메서드는 UI 업데이트가 필요할때마다 호출되는데 이때는 하나의 Clock 인스턴스로 부터 실행된다. 이것을 사용하면 state와 생명주기 메서드와 같은 부가적인 기능을 사용할수 있게 된다.

## Adding Local State to a Class

Props를 state로 옮길 것이다.

1. `this.props.date`를 `this.state.date`로 변경
2. 생성자 함수를 생성하고 `this.state`를 초기화 하기

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

클래스 컴포넌트는 항상 props를 부모 생성자에 매겨변수로 넣고 호출해야 한다. -> this가 바인딩 되어야 함.

3. `<Clock />` 에서 date prop 을 삭제하기

다음으로, `Clock`이 스스로 업데이트 할 수 있도록 만들겠다.

## Adding Lifecycle Methods to a Class

컴포넌트가 삭제 될때 컴포넌트가 사용하던 리소스를 확보하는것이 중요하다.

먼저, Clock이 처음 DOM에 렌더링 될 때마다 타이머를 설정하려고 하는데 이것을 React에서는 `mounting`이라고 한다.

또한, Clock의 의해 생성된 DOM 이 삭제될때마다 타이머를 해제하려고 하는데 React에서는 이것을 `unmounting` 이라고 한다.

컴포넌트 클래스에서 특별한 메서드를 선언하여 컴포넌트가 마운트 되거나 언마운트 될때 일부 코들를 작성 시킬 수 있다.

- componentDidMount()
- componentWillUnmount()

이런 메서드를 'lifecycle methods`라고 한다.

`componentDidMount` 는 컴포넌트가 DOM에 렌더링 된후 실행 된다. 따라서 타이머를 설정하기에 가장 좋다.

`componentWillUpmount` 에서 타이머에 대한 리소스를 해제하면 된다.

다음으로 `tick()`이라는 메서드를 구현하면 되는데 update를 위해서는 `this.setState()`를 사용한다.

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
```

1. `<Clock />` 가 `ReactDOM.render()`로 전달되었을 때 리액트는 `Clock`에 constructor를 호출하고 `this.state` 를 초기화 한다.
2. React는 `Clock` 컴포넌트의 `render()` 메서드를 호출한다. 이제 리엑트는 화면에 표시할 내용을 알게 되고 렌더링 출력값을 일치시키기 위해 DOM을 업데이트 한다.
3. 출력값이 DOM 에 삽입되면 React는 `componentDidMount()` 생명주기 메서드를 호출한다. 여기서 tick() 메서드를 호출하기 위한 타이머를 설정하도록 브라우저에 요청한다.
4. tick 안에서 `this.setState`가 호출되고 React는 변경 사항이 발생했다는 것을 알고 `render()` 메서드를 다시 호출한다. 그리고 DOM을 업데이트 한다.
5. `Clock` 컴포넌트가 DOM으로부터 한 번이라도 삭제된 적이 있다면 React는 타이머를 멈추기 위해 `componentWillUnmount()`를 호출한다.

## Using State Correctly

`setState()`에 대해서 알아야 할 세 가지가 있다.

### 1. Do Not Modify State Directly

```jsx
// wrong
this.state.comment = "Heelo";
```

위에 코드는 컴포넌트를 다시 렌더링하지 않는다.

```jsx
this.setState({ comment: "Hello" });
```

this.state 를 설정할 수 있는 유일한 공간은 contructor 뿐이다.

### 2. State 업데이트는 비동기적일 수 있다.

React는 성능을 위해 여러 setState() 호출을 단일 업데이트로 한꺼번에 처리할 수 있다.

`this.props`와 `this.state` 가 비동기적으로 업데이트될 수 있기 때문에 다음 state를 계산할 때 해당 값에 의존해서는 안된다.

```jsx
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

```jsx
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment,
}));
```

### 3. State Updates are Merged

`setState()`를 호출할 때 React는 제공한 객체를 현재 state로 병합한다.

state는 독립적인 변수를 포함할 수 있는데 별도의 `setState()` 호출로 이러한 변수를 독립적으로 업데이트할 수 있다.

```jsx
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

```jsx
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

## The Data Flows Down

컴포넌트는 자신의 state를 자식 컴포넌트에 props로 전달할 수 있다.

```jsx
<FormattedDate date={this.state.date} />
```

`FormattedDate` 는 date 를 props로 받을 것이고 이것이 Clock의 state로부터 왔는지, Clock의 props에서 왔는지 수동을 입력한 것인지 알지 못한다.

일반적으로 이를 `top-down` 또는 `undirectional`이라고 부른다. 모든 state는 항상 특정한 컴포넌트가 소유하고 있으며 그 state로부터 파생된 UI 또는 데이터는 오직 트리구조에서 자신의 아래 있는 컴포넌트에만 영향을 미칩니다.

트리 구조에서 부가적으로 나누어 진다고 볼 수 있고 이렇게 나누어진 컴포넌트는 완전히 독립적이다.
