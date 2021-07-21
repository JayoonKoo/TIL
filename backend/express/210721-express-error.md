# 11.8 에러 처리의 모든것 (동기, 비동기)
에러를 처리하는것은 서버에서 반드시 해야 할 일이다. 

## app.use
app.use를 통해서 마지막에 error 를 한번에 처리할 수 있다. 
```js
app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).json({message: 'Somthing went Wrong'});
})
```
그러나 app.use 처리하면 미들웨어에 대한 적절한 error 처리를 못할 수 있기 때문에 각각의 미들웨어에서 처리하는것이 바람직하다.

<br/>

## 비동기 처리
비동기 함수의 경우 함수에서 처리하지 않으면 서버에서 에러를 처리할 방법이 없다. (비동기기 때문에 app.use에 안걸림). 

따라서 함수 내에서 처리하거나 try catch 문을 사용하여 처리해 준다. 

### 프로미스를 반환하지 않음
프로미스를 반환하지 않는 비동기의 경우 error 처리는 다음과 같이 한다.
```js
app.get('/file', (req, res) => {
	fs.readFile('/fil1.txt', (err, data) => {
		if(err) {
			res.sendStatus(404);
		}
	});
})
```
### 프로미스를 반환
프로미스를 반환 하는 경우 .catch를 사용하여 error를 처리함
```js
app.get('/file2', (req, res)=> {
	fsAsync
		.readFile('/file2.txt')
		.then((data) => res.send(data))
		.catch((error) => res.sendStatus(404));
})
```
### async, await를 사용하는 프로미스
async와 await는 비동기 함수를 동기 함수처럼 보이게 해 콜백 지옥을 벗어나게 도와준다. error 처리를 위해서는 프로미스더라도 try catch 를 사용한다.
```js
app.get('/file3', async function (req, res) {
	try {
		const data = await fsAsync.readFile('/file2.txt');
		res.send(data);
	} catch (error) {
		res.sendStatus(404);
	}
})
```

<br/>

## 동기 처리
동기 함수의 경우 서버에서 사용하는것을 비추하지만 그래도 사용한다면 try catch 를 사용하여 error를 처리한다.
```js
app.get('/file1', (req, res) => {
	try {
		const data = fs.readFileSync('/file1.txt');
		res.send(data);
	} catch(error) {
		res.sendStatus(404);
	}
})
```

## 비동기 처리 귀찮은데...
다음 버전인 5버전 부터는 비동기 함수의 error를 처리할수 있는 헨드러를 제공한다고 한다.
