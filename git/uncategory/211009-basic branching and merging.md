# Basic Branching and Merging

실제 개발 과정에 flow는 다음과 같다.

1. 웹사이트가 있고 뭔가 작업을 진행중이다.
2. 새로운 이슈를 처리할 branch를 하나를 생성한다.
3. 새로 만든 branch에서 작업을 진행한다.

이때 즁오한 문제가 생겨서 처리해야 할 일이 생긴다. 그러면 아래와 같이 진행한다.

1. 새로운 이슈를 처리하기 위해 운영 브랜치로 이동한다.
2. Hotfix 브랜치를 새로 하나 생성한다.
3. Hotfix 에서 문제를 수정하고 테스트를 마친 후 운영 브랜치로 머지한다.
4. 다시 작업하던 brnahc로 이동하고 마찬가지로 작업 완료, 테스트 진행 후 운영 브랜치로 머지한다.

## 브랜치의 기초

회사 내의 새로운 53번 이슈를 해결해야 한다면 다음과 같이 브랜치를 만들고 동시에 switch 할 수 도 있다. 옵션 플래그는 -b 이다.

```
$ git checkout -b iss53
Switched to a new branch "iss53"
```

이제 iss53 브렌치에서 작업을 진행하고 커밋한다.

```
$ vim index.html
$ git commit -a -m 'added a new footer [issue 53]'
```

그러면 main 브렌치보다 커밋을 하나 더한 상태가 된다. 이때 어떤 문제가 생겨서 빨리 해결해야 한다고 가정하자. 이를 해결 하기 위해서 우선은 main 브랜치로 이동하고 HotFix 브랜치를 만들어서 기존에 작업하던 iss53에 영향을 안주고 고칠 수 있다. 먼저 main 브렌치로 옮긴다. 아직 커밋하지 않은 checkout 브랜치와 충돌을 발생시킬수도 있는데 우선은 모두 커밋한 후에 main 브랜치로 이동하도록 한다.

```
$ git checkout master
Switched to branch 'master'
```

(main 브랜치는 기본 브랜치라는 의미여서 이름은 master 여도 상관 없다. )

이제 hotfix 브랜치를 생성, 전환하고 작업한후 결과를 커밋한다.

```
$ git checkout -b hotfix
Switched to a new branch 'hotfix'
$ vim index.html
$ git commit -a -m 'fixed the broken email address'
[hotfix 1fb7853] fixed the broken email address
 1 file changed, 2 insertions(+)
```

작업이 완료 되었으면 다시 main 브랜치로 이동하고 hotfix 브랜치를 병합한다.

```
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```

hotfix 브랜치는 master 브랜치에서 단순히 이동만 시킨 상태가 되기 때문에 이를 fast=-foward라고 한다.

이제 hotfix 브랜치는 필요 없어졌기 때문에 삭제 하도록 한다. 플래그는 -d 이다.

```
$ git branch -d hotfix
Deleted branch hotfix (3a0874c).
```

그리고 다시 iss53 브랜치로 이동한 후 작업을 환료하도록 한다.

```
$ git checkout iss53
Switched to branch "iss53"
$ vim index.html
$ git commit -a -m 'finished the new footer [issue 53]'
[iss53 ad82d7a] finished the new footer [issue 53]
1 file changed, 1 insertion(+)
```

작업을 완료하면 main 브랜치로 전환 한 후에 iss53번 브랜치와 병합한다. 그럼 hotfix 내용이 포함된 main 브랜치에 새로운 iss도 처리한 브랜치로 병합할 수 있다.

## Merge 의 기초

```
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

이번에 머지를 진행하면 hotfix 머지했때랑 다른 메세지를 보여준다. 이는 현제 브랜치가 가리키는 커밋이 머지할 브랜치의 조상이 아니므로 fast-foward로 병합하지 못하기 때문이다. 이 경우에 git은 이 둘의 공통 조상이 가리키는 스냅샷과 각각의 스냅샨을 사용한 3-way Merge 실행한다. 각각의 스냅샷을 비교한 후 새로운 커밋을 만들고 그 커밋의 조상이 각각의 브랜치를 바라보게 하는 것이다.

## 충돌의 기초

3-way Merge를 진행할때 충돌이 발생하기도 한다. 충돌은 merge 하려는 브랜치에서 동일한 작업한 브랜치와 동일한 파일에 내용이 달라서 발생한다. 예를 들어 앞서서 hotfix에서 index.html에 대한 작업을 진행했고, iss53에서도 마찬가지로 index.html에 대한 작업을 진행했으면 아래와 같이 충돌이 발생한다.

```
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

git status 명령을 입력하여 어디가 충돌이 발생했는지 알 수 있다.

```
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
```

Unmerged path: 에 있는 파일을 확인하면 된다.

```
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

해당 파일을 열어보면 다음과 같은 표시를 해준다. HEAD 브랜치는 main 브랜치이고 `=====` 다음에 내용은 iss53에 내요이다. 이럴때는 HEAD에 내용을 선택할지 iss53에 내용을 선택할지, 아니면 다 섞을지, 내용을 삭제할지 , 새로운 내용을 만들지 정한후 수정하면 된다.

밑에는 새로운 다 지우고 새로운 내용을 추가한 예제이다.

```
<div id="footer">
please contact us at email.support@github.com
</div>
```

충돌을 해결하고 나서 해당 파일을 커밋하면 merge 에 대한 내용을 보여주고 merge된다.

```
Merge branch 'iss53'

Conflicts:
    index.html
#
# It looks like you may be committing a merge.
# If this is not correct, please remove the file
#	.git/MERGE_HEAD
# and try again.


# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# All conflicts fixed but you are still merging.
#
# Changes to be committed:
#	modified:   index.html
#
```
