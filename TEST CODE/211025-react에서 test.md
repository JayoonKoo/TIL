# react 에서 test

`CRA` 를 통해서 생성한 리엑트 프로젝트는 테스트로 jest 를 사용하기 때문에 별도에 설정 없이 바로 test를 만들 수 있다. `package json`에 `test`로 스크립트가 작성되어 있기 때문에 test 코드를 작성한 후에 `npm run test` 하면 된다.

리엑트 앱에서는 주로 다음 모듈을 사용한다.

```js
import {render, screen} from '@testing-library/react`;
```

## toBeInTheDocument

렌더링 결과에 특정 텍스트가 포함되어 있는니 여부를 확인한다. 예를 들어 Hello 컴포넌트는 유저에 정보가 있으면 Hello, {user.name} 을 보여주고 없다면 Login 버튼을 보여준다.

```jsx
test("Hello 라는 글자가 포함되어 있는가?", () => {
  render(<Hello user={user} />);
  const helloEl = screen.getByText(/Hello/i);
  expect(helloEl).toBeInTheDocument();
});
```

test를 진행하면 Hello 라는 글자가 없을경우 실패하게 된다.

## toMatchSnapshot

사진을 찍듯이 어떤 상태에 렌더링을 모아둘 수 있다. user가 있을경우와 없는 경우 렌더링 화면을 snapshot으로 저장해 두면 이후에 다른 데이터가 들어오와서 스텝샷과 달라지면 렌더링이 실패한다.

```jsx
test("snapshot: name 있음.", () => {
  const el = render(<Hello user={user} />);
  expect(el).toMatchSnapshot();
});
test("snapshot: name 없음.", () => {
  const el = render(<Hello />);
  expect(el).toMatchSnapshot();
});
```

여기서 user로 넘겨주는 데이터에 name 이 변경되어서 기존에 Hello, Koo로 렌더링 되던것이 Hello, Mike로 렌더링 되었다고 가정해 보자. 그러면 test는 실패하고 스넵샷에 내용을 바꿀건지 묻는데, 개발자는 상황을 인지해서 버그가 아니라 수정사항이고 하면 옵션중에 선택해서 스넵샷을 고치거나 하면 된다.

## 시간에 따라 변하는 컴포넌트

컴포넌트가 시간에 따라 변경된다고 하면 스넵샷은 계속해서 변경되기 때문에 test는 계속해서 실패할 것이다. 이럴때는 앞에서 알아본 mock 함수를 사용해서 일정한 데이터가 들어가도록 해야 한다.

Timer 컴포넌트는 현제의 초를 렌더링 한다.

```jsx
export default function Timer() {
  const now = Date.now();
  const sec = new Date(now).getSeconds();
  return <p>현제 {sec} 초 입니다.</p>;
}
```

이때 Test를 진행하는 `Timer.test.js` 에서는 test `Date.now`를 mock 함수로 만들어서 똑같은 값을 리턴하도록 해주면 된다.

```jsx
test("초 표시", () => {
  Date.now = jest.fn(() => 123456789);
  const el = render(<Timer />);
  expect(el).toMatchSnapshot();
});
```
