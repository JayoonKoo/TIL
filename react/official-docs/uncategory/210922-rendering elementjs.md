# Rendering Elemnts

리엑트 앱의 가장 작은 단위를 의미한다. React dom 은 dom 과 react elemnts 가 일치하도록 업데이트 한다.

> 컴포넌트와 혼동해서 사용하는 경우가 있다. 엘리먼트는 컴포넌트에 구성요소라고 생각하면 된다.

## Rendering an Element into the DOM

HTML 파일에 밑에 `div`가 있다고 가정.

```html
<div id="root"></div>
```

이제부터 이것을 `root DOM node`라고 부를 것이다. 루트 돔 노드안에 들어갈 내용을 `React DOM`을 통해 관리하게 된다.

만약 어떤 앱을 통합하려는 경우에는 여러개의 루트 노드가 있을 수 있다. React elemnt를 root DOM node 에 렌더링 하려면 `ReactDOM.render()` 에 인수로 element와 root node를 넣고 호출하면 된다.

#### 공식 문서 코드

```jsx
const elment = <h1>Hello, World</h1>;
ReactDOM.render(elemnt, document.getElementById("root"));
```

#### 실습 코드

```jsx
ReactDOM.render(
  <React.StrictMode>{elements}</React.StrictMode>,
  document.getElementById("root")
);
```

## Updating the Rendered Element

React elements 는 불변 객체이다. 한번 생성하고나면 자식 요소나 속성을 변경할 수 없다. 마치 영화에 프레임과 같아서 특정 시점에 UI를 그리는 역활을 한다.

지금까지의 지식 수준에서는 UI를 업데이틑 하는 방법은 새로운 elemnts를 생성하고 `ReactDOM.render()`에 인수로 전달하는 방법밖에 없다.

시계 예제

```jsx
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );

  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(tick, 1000);
```

실습

```jsx
function tick() {
  const element = (
    <div>
      <h1>Hello, World</h1>
      <h2>{new Date().toLocaleTimeString()}</h2>
    </div>
  );

  ReactDOM.render(
    <React.StrictMode>{element}</React.StrictMode>,
    document.getElementById("root")
  );
}

setInterval(tick, 1000);
```

> 실제로는, `ReactDOM.render()`는 한번만 실행된다. 다음에 이어지는 주제에서 `stateful components`에 대해서 배울것이다. 지금 배우는것도 다음 배울 내용과 연관 되어 있으니 쭉 보길 바란다.

## React Only Updates What's Necessary

개발자 도구를 통해 살펴보면 실제로는 전체 UI를 새로 생성하도록 구성하였지만, React DOM은 DOM을 그 자식 엘리먼트를 이전의 엘리먼트와 비교하고 DOM을 원하는 상태로 만드는 데 필요한 경우에만 DOM을 업테이트 한다.

따라서 전체 UI가 업데이트 되는 것이 아니라 시계부분만 업데이트 되는 것이다. 이런 방식으로 접근하는것이 나중에 버그를 없애는데 도움을 줄 것이다.
