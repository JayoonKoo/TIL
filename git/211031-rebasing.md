# rebasing

깃에서 브랜치를 합치는 방법은 두가지가 있다. 하나는 merge 이고 하나는 rebasing 이다. 이절에서는 rebase 에 대해서 알아본다. 

## rebase 의 기초 
merge 는 두 브랜치의 마지막 커밋과 두 브랜치의 공통 조상 커밋을 사용하는 `3-way Merge`로 커밋을 한다. 비슷한 결과를 만드는 다른 방식으로, 한 브랜치에 변경 사항을 `Patch`로 만들고 이를 다시 다른 브랜치의 커밋에 적용하는 방법이 있다. 이를 Git 에서는 `Rebase` 라고 한다. 


명령어 예시는 다음과 같다 : 
```
$ git checkout experiment
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: added staged command
```

일단 두 브랜치가 나뉘기 전인 공통 커밋으로 돌아간 이후에 chekcout 한 브랜치가 가리키는 커밋까지 `diff` 를 차례로 만들어 어딘가 저장해 놓는다. Rebase 할 브랜치(Checkout 한 브랜치) 가 합칠 브랜치 (rebase 명령어 대상 브랜치 (master)) 가 가리키는 커밋을 가리키게 하고 아까 저장해 놓았던 변경사항을 차례대로 적용한다. 

그리고 나서 `master` 브랜치를 `fast-forward` 시킨다. 
```
$ git checkout master
$ git merge experiment
```
이렇게 합쳐진 커밋은 merge 를 통해 합친 결과와 동일할 것이다. 그러나 커밋내역을 확인하면 둘의 차이를 확인할 수 있다. merge 한 커밋은 두 브랜치가 나뉜뒤 합쳐진 형태 이지만, rebase를 진행한 커밋은 직렬로 연결된 커밋 내역이 될것이다. 

## Rebase 활용 
Rebase 는 단순히 브랜치를 합치는 것만 아니라 다른 용도로도 사용할 수 있다. 토픽 브랜치로 갈라겨 나온 브랜치에서 다른 토픽 브랜치를 만들었다고 생각해 보자. 예를들어서 `main` 브랜치에서 `server` 브랜치를 만들었고 `server` 브랜치에서 `client` 브랜치를 만들었다는 경우가 그렇다. 

<img >

이때 테스트가 덜된 `server` 브랜치는 그대로 두고 `client` 브랜치만 `master` 브랜치로 합치려는 상황을 생각해 보자. `c8`, `c9` 커밋을 합처야 하는 데 두 커밋을 `master` 브랜치에 적용하기 위해서 `onto` 옵션을 사용한다. 
```
$ git rebase --onto master server client
```

이 명령은 `client` 브랜치에서만 변경된 패치를 만들어 `master` 브랜치에서 `client` 브랜치를 기반으로 새로 만드렁 적용한다. 

<img 2>

이제 `master` 브랜치로 돌아가서 Fast-forward 시킬 수 있다. 
```
$ git checkout master
$ git merge client
```

`server` 브랜치의 일이 다 끝나면 `git rebase <basebranch> <topicbranch>` 라는 명령으로 Checkout 하지 않고 바로 `server` 브랜치로 Rebase 할 수 있다. 
```
$ git rebase master server
```

그리고 나서 master 브래치를 Fast-forward 시킨다. 
```
$ git checkout master
$ git merge server
```

이제 `server`, `client` 브랜치를 삭제해도 커밋 히스토리는 여전히 남아 있다. 

## Rebase의 위험성
이미 공개 저장소에 Push 한 커밋은 Rebase 하지 마라. Rebase는 기존의 커밋을 그대로 사용하는 것이 아니라 내용은 같지만 다른 커밋을 새로 만든다. 다른 작업자가 pull 할때 다른 커밋이 됬기 때문에 merge할 것이고 그 커밋을 또다시 push에서 내가 pull 하게 되면 엉망이 될 것이다. 



