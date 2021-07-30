# 커스텀 이벤트 디스패치
## Event의 생성자
내장 이벤트 클래스 계층의 꼭대기엔 `Event` 클래스가 있다.

```js
let event = new Event(type[, options]);
```

- type: "click" 같은 내장 이벤트, "my-event" 같은 커스텀 이벤트가 올 수 있음. 
- options 
  - bubbles: true/false -> true 일 경우 버블링
  - cancelable: true/false -> true 인 경우 브라우저 '기본동작' 이 실행되지 않는다. 
  - 아무런 값도 지정하지 않으면 둘다 false 가 됨. 

<br/>

## dispatchEvent
이베트 객체를 생성한 다음에는 `elem.dispatchEvent(event)`를 호출해 요소에 있는 이벤트를 반드시 실행시켜줘야 한다. 

```html
<button id="elem" onclick="alert('클릭!');">자동으로 클릭 되는 버튼</button>

<script>
  let event = new Event("click");
  elem.dispatchEvent(event);
</script>
```
> event.isTrusted 가 true 이면 사용자 액션을 통해서 만든 이벤트라는 것을 의미. isTrusted 가 false 이면 스크립트를 통해 생성된 이벤트라는 것을 의미

<br/>

## 커스텀 이벤트 버블링
```html
<h1 id="elem">Hello from the script!</h1>

<script>
  // 버블링이 일어나면서 document에서 이벤트가 처리됨
  document.addEventListener("hello", function(event) { // (1)
    alert("Hello from " + event.target.tagName); // Hello from H1
  });

  // 이벤트(hello)를 만들고 elem에서 이벤트 디스패치
  let event = new Event("hello", {bubbles: true}); // (2)
  elem.dispatchEvent(event);

  // document에 할당된 핸들러가 동작하고 메시지가 얼럿창에 출력됩니다.

</script>
```

1. `on<event>` 는 내장 이벤트에서만 사용 가능 `addEventListener`를 사용해야 함.
2. `bubbles: true`를 명시적으로 써야 버블링 사용 가능

<br/>

## MouseEvent, KeyboardEvent 등의 다양한 이벤트
마우스나 키보드와 관련된 이벤트들은 Event 로 생성하는 것이 아니라 관련 생성자로 생성해야 한다. 그래야 해당 이벤트의 전용 프로퍼티를 명시할 수 있다.

```js
let event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 100,
  clientY: 100
});

alert(event.clientX); // 100
```
그냥 Event 로 생성하면 무시된다. 
```js
let event = new Event("click", {
  bubbles: true, // Event 생성자에선
  cancelable: true, // bubbles와 cancelable 프로퍼티만 동작합니다.
  clientX: 100,
  clientY: 100
});

alert(event.clientX); // undefined, 알 수 없는 프로퍼티이기 때문에 무시됩니다.
```

<br/>

## 커스텀 이벤트
제대로된 커스텀 이벤트를 만들려면 그냥 Event로 생성하는 것이 아니라 CustomEvent로 생성해야 한다. 

CustomEvent 로 생성하면 두번째 인수로 detail 이라는 프로퍼티를 추가해 커스텀 이벤트에 대한 정보를 명시할 수 있다.

```html
<h1 id="elem">이보라님, 환영합니다!</h1>

<script>
  // 추가 정보는 이벤트와 함께 핸들러에 전달됩니다.
  elem.addEventListener("hello", function(event) {
    alert(event.detail.name);
  });

  elem.dispatchEvent(new CustomEvent("hello", {
    detail: { name: "보라" }
  }));
</script>
```

사실 Event로 생성해서 추가 프로퍼티를 넘겨주면 되긴 하지만, 이렇게 생성하면 충돌을 피할 수 있고 무엇보다 직접 만든 커스텀 이벤트라는 명시가 된다. 

<br/>

## event.preventDefault()
커스텀 이벤트에는 기본 동작이 없지만 디스패칭 해주는 코드에 원하는 동작을 넣으면, 커스텀 이벤트에도 기본 동작을 설정해줄 수 있다.

`event.preventDefault()`를 호출하면 `elem.dispatchEvent(event)` 호출 시 `false`를 반환한다. 이를 통해서 해당 이벤트에서 기본동작이 취소 되었음을 알 수 있다. 

```html
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>
<button onclick="hide()">hide()를 호출해 토끼 숨기기</button>

<script>
  // hide() will be called automatically in 2 seconds
  function hide() {
    let event = new CustomEvent("hide", {
      cancelable: true // cancelable를 true로 설정하지 않으면 preventDefault가 동작하지 않습니다.
    });
    if (!rabbit.dispatchEvent(event)) {
      alert('기본 동작이 핸들러에 의해 취소되었습니다.');
    } else {
      rabbit.hidden = true;
    }
  }

  rabbit.addEventListener('hide', function(event) {
    if (confirm("preventDefault를 호출하시겠습니까?")) {
      event.preventDefault();
    }
  });
</script>
```

<br/>

## 이벤트 안 이벤트
이벤트는 큐로 처리 된다. 따라서 이벤트가 발생되고 다른 이벤트가 또 발생 되면 먼저 발생한 이벤트가 종료 된 이후에 새롭게 발생한 이벤트가 처리 된다. 

하지만, 이벤트 안에 또 다른 이벤트 실행되는 경우는 다르다. 스텍 처럼 안쪽에 있는 이벤트 가 먼저 실행 된 이후에 바깥에 있는 이벤트가 실행되게 된다.

```html
<button id="menu">메뉴(클릭해주세요)</button>

<script>
  menu.onclick = function() {
    alert(1);

    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  // 1과 2 사이에 트리거됩니다
  document.addEventListener('menu-open', () => alert('중첩 이벤트'));
</script>
```
1, 중첩이벤트, 2 마치 동기적으로 처리되는 것처럼.

때로는 비동기적으로 보이고 싶다면 `setTimeout(()=> {}, 0)` 사용.

```html
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function() {
    alert(1);

    setTimeout(() => menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    })));

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('중첩 이벤트'));
</script>
```
