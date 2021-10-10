# Branching management

## Branch Management

`git branch` 를 인수 없이 실행하면 생성된 branch에 목록을 확인 할 수 있다.

```
$ git branch
  iss53
* master
  testing
```

prifix 인 \* 는 현제 HEAD 가 가리키고 있는 브랜치를 뜻한다. 만약 지금 상태에서 작업을 진행하고 커밋하면 master 브랜치에 커밋 내역이 담기게 된다.

`git branch -v` 를 입력하면 각 브랜치 마다 마지막 커밋을 볼 수 있다.

```
$ git branch -v
  iss53   93b412c Fix javascript issue
* master  7a98805 Merge branch 'iss53'
  testing 782fd34 Add scott to the author list in the readme
```

`--merged` 와 `--no-merged` 옵션을 사용하면 현제 브랜치에 병합된 브랜치나 병합되지 않은 브랜치를 확인할 수 있다. 현제 master 브랜치에서 병합된 브랜치에 목록을 보려면 다음과 같이 하면 된다.

```
$ git branch --merged
  iss53
* master
```

일반적으로 이때 \* 가 안붙은 브랜치는 삭제해도 무관한다. 이미 작업 내역에 통합했기 때문이다.

`--no-merged` 옵션을 사용함녀 통합되지 않은 브랜치의 목록도 확인할 수 있다.

```
$ git branch --no-merged
  testing
```

이때 나오는 브랜치는 아직 통합하지 않았기 때문에 `-d` 옵션으로 삭제할 수 없다. 만약 강제로 삭제하고 싶다면 `-D` 옵션을 주어야 한다.

> `--no-merged` 나 `-merged`에 옵션을 달았을때 아무런 인수를 주지 않으면 현제 브랜치에 대해서 조사합니다. 따라서 특정한 브랜치에 대해서 조사하고 싶다면 인수로 브랜치 이름을 주어야 합니다.

## Changing a branch name

> 주의 : 다른 사람이 작업중인 브랜치의 이름을 변경하지 마세요.

브랜치 이름을 잘못 지어서 커밋 내역을 유지한 채로 좋은 이름으로 바꾸려면 어떻게 해야 할까? 또한, 리모트 저장소에도 바꾸려면 어떻게 해야 할까?

로컬에서는 다음과 같은 명령어로 할 수 있다.

```
$ git branch --move bad-branch-name correct-branch-name
```

원격 저장소에도 변경 내용을 추가하고 싶다면 다음과 같이 입력한다.

```
$ git push --set-stream origin correct-branch-name;
```

다음으로 원격 저장소에 bad-branch-name 브랜치를 삭제해준다.

```
$ git push origin --delete bad-branch-name
```

## Changing the master branch name

> 경고 : 메인 브랜치 이름을 변경하는 통합 서비스, 도우미 유틸리티, 빌드/릴리스 스크립트가 중단 될 수도 있다. 변경하기전에 반드시 공동작업자와 상의하길 바란다. 만약 변경했다면 철저히 분석해서 스크립트에서 이전 분기 이름에 대한 참조를 변경해야 한다.

로컬에서 이름을 변경하려면 다음과 같이 해야 한다.

```
$ git branch --move master main
```

원격 저장소에도 적용하려면 다음과 같이 해야 한다.

```
$ git push --set-upstream origin main
```

하지만 아직 원격 저장소에는 master 브랜치가 남아있고 다른 작업 자들은 기본 브랜치로 master 브랜치를 사용해서 작업 내용을 통합할 것이다. 그렇기 때문에 몇가지 추가 사항이 필요하다.

- 이에 의존하는 모든 프로젝트는 코드 및/또는 구성을 업데이트해야 합니다.
- 테스트 실행기 구성 파일을 업데이트합니다.
- 빌드 및 릴리스 스크립트를 조정합니다.
- 리포지토리의 기본 분기, 병합 규칙 및 분기 이름과 일치하는 기타 항목에 대한 리포지토리 호스트의 설정을 리디렉션합니다.
- 문서에서 이전 분기에 대한 참조를 업데이트합니다.
- 이전 분기를 대상으로 하는 모든 pull 요청을 닫거나 병합합니다.

모든 작업을 완료 한 후에 원격 저장소에 master 브랜치를 삭제하도록 한다.
