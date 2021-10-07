# Lists and Keys

javscript 에서 map을 이용하여 새로운 배열을 얻는것과 똑같이 엘리먼트를 생성할 수 있다.

## Rendering Multiple Components

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => <li>{number}</li>);
```

ul 테그를 감싸서 DOM에 렌더링한다.

```jsx
ReactDOM.render(<ul>{listItems}</ul>, document.getElementById("root"));
```

## Basic List Component

일반적으로는 컴포넌트 안에서 리스트를 렌더링 한다.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => <li>{number}</li>);
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

이렇게 작성하면 엘리먼트에 key를 추가하라는 경고를 만나게 된다. React에서는 반복 되는 요소에는 특수한 문자열 어트리 뷰트를 넣어야 한다. 리스트 엘리먼트에서 key 가 필요한 이유는 다음 섹션에서 더 설명하도록 한다.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => (
    <li key={number.toString()}>{number}</li>
  ));
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

여기서는 배열 요소의 숫자를 key로 넘겨 준다. 보통은 고유한 id를 주어야 한다...

## Keys

key는 React가 어떤 항목을 변경, 추가 또는 삭제할때 식별할 수 있는 정보를 준다. key 엘리 먼트를 통해서 엘리먼트의 안정적인 고유성을 확인할 수 있고 수정 삭제 작업을 수행 할 수 있다.

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => (
  <li key={number.toString()}>{number}</li>
));
```

일반 적으로 key 는 배열의 고유한 값으로 넘겨 주어야 한다. 보통은 데이터의 id를 추가하는 방법을 사용한다.

```jsx
const todoItems = todos.map((todo) => <li key={todo.id}>{todo.text}</li>);
```

만약 id 가 없다면 최후의 방법으로 인덱스를 key로 사용한다. 실제로 React에서는 key를 넘겨주지 않는다면 인덱스를 키로 잡는다.

```jsx
const todoItems = todos.map((todo, index) => (
  // Only do this if items have no stable IDs
  <li key={index}>{todo.text}</li>
));
```

하지만 이렇게 작성하면 데이터 갯수가 늘어나면 key도 똑같이 변하게 되고, 데이터 추가 변경시 안정성이 떨어지게 된다. 의도하지 않은 동작을 하기도 한다.

key 가 중요한 이유는 다음과 같다.
리액트는 두 트리를 동시에 순회하며 판단하고 다를 경우만 생성한다. 예를들어 자식의 끝에 엘리먼트를 추가하면, 다음 두 트리 사이의 변경은 잘 작동할 것이다.

```jsx
<ul>
  <li>first</li>
  <li>second</li>
</ul>에

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

리액트는 두 가지 트리를 비교하면서 first, second가 일치하는 것을 확인하고 다른것은 third 임으로 third를 추가하는 방법을 작동한다.

만약 자식의 끝이 아니라 시작에서 추가하면 좋지 않은 성능을 낸다. 예를들어 다음코드는 작동하겠지만 매우 좋지 않은 성능을 낸다.

```jsx
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React는 Duke 다음부터는 재사용 할 수 있음에도 불구하고, 순회하면서 제일 처음 다른것이 Connecticut 임을 확인하고 전체를 다시 렌더링한다. 굉장히 비효율적이다.

### Key는 이런 문제를 해결한다.

자식 요소에 key를 추가함으로서 리엑트는 key를 사용하여 기존 트리와 이후 트리의 자식들이 일치하는지 확인한다. key를 줌으로서 순서가 아닌 id 로 식별할수 있게 된 것이다.

```jsx
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

이렇게 작성함으로서 리액트는 duke 이후를 다시 그리는 것이 아니라, 단순히 순서만 바꾸면 된다는 것을 알게 된다.

또한 이런 이유가 있기 때문에 단순히 인덱스를 key로 사용하면 안되는 것이다. key는 고유하며 데이터가 추가된다고 변하면 안된다. 인덱스를 사용하면 기존 트리와 이후 트리에 차이를 발견할 기준을 잃어버리게 되는 것이다.

### Extracting Components with keys

키는 주변 배열의 context에서만 의미가 있다. 다음 코드와 같이 `ListItem` 컴포넌트를 추출 한 경우 컴포넌트 자체에 key를 주어야 한다.

고쳐야 함 :

```jsx
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>{value}</li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => (
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  ));
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

정확한 예 :

```jsx
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => (
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()} value={number} />
  ));
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

## Keys Must Only Be Unique Among Siblings

키는 형제 요소 에서만 고유값이면 된다. 전체 영역에서 고유값일 필요는 없다. 예로 두개의 다른 배열을 만들때 동일한 키를 사용할수 있다.

```jsx
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
  const content = props.posts.map((post) => (
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  ));
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  { id: 1, title: "Hello World", content: "Welcome to learning React!" },
  { id: 2, title: "Installation", content: "You can install React from npm." },
];
ReactDOM.render(<Blog posts={posts} />, document.getElementById("root"));
```

키는 React 에게 힌트를 제공하지만 컴포넌트로 전달되지는 않는다. props로 사용하고 싶다면 key 가 아닌 다른 값으로 id 를 전달하면 된다.

## Embedding map() in JSX

JSX 에서는 어떤 자바스크립트 표현식도 사용할 수 있기 때문에 map 도 JSX 안에서 사용할 수 있다.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => (
    <ListItem key={number.toString()} value={number} />
  ));
  return <ul>{listItems}</ul>;
}
```

위에 코드를 Embedding map 을 사용하여 아래처럼 고칠 수 있다.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) => (
        <ListItem key={number.toString()} value={number} />
      ))}
    </ul>
  );
}
```

어떤게 좋을지는 개발자가 직접 판단하면 된다. 깔끔해 지긴 하지만 중첩이 많이 생길 수 도 있으니 적절히 사용하면 된다.
