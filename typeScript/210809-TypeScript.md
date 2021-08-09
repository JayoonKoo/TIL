# TypeScript
## TypeScript란 무엇인가?
자바 스크립트에 타입을 명시. 확장 한 것 

코드를 실행 시키기 전에 에러를 잡아줌. 

자바스크립트가 실행되는 어떤 환경에서도 동작함.

Typed superset of JavaScript

컴파일해서 plain JavaScript 로 변환함. 
but, 정통적인 컴파일과는 다름. 타이밍상 컴파일이라 많은 사람들이 Transpile 이라는 용어를 사용함. 

## TypeScript 설치 및 설정 
- node.js 설치
- 크롬 설치
- 타입 스크립트 컴파일러 설치 
```
npm i typescript -g 
tsc source.ts
```
`node_module/.bin/tsc` 에 tsc 있음. 

- 초기화 
`tsc --init` 실행하면 어떻게 컴파일 할것인지에 대한 설정 파일 `tsconfig.json` 생성.
`tscconfig.json` 이 있는 폴더에서 tsc 실행하면 해당 폴더에 있는 모든 ts 파일이 설정에 맞게 컴파일 됨. 

- 와치 모드로 시작 
새롭게 파일이 생성되거나 저장될때 마다 tsc 를 실행해 주지 않고 와치 모드로 시작되서 변경 감지 후 자동으로 변환 시작하게 함.
`tsc -w`

### 프로젝트에만 설치하기 
글로벌로 설치한 것 지우기
`npm uninstall typescript -g`

`npm init -y`

`npm i typescript -D` 개발 라이브러리로 설치 

글로벌이 아닐때에는 tsc 경로를 명시해줘야함. `node_modules/.bin/tsc`
`npx tsc`로 똑같이 사용 가능

모든 명령어 앞에다 npx 붙여서 사용.

보통은 package.json 에 script를 수정함. 
`"build": "tsc"` npm run build 로 실행 가능. 

## First Type Annotation
ts 는 처임 초기화 된 변수를 토대로 type를 할당함. 만약 초기화 하지 않았다면 `any` 가 됨. 

어떤 type인지 명시하는 것을 type annotation 이라고 하고 아래와 같이 사용한다.
```ts
let a: number;
a = 39;
```

