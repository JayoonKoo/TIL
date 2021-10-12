# Lifting State Up

> 종종 변경 사항을 여러 컴포넌트에 공유 해야할 상황이 있는데 이때 state를 선조 컴포넌트로 끌어 올리는 것이 유용하게 동작한다.

이번에는 물이 특정 온도에서 끓는지 여부를 추정하는 온도계를 만들어 본다.

props 로 celsius를 받고 끓는 온도인지 판단하는 컴포넌트인 `BolingVerdict`를 만든다.

```jsx
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

다음으로 `Calculator` 를 만든다. 사용자의 인풋을 받아서 상태로 관리한다.

```jsx
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { temperature: "" };
  }

  handleChange(e) {
    this.setState({ temperature: e.target.value });
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input value={temperature} onChange={this.handleChange} />
        <BoilingVerdict celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

## Adding a Second input

화씨 입력도 입력 받아 동기화 하도록 한다.

`Calculator` 에서 `TemperatureInput`을 추출한다. props 로 scale를 받아서 화면에 화씨 인지 섭씨 인지 표시해 준다.

```jsx
const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit",
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { temperature: "" };
  }

  handleChange(e) {
    this.setState({ temperature: e.target.value });
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

이제 두개의 분리된 인풋으로 `Calculator`를 만들 수 있다.

```jsx
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

하지만, 두개의 인풋 사이에서 동기화는 되지 않는다. 또한, 현재 입력한 온도가 `TemperatureInput`에서 관리하기 때문에 `Calculator` 에서 `BoilingVerdict`도 렌더할 수 없다.

## Writing Conversion Functions

섭씨 화씨 변환 함수 작성

```js
function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
```

입력한 온도가 숫자로 변환할 수 없으면 빈 문자열을 반환하고, 변환 가능하며 소수점 세 번째 자리에로 반올림하여 리턴한다.

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

## Lifting State Up

지금은 인풋 컴포넌트가 각자 상태를 관리하고 있다.

```jsx
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...
```

리엑트는 공유 되는 State를 만들기 위해서 가장 가까운 조상 요소로 state를 옮기는 방법을 사용하는데 이를 Lifting State Up 이라고 한다.

예제에서는 인풋에 조상 요소인 Calculator 가 state를 관리할 수 있도록 하고 props 로 인풋에 온도를 전달해주면 동기화 기능을 구현할 수 있다.

인풋에서 state로 사용하던 temperature 를 props에 temperature 로 변경한다.

```js
render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

props는 읽기 전용이다. 그전에 `TemperatureInput`에서 변경 됬을때 다시 렌더링 하기 위해서 `this.setState()`를 호출했던것은 이제 할 수 없다. 대신에 온도 변화에 해당하는 함수인 `onTemperatureChange`와 같은 함수를 조상 요소인 `Calculator`에서 만들어서 `props`로 전달해 주면 똑같은 기능을 할 수 있게 만들 수 있다.

> onTemperatureChnage 와 같은 함수 이름은 임의로 정한 것이다 onValueChange 와 같은 이름도 가능하고 마음대로 설정 가능하다.

`TemperatureInput`에 변경사항은 다음과 같다 :

```jsx
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

`Calculator` 의 변경사항은 다음과 같다.:

```jsx
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = { temperature: "", scale: "c" };
  }

  handleCelsiusChange(temperature) {
    this.setState({ scale: "c", temperature });
  }

  handleFahrenheitChange(temperature) {
    this.setState({ scale: "f", temperature });
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius =
      scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit =
      scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange}
        />
        <BoilingVerdict celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```
