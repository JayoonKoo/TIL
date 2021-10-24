# remote branch

리모트 Refs는 리모트 저장소에 있는 포인터인 레퍼런스다. 리모트 저장소에 있는 브랜치, 태그, 등등을 의미한다. `git ls-remote [remote]` 명령으로 모든 리모트 Refs를 조회할 수 있다.

`git remote show [remote]` 명령은 모든 브랜치와그 정보를 보여준다. 리모트 Refs가 있지만 봍은 리모트 트래킹 브랜치를 사용한다.

리모트 트래킹 브랜치는 리모트 브랜치를 추적하는 래퍼런스이며 브랜치이다. 임의로 움직일 수는 없고 리모트 서버에 연결할때마다 갱신된다.

리모트 트래킹 브랜치의 이름은 `<remote>/<branch>` 형식으로 되어 있다. 예를 들어 `orogin` 저장소에 `master` 브랜치를 보고 싶다면 `origin/master` 라는 이름으로 브랜치를 확인하면 된다.

어떤 깃 서버에서 `clone`을 진행하면 git은 자동으로 서버 저장소에 주소를 `origin`으로 만든다. 이 `origin` 저장소 데이터를 모두 내려받고 `master` 브랜치를 가리키는 포인터를 만든다. 이 포인터를 `origin/master`라고 부르고 앞에서 설명했던데로 이것은 임의로 조작할 수 없다. 이제 git은 로컬의 `master` 브랜치가 `origin/master` 를 가리키게 한다.

> `origin`이라는 의미는 특별한 의미가 있는것이 아니다. `git clone -o booyah`라고 입력하면 리모트 브랜치로 `booyah/master`를 갖게 된다.

## 작업 진행

이제 로컬에서 작업을 진행하여 커할 수 있다. 이렇게 작업을 하다가 다른 동료가 git 서버에 master 브랜치에 작업을 진행하고 푸시하면 현제 내 로컬의 `origin/master` 가 가르키는 커밋과 서버에 `master` 브랜치, 로컬에 `master` 브랜치 모두 다른 커밋을 가르키게 된다.

이때 리모트 버로 부터 저장소 정보를 동기화 하려면 `git fetch origin` 명령을 사용한다. 명령어 입력시 현재 로컬이 가지고 있지 않은 정보를 모두 업데이트 하고 `origin/master` 브랜치를 최시 커밋으로 이동시킨다.

<img src="images/211024-remote branch/1.png" width="500">

리모트 저장소를 여러개 운영한다고 가정해 보자. 여기 `git.team1.ourcaompany.com`이라는 새로운 저장소가 있다. 로컬에서 `teamone`이라는 이름으로 리몬트 저장소를 추가한다. (`git remote add teamone git://git.team1.ourcompany.com`)

이제 `git fetch teamone`을 입력하면 `git.team1.ourrcompany.com` 에서 데이터를 받아와 업데이트한다. 이경우 모든 데이터를 갖고 있기 때문에 업데이트 하지는 않지만 리모트 트래킹 브랜치 `teamone/master` 브랜치가 `teamone` 서버에 `master` 브랜치가 가리키는 커밋을 가리키게 한다.

<img src="images/211024-remote branch/2.png" width="500">

## Push 하기

로컬에 브랜치는 자동으로 서버에 전송되지 않는다. 쓰기 권한이 있는 리모트 저장소에서 명시적으로 `push` 명령어를 입력해야 수행된다. 또는, 다른사람과 협업을 위해 토픽 브랜치만 push 할 수 도 있다.

예를들어 `serverfix` 라는 브랜치를 다른 사람과 공유할 때도 브랜치를 처음 push 하는 것과 같은 방법으로 push 한다.
`git push <remote> <branch>`

```
$ git push origin serverfix
Counting objects: 24, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (24/24), 1.91 KiB | 0 bytes/s, done.
Total 24 (delta 2), reused 0 (delta 0)
To https://github.com/schacon/simplegit
 * [new branch]      serverfix -> serverfix
```

git 은 serverfix라는 브랜치 이름을 `refs/heads/serverfix:refs/heads/serverfix`로 확장한다. 나중에 `refs/heads` 라는 뜻에 대해서 자세히 살펴볼 것이므로 여기서는 단순히 serverfix라는 브랜치를 리모트의 serverfix 브랜치로 업데이트 하는것이라고 생각하면 된다. 이것은 `git push origin serverfix:serverfix`라고 입력하는 것과 같은데 만약 다른 이름을 사용해서 푸시하고 싶다면 `git push origin serverfix:awesomebranch`처럼 사용하면 된다.

나중에 누군가 fetch 하고 서버에 `serverfix` 브랜치에 접근할때 `origin/serverfix` 라는 이름으로 접근할 수 있다.

```
$ git fetch origin
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 3 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/schacon/simplegit
 * [new branch]      serverfix    -> origin/serverfix
```

주의할점은 fetch를 했다고 로컬에 serverfix 브랜치가 생기는 것은 아니라는 점이다. fetch를 하면 단지 `orign/serverfix` 포인터를 얻게 되는 것이다. 따라서 수정할 수 있는 serverfix 브랜치를 얻고 싶다면 merge 해야 한다. `git merge origin/serverfix`.

만약 merge 하지 않고 리모트 트래킹 브랜치에서 시작하는 새 브랜치를 만들려면 아래와 같은 명령을 사용한다.

```
$ git checkout -b serverfix origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

그러면 `origin/serverfix` 에서 시작하고 수정할 수 있는 `serverfix`라는 브랜치가 만들어진다.

## 브랜치 추적

리모트 트래킹 브랜치를 로컬 브랜치로 checkout 하면 자동으로 트래킹 브랜치가 만들어진다. 트래킹 하는 대상 브랜치를 upstream 브랜치라고 부른다. git pull 명령을 내리면 트래킹 브랜치는 자동으로 연결된 리모트 브랜치와 머지한다.

서버로부터 저장소를 clone 하면 git은 자동으로 `master` 브랜치를 `origin/master` 브랜치의 트래킹 브랜치로 만든다.

트래킹 브랜치를 직접 만들 수도 있다. 앞에서 본것과 같이 `git checkout -b <branch> <remote>/<branch>`로 간단히 트래킹 브랜치를 만들 수 있다. `--track` 옵션을 사용하여 로컬 브랜치 이름을 자동으로 생성할 수도 있다.

```
$ git checkout --track origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

이 명령어는 매우 자주 쓰여서 더 생략할 수 있다. dlqfurgks 브랜치가 있는 리모트가 딱 하나 있고 로컬에는 없으면 git은 트래킹 브랜치를 만들어 준다.

```
$ git checkout serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

이미 로컬에 존재하는 브랜치가 리모트의 특정 브랜치를 추적하게 하려면 git branch 명령에 `-u` 나 `--set-upstream-to` 옵션을 붙여서 아래와 같이 설정한다.

```
$ git branch -u origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
```

추적 브랜치가 현재 어떻게 설정되어 있는지 확인하려면 `git branch` 명령에 `-vv` 옵션을 더한다.

```
$ git branch -vv
  iss53     7e424c3 [origin/iss53: ahead 2] forgot the brackets
  master    1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
  testing   5ea463a trying something new
```

iss53 브랜치는 리모트에 iss53 브랜치를 추적하고 있고 로컬에 2개의 커밋이 쌓여 있는 상태이다. (아직 push 안해서)
serverfix 브랜치는 teamone/server-fix-good 을 추적하고 있는 상태이고 3개의 커밋이 쌓여 있고 서버에 올라온 하나의 커밋을 아직 머지 하지 않은 상태이다. testing 브랜치는 추적하고 있는 리모트 브랜치가 아직 없다.

여기서 중요한 점은 명령을 실행했을때는 마지막으로 fetch한 시점에 데이터이기 때문에 서버에 최신사항은 아니라는 것이다. 정확하게 알고 싶다면 모든 브랜치에서 fetch를 진행하고 확인해야 한다.

```
$ git fetch --all; git branch -vv
```

## Pull 하기

`git fetch` 명령을 실행하면 서버에는 존재하지만, 로컬에는 아직 없는 데이터를 받아와서 저장한다. 그러나 아직 로컬 파일이 변경되는 것은 아니다. 머지를 해야 변경사항이 적용 되는데 따라서 pull 명령어는 fetch 를 하고 merge를 한 결과라고 생각할 수 있다. 실제로 pull 은 두 작업을 순서대로 실행하는 것과 같은데 일반적인 경우는 명시적으로 fetch 와 merge를 따로 실행하는 것이 더 낫다.

## 리모트 브랜치 삭제

동료와 협업하기 위해 만들었던 브랜치를 머지하고 나면 더이상 필요 없게 된다. `git push` 명령에 `--delete` 옵션을 사용하여 리모트 브랜치를 삭제할 수 있다.

```
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit
 - [deleted]         serverfix
```

만약 원격 저장소에서 리드미를 만들고 로컬에서 커밋한 파일을 동일한 원격 레포에 올리고 싶다면 풀 받을 수 없기 때문에 푸시도 할 수 없을 것이다.

그럴때는,

원격 저장소 내용을 업데이트 한다.

- `git fetch origin`

main 브랜치가 원격에 origin/main 브랜치를 추적할 수 있도록 만든다.

- main 브랜치에서 `git branch -u origin/main`

git pull 정책을 설정한다. git은 pull 할때에 어떤 정책을 사용할지 처음에는 모르기 때문에 pull 할 수 없는데 이때 config 설정을 통해서 설정해주면 된다.

- 이경우에는 reabase를 해야한다. `git config pull.rebase true`

이제 pull 하고 reabse 설정은 불필요 할 수 있으니 삭제한다.

- `git pull origin`, `git config --unset pull.rebase`
