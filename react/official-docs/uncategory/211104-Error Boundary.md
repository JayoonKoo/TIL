# Error Boundaries

Error Boundaries 는 리액트에서 에러를 catch 하는 방법이다.

생명주기 메서드인 `static getDerivedStateFromError()` 와 `componentDidCatch()` 중 하나 (혹은 둘 다)를 정의하면 클래스 컴포넌트 자체가 에러 경계가 됩니다.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI. 에러 발생했을때 state 바꾸기
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service 로그 남기기
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

다음과 같이 사용한다.

```jsx
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

한번 정의하면 애플리케이션 전체에서 어디든지 사용할 수 있다.

하지만 Error Boundary 자체에서 발생하는 에러는 잡지 못하고 가장 가까운 에러 경계로 전파한다. 이것은 자바스크립트에서 catch 구문이 동작하는 방시과 비슷하다.

## Where to Place Error Boundaries

에러 경계를 어디에 세분화해서 개발할지는 개발자가 정하는 것이다. 최상위 컴포넌트에 설정할 수도 있고 작은 위젯에서도 사용할 수 있다. 작은 위젯에 설정함을서 나머지 부분은 살리는 방식도 사용 가능하다.

## New Behavior for Uncaught Errors

잡하지 않는 에러가 있을때 리액트는 컴포넌트 트리의 마운트가 해제된다. 이것은 손상된 정보를 표시하는 것보다 훨씬 더 나은 사용자 경험을 제공한다.

손상된 유아이는 사용자의 의도와는 다른 동작을 야기하기 때문이다. 실제로 페이스 북에서는 여러 세부 유아이이들에 각각의 error boundary를 두어서 에러를 잡음으로서 유아이를 고치고, 에러가 발생하지 않은 다른 ui 는 남겨둔다.

## Component Sack Traces

CRA를 통해 앱을 생성하면 자바 스크립트에 에러 뿐만 아니라 Component에서 발생한 에러 또한 콘솔에 표시된다. 이 에러는 개발 환경에서만 표시되며, 어디서 에러가 발생했는지 추적할 수 있게 해준다.

만약 CRA를 사용하지 않는다면 플러그인을 설치 한후 바벨에서 설정할 수 있다. 주의할 점은 반드시 배포 환경에서는 해당 기능을 비활성화 해야 한다는 것이다.

> 스택에 표시되는 이름은 Function.name 에서 가져온다. 따라서 해당 프로퍼티를 지원하지 않는 구식 브라우저에서는 폴리필이 필요하다. 또는 모든 컴포넌트에서 `displayname` 프로퍼티를 설정하면 설정한 이름이 스택으로 표시된다.

## How About try/catch?

try catch는 명령형 코드에서 동작한다.

하지만 리액트 컴포넌트는 선언적이다.

error boundry 는 선언적인 특징을 보존하고 예상한대로 동작한다.

## How About Event Handlers?

리액트의 Error Boundary는 렌더링과 관련된 에러를 잡는다. 이벤트 헨들러에서 에러가 발생하더라도 어떻게 렌더할지 알 수 있기 때문에 Error Boundary로 에러를 잡을 수 없다.

이벤트 헨들러에서 발생하는 에러를 잡고 싶다면 JavaScript에 try catch 문을 사용해야 한다.

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>;
    }
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```
