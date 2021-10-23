# Docker

가상 os를 사용해본 경험이 한번쯤은 있을 것이다. 가상 os는 vm 같은 프로그램을 사용해서 현제 os 위에 새로운 os를 설치하는 것인데 이를 통해서 다른 host os 와는 다른 os를 사용할 수 있게 된다.

vm ware와 같은 소프트웨어에서는 hostos 위에 hypervisor 를 두어서 그 위에 가상 os를 설치하는 방법을 사용한다. 이때 하드웨어 리소스를 필요한 부분 만큼 떼어 놓고 그 리소스 안에서 os를 사용하게 되는데 성능상에 손실이 있을 수 있다.

그에 반에 Docker는 Docker engine 을 사용하여 프로세스 수준으로 리소스를 격리할 수 있다.

## Docker를 사용하는 이유?

1. 컨테이너 이미지의 용량이 적다.
2. 배포 속도가 빠르다.
3. 가상화된 공간을 사용할 때의 성능손실이 적다.

## Docker 설치

[설치 docs](https://docs.docker.com/engine/install/ubuntu/) 우분투에 대한 내용은 여기서 찾아 볼 수 있다. 문서를 보고 다른 os도 따라서 해보면 된다.

## 도커 이미지란?

Docker Hub 라는 중앙 저장소에서 이미지 다운로드, 우리가 사용하는 도커 엔진에서 `docker pull` 로 이미지를 받아올 수 있고 `docker push` 로 Docker Hub 로 이미지를 올릴 수 있다.

온갖 이미지가 다 있다. -> official 인지 확인

개발 환경 그 자체이다. 도커를 통해서 개발환경을 공통되게 가져 갈 수 있다. 소프트 웨어에 버전까지도 맞춤

## Dockerfile 이란?

이미지 -> docker file :

이미지를 빌드하는데 필요한 모든 명령을 순서대로 포함하는 텍스트 파일 -> node 버전 설치, msql 버전 설치 등등..

도커 파일 예시

```
# syntax=docker/dockerfile:1
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```

from -> 도커 이미지에서 레이어를 만듦 (가장 하단 부)

copy -> 현제 디렉터리에서 파일을 추가함

run make -> 앱을 빌드

cmd -> 파일 실행

## 도커 컨테이너

컨테이너는 독립된 공간임. 서로 영향을 받지 않음. 도커 안에서 컨테이너를 늘려서 분산처리를 하면서 성능을 높일 수 있다.

컨네이너 -> 애플리케이션 들이 올라가는 공간

## 컨테이너 사용해 보기

컨테이너를 만들면 자동적으로 이미지까지 만들 수 있다. 컨테이너 만들기. 명령어 입력시 로컬에서 이미지를 찾고 로컬에 없으면 Docker Hub 에서 이미지를 받아옴.

```
sudo docker run -i -t ubuntu:14.0
```

컨테이너에 들어와서 우분투를 사용할 수 있음.

## 애플리케이션 올리기

### 여러가지 명렁어

- `exit()` 도커 이미지 종료 하고 나오기
- ctrl + p + q 종료는 하지 않고 컨테이너 나오기
- `docker stop <container name>` 컨테이너 멈추기
- `docker images` 로컬 이미지 목록 출력
- `docker search <image name>` 허브에 도커 이미지 있는지 확인
- `docker pull <image name>` 이미지 가져오기

### wordpress 실행하기

`docker run --name fs-docker -p 8080:80 -d wordpress`

- fs-docker 이름으로
- 8080:80 번 포트에 실행

어떻게 사용하는지는 docker hub 사이트에서 해당 이미지 이름을 입력하여 찾아보면 된다.
