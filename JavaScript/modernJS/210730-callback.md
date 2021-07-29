# 콜백
비동기적 처리에 대해서 

```js
function loadScript(src) {
  // <script> 태그를 만들고 페이지에 태그를 추가합니다.
  // 태그가 페이지에 추가되면 src에 있는 스크립트를 로딩하고 실행합니다.
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

```js
// 해당 경로에 위치한 스크립트를 불러오고 실행함
loadScript('/my/script.js');
```

loadScript 는 비동기적으로 실행된다. 

`loadScript()`아래에 있는 코드들은 loadScript 가 실행되는 것을 기달려 주지 않고 바로 실행 됨. 

```js
loadScript('/my/script.js'); // script.js엔 "function newFunction() {…}"이 있습니다.

newFunction(); // 함수가 존재하지 않는다는 에러가 발생합니다!
```
newFunction은 loadScript 안에 있으니가 아직 생성 되지 않았을 것이다. 

현재로서는 loadScript가 완료 됬는지 알 수 있는 방법이 없다. 

loadScript가 완료되면 원하는 함수를 실행 시키기 위해서 콜백 함수를 추가 행야 한다. 

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(script);

  document.head.append(script);
}
```
```js
loadScript('/my/script.js', function() {
  // 콜백 함수는 스크립트 로드가 끝나면 실행됩니다.
  newFunction(); // 이제 함수 호출이 제대로 동작합니다.
  ...
});
```

실제 사용 예시
```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`${script.src}가 로드되었습니다.`);
  alert( _ ); // 스크립트에 정의된 함수
});
```
무언가 비동기적으로 처리되는 함수는 처리가 끝난 이후 동작할 함수를 반드시 인수로 제공해야 한다. 

<br/>

## 콜백 속 콜백 
첫번째 스크립트를 읽은후 순차적으로 스크립트를 읽고 싶다면 어떻게 처리해야 할까?

콜백 함수 안에 두번째 loadScript를 호출하면 된다. 

```js
loadScript('/my/script.js', function(script) {

  alert(`${script.src}을 로딩했습니다. 이젠, 다음 스크립트를 로딩합시다.`);

  loadScript('/my/script2.js', function(script) {
    alert(`두 번째 스크립트를 성공적으로 로딩했습니다.`);
  });

});
```

만약 3개라면?

```js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

    loadScript('/my/script3.js', function(script) {
      // 세 스크립트 로딩이 끝난 후 실행됨
    });

  })

});
``` 
만약 갯수가 굉장히 많아진다면??

이렇게 작성히는 것은 적을때는 가능하지만 많을때는 좋은 방법이 아니다..

<br/>

## 에러 핸들링
스크립트 로딩이 실패했을때 에러 핸들링 추가

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}를 불러오는 도중에 에러가 발생했습니다.`));

  document.head.append(script);
}
```
사용
```js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // 에러 처리
  } else {
    // 스크립트 로딩이 성공적으로 끝남
  }
});
```
이런 패턴을 `오류 우선 콜백(error-first callback)` 이라고 한다. 

첫 번째 인수는 에러를 위해 남겨 둔다. 두번재 부터 여러개 추가 할 수 있음. 이렇게 하면 에러 케이스와 성공 케이스 모두 처리 가능하게 된다. 

<br/>

## 멸망의 피라미드 
언뜻 좋아 보이지만 여러개가 반복되면 콜백 지옥이 발생한다. 

```js
loadScript('1.js', function(error, script) {

  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', function(error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript('3.js', function(error, script) {
          if (error) {
            handleError(error);
          } else {
            // 모든 스크립트가 로딩된 후, 실행 흐름이 이어집니다. (*)
          }
        });

      }
    })
  }
});
```

각 동작을 독립적인 함수로 만들어 완화하도록 한다. 

```js
loadScript('1.js', step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('3.js', step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // 모든 스크립트가 로딩되면 다른 동작을 수행합니다. (*)
  }
};
```

사실 이렇게 작성해도 보기 불편한건 사실이고, 함수를 만들었는데 단지 콜백 지옥을 피하기 위해서만 만들었기 때문에 재사용이 불가능하다. 

가장 좋은 방법은 프로 미스를 사용하는 방법인데 다음 포스팅에서 설명하도록 한다. 

