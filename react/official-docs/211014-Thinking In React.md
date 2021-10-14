# Thinking in React

React로 상품들을 검색할 수 있는 데이터 테이블을 만드는 과정을 통해 리엑트로 생각한다는것이 무엇인지 알아보자.

## 목업으로 시작하기

다음과 같은 JSON을 서버로 부터 받았다고 가정하자.

```json
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## 1단계: UI를 컴포넌트 계층 구조로 나누기

디자이너가 디자인한 화면을 보고 박스를 그리며 일므을 붙여본다. 이미 그려져 있다면 디자이너와 상의 해보면서 수정하거나 의미를 확실히 파악하도록 해본다.

하지만 어떤것이 컴포넌트가 될지 알수 있을까? 이것은 우리가 함수나 객체를 만들때처럼 생각하면 된다. 한가지 컴포넌트는 한가지 일만 하도록 작게 나누면서 단일 책임 원칙을 지키는 것이다.

JSON 데이터 모델이 적절히 만들어 졌다면 UI와 잘 연결 될 것이다. 이것은 ui와 데이터 모델이 `information architecture` 을 가지는 경향이 있기 때문이다.

<img src="images/211014-Thinking In React/1.png" width="500">

1. FilterableProductTable(노란색): 예시 전체를 포괄합니다.
2. SearchBar(파란색): 모든 유저의 입력(user input) 을 받습니다.
3. ProductTable(연두색): 유저의 입력(user input)을 기반으로 데이터 콜렉션(data collection)을 필터링 해서 보여줍니다.
4. ProductCategoryRow(하늘색): 각 카테고리(category)의 헤더를 보여줍니다.
5. ProductRow(빨강색): 각각의 제품(product)에 해당하는 행을 보여줍니다.

3번은 `ProductTableHeader`로 바꾸어 Name Price만 따로 표현하는게 더 합리적일 수 있다. 그러나 여기선 데이터 콜렉션이라는 역활 책임을 생각해서 남두었다. 뭐가 좋을지는 선택하면 된다.

이제 계층적으로 나타내면 다음과 같다.

- FilterableProductTable
  - SearchBar
  - ProductTable
    - ProductCategoryRow
    - ProductRow

## 2단계 : React로 정적인 버전 만들기

데이터 모델을 가지고 UI 렌더링은 되지만 상호 작용은 안되는 정적인 버전을 만들어 본다. 정적은 버전은 생각을 적게하고 타이핑을 많이 하고, 상호작용을 위해서는 생각을 많이 하고 타이핑을 적게 하는데, 나중에 살펴 보기로 하고 정적인 버전을 만들어 본다.

정적 버전을 위해서 우선은 state를 사용하지 말아라. 우선은 props로 데이터를 부모에서 자식으로 전달하면서 만들어 보아라.

컴포넌트는 top-down(하양식) 이나 bottom-top(상향식) 으로 만들 수 있다. 간단한 예시에서는 보통 하향식으로 만드는게 쉽지만 프로젝트가 커지면 상향식으로 만드록 테스트를 작성하면서 개발하기가 더 쉽다.

이 단계가 끝나면 데이터 렌더링을 위해 만들어진 재사용 가능한 컴포넌트들의 라이브러리르 가지게 된다. 지금은 `render()` 메서드만 가지고 있다. 최상위 컴포넌트는 props를 통해 데이터 모델을 받고 자식 컴포넌트에 전달하는데 한번 만들어 봄으로서 이런 흐름을 파악하기 쉽다.

## 3 단계: UI state 에 대한 최소한의 (하지만 완전한) 표현 찾아 내기

이제 변경해야할 최소한의 state는 무엇일지 생각해본다. TODO 리스트에서 예를 들면 해야할 일 목록을 state를 관리하고, 할일 목록 갯수를 state를 관리하지 않는것을 의미한다. 이것은 중복 배제 원칙이라고 하는데 만약 할일 목록 갯수를 state로 관리하고 싶다면 할일 목록 배열의 갯수를 세는 방법을 사용한다.

다음 목록에서 state가 될만한 것이 무엇이 있을지 생각해 보자.

- 제품의 원본 목록
- 유저가 입력한 검색어
- 체크박스의 값
- 필터링 된 제품들의 목록

다음 3가지 질문을 통해서 확인할 수 있다.

1. 부모로부터 props를 통해 전달 됩니까? -> state가 아니다.
2. 시간이 지나도 변하지 않나요? -> state가 아니다.
3. 컴포넌트 안의 다른 state나 props를 가지고 계산 가능한가요? -> 그렇다면 state 가 아니다.

결과적으로 state는 다음 목록이 된다.

- 유저가 입력한 검색어
- 체크박스의 값

## 4단계 : state가 어디 있어야 할지 찾기

리엑트는 단방향 데이터 흐름을 갔기 때문에 어떤 컴포넌트에 state를 가지게 할지가 중요하다. 다음과 같은 기준을 생각해서 정해보자.

- state를 기반으로 렌더링하는 모든 컴포넌트를 찾으세요.
- 공통 소유 컴포넌트 (common owner component)를 찾으세요. (계층 구조 내에서 특정 state가 있어야 하는 모든 컴포넌트들의 상위에 있는 하나의 컴포넌트).
- 공통 혹은 더 상위에 있는 컴포넌트가 state를 가져야 합니다.
- state를 소유할 적절한 컴포넌트를 찾지 못하였다면, state를 소유하는 컴포넌트를 하나 만들어서 공통 오너 컴포넌트의 상위 계층에 추가하세요.

결정하는 과정으 다음과 같다.

- ProductTable은 state에 의존한 상품 리스트의 필터링해야 하고 SearchBar는 검색어와 체크박스의 상태를 표시해주어야 합니다.
- 공통 소유 컴포넌트는 FilterableProductTable입니다.
- 의미상으로도 FilterableProductTable이 검색어와 체크박스의 체크 여부를 가지는 것이 타당합니다.

## 5단계: 역방향 데이터 흐름 추가하기

우리가 만든 `FilterableProductTable` 에서 아직 `SeacrBar`에 setState를 콜백으로 주지 않았기 때문에 폼을 입력해도 데이터가 변하지 않게 된다. 하위 컴포넌트인 `SearchBar`에서 상위 컴포넌트인 `FilterableProductTable`에 state를 변경하기 위해서는 콜백으로 setState를 주고 하위 컴포넌트에서 호출하면된다.

이렇게 역방향 데이터 흐름을 추가할 수 있다.

## 이게 전부임..
