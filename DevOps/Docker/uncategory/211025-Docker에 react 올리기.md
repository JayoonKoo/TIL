# Docker 에 react 올려서 배포하기

리액트 앱을 Docker에 올리는 방법을 알아보자. 우선 리액트 앱이 필요하니 `CRA` 를 이용하여 리액트 앱을 생성해 준다.

```
$ npx create-react-app docker-react
$ cd docker-react
```

## Docker 적용

Dockerfile 은 Docker image 를 구성하기 위한 파일이라고 생각하면 된다.

```dockerfile
# 기저 이미지
FROM node:14
# 워킹 디렉토리 설정
WORKDIR /usr/src/app
# 환경변수 설정
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# 앱 의존성
COPY package*.json ./
COPY . .
RUN npm install

# 앱 실행
CMD ["npm", "start"]
```

다음으로 `.dockerignore` 를 설정한다. 이것은 `.gitignore` 와 같은 역할을 하는 파일로서 이미지에 올리고 싶지 않은 파일을 명시한다.

```
node_modules
```

이제 이미지를 생성한다.

```
$ docker build . -t docker-react/app
```

그리고 이미지를 실행한다.

```
$ docker run --name docker-react -p 3001:3000 -d docker-react/app
```

docker ru 옵션

- `-d` : background 실행 -> 이렇게 설정하면 터미널을 종료해도 컨테이너가 종료되지 않는다.
- `--name` : 컨테이너 식별자 설정
- `-p` : 포트 옵션 3000번은 같은 도커 컨테이너 내에서 접근할 수 있는 포트 번호, 3001 번은 외부에서 접근할 수 있는 포트 번호이다.
- `--rm` : 컨테이너가 종료되면 자동으로 삭제하라는 의미이다.
