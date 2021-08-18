# TypeScript Compiler

## Compliation Context

논리적인 그룹핑과 어떤 방법으로 컴파일 할것인지에 대한 맥락.
보통 `tsconfig.json` 파일로 관리한다.

## tsconfig schema

최상위 프로퍼티 중 주요한 항목

- compileOnSave
- extends
- compileOptions
- files
- include
- exclude
- references

## compileOnSave

- true/false(default fasle): true 로 설정하면 저장하면 컴파일 해줌.
- 누가?
  - Visual Studio 2015 with TypeScript 1.8.4 이상
  - tom-thypescript 플러그인

## extends

상속 받을 때 사용함.

- 파일 (상대) 경로명 : string

```json
{
  "compilerOptins": {
    "strict": true
  }
}
```

```json
{
  "extends": "./base.json"
}
```

`tsconfig/base` 저장소로 이동하면 다양한 base 설정을 받을 수 있다.

`npm install --save-dev @tsconfig/deno`

```json
{
  "extends": "@tsconfig/deno/tsconfig.json"
}
```

## files, include, exclude

어떤 파일을 컴파일 할것인지 결정함.

files 가 가장 강한 설정이다. 따라서 exlucde를 통해서 제외 했더라도 files 안에 있으면 컴파일 된다.

셋다 설정이 없으면 전부 컴파일 하려고 한다.

- files
  - 상대 혹은 절대 경로의 리스트 배열이다.
  - exclude 보다 쎄다.
- include, exclude
  - glob 패턴 (마치 .gitignore)
  - include
    - exclude 보다 약하다.
  - exclude
    - 설정 안하면 4가지 (node_modules, bower_components, jspm_packages, \<outDir\>) 를 dafault로 제외 함.
    - \<outDir\> 은 항상 제외한다. (include에 있어도)

## compileOptions - typeRoots, types

만약 외부 라이브러리를 사용할 경우 타입 검사를 어떻게 수행할까?

예를 들어 react를 설치하면 js로 만든 것이기 때문에 오류가 발생한다. 따라서 `npm i --save-dev @types/react`를 하게 되면 `node_modules/@types`안에서 파일을 찾아서 오류가 나지 않게 된다.
이것이 default 설정인데 typeRoots와 types 를 통해 설정을 변경할 수 있다.

typeRoots로 @types로 사용할 폴더를 설정한다. 유명하지 않는 라이브러리 같은 경우 @types가 없을 수 있고 내가 작성한 패키지는 내가 따로 만들어야 하는 경우도 있다.

`@types`

- 내장 type definition 시스템이다.
- 아무 설정을 하지 않으면 `node_modules/@types` 라는 모든 경로를 찾아서 사용한다.
- typeRoots를 사용하면? -> 배열 안에 들어있는 경로들 아래서만 가져온다.
- types 를 사용하면 -> 배열안에 모듈 혹은 `./node_module/@types/` 안에 모듈 이름에서 찾아온다. [] 빈 배열을 넣는다는 건 이 시스템을 이용하지 않겠다는 것이다.
- typeRoots와 types를 같이 사용하지는 않는다.

## compileOptions - target과 lib

target - 자바스크립트 버전을 설정한다. 기본값은 es3이다. 컴파일 할때 해당 버전으로 변경한다.

lib - lib로 사용할것들을 배열로 넘겨줌. target에 따라 default로 저장되는 lib가 있다.

## compileOptions -outDir, outFil, rootDir

- rootDir : 컴파일 대상이 되는 파일이 있는 폴더

따로 설정하지 않으면 ts 파일이 있는 가장 최상위 폴더를 rootDir로 설정한다.

- outDir : 컴파일 한 파일이 저장될 폴더
- outFile: 지정된 경우 모든 전역 파일이 지정된 단일 출력 파일로 연결된다.

## compileOptions - strict

무조건 strict를 true로 설정하는 것이 기본이다.

`--noImplicitAny` any로 추정되는데 any로 명시하지 않았다면 에러가 발생함.
`suppressImplicitAnyIndexErrors` 인덱스 객체도 any로 추론될 경우 에러를 발생시키는 옵션인데 이것은 너무 까다로우니 따로 에러가 되지 않게 하는 설정도 있음.

`--noImplictThis` this 가 any 타입으로 추정될 경우 . this에 타입을 명시해야 한다고 에러를 발생 시킴, 함수 매개변수에 첫번째에 this를 넣고 타입일 지정해줌. js에서는 오류 이지만 ts에서는 가능함.
마치 call /applyu/ bind 와 같이 this를 대체하여 함수 콜을 사용하는 용도. class에서는 오류가 나지 않음 왜냐하면 class 자체로 타입 체크가 가능하기 때문에

`--strictNullChecks` 이것을 적용히지 않으면 모든 타입은 null 과 undefined가 될 수 있다. 꼭 설정해주어야 함. 한가지 예외는 undefined 에 void 할당이 가능하다.

`--strictFunctionTypes` 반환 타입은 공변적, 인자 타입은 반 공병적. 그런데 타입스크립트에서 인자 타입은 공변적이면서, 반공변적인게 문제. 함수의 파라미터 타입이 반공변적으로 동작핟조록 변경한다. 반공변 이란 공변에 반대라고 생각하면 된다.

```ts
type Logger<T> = (param: T) => void;
let log: Logger<string | number> = (param) => {
  console.log(param);
};
let logNumber: Logger<number> = (param) => {
  console.log(param);
};
log = logNumber; // Error
logNumber = log; // OK
```

공변이라고 생각하면 logNumber 가 서브 타입이기대문에 log에 할당하는 것이 가능할 것이다. 하지만 `--strictFunctionTypes`를 적용하면 파라미터에 대해서 반공변적으로 작동하기 때문에 반대로 작동한다.
사실 `logNumber`는 숫자 밖에 처리하지 못하기 때문에 string 도 처리할 수 있는 `log`에 할당하는게 맞지 않다.

`--stcitPropertyInitialization` 정의되지 않은 클래스의 속성이 생성자에서 초기화되었는지 확인한다. 만약 비동기로 생성되는 클래스일 경우에 생성자에 async를 사용하는것이 불가능하기 때문에 에러가 발생한다.
이럴때에는 async 함수로 initialize 같은 함수를 만들어 할당해 주고 클래스 내부 변수로 이름 뒤에 `!`를 붙여주면 된다. `private _name!: string;`

`--strictBindCallApply` bind, call, apply 에 대한 검사를 엄격히 수행한다.

`--alwaysStrict` strict 모드로 코드를 분석함.
