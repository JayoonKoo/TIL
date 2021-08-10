# login process
## 로그인 API 만들기
기존에 컨트롤러에서 반환하는 `login`은 `get` 메서드에 대응하는 함수였으니 이를 `output`으로 만들고 `post` 메서드에 대응하는 `login`을 만들기 위해서 `process`를 다로 만든다. 
```js
const output = {
	hello: (req, res) => {
		res.render("home/root");
	},
	login: (req, res) => {
		res.render("home/login");
	}
}

const process = {
	login: (req, res)=> {
		const id = req.body.id,
			password = req.body.password;

		const users = UserStorage.getUsers("id", "password");
		
		const response = {};
		if (users.id.includes(id)) {
			const idx = users.id.indexOf(id);
			if (users.password[idx] === password) {
				response.success = true;
				return res.json(response);
			}
		}

		response.success = false;
		response.msg = "로그인 할 수 없습니다.";
		return res.json(response);
	}
}
```
`router`에서 연결해 준다. 
```js
routes.get('/', output.hello);
routes.get('/login', output.login);
routes.post('/login', process.login);
```

`req.body`를 받기 위해서는 별도의 세팅을 해주어야 한다.
`app.js`로 들어가서 세팅해 준다.

`npm i body-parser -s`
```js
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
```

하지만 요즘은 잘 bodyParser를 잘 사용하지 않고 express 내장 모듈을 사용한다. 
```js
app.use(express.json());
```

## 로그인 인증 기능 만들기 
model에서 user 정보를 가져와서 검증 한 후 사용자 정보가 일치한다면 루트 경로로 리다이렉트 혹은, 실패하면 경고창을 띄우는 간단한 인증 기능을 만든다. 

먼저, 컨트롤러에 로그인 코드이다. 
```js
const process = {
	login: (req, res)=> {
		const id = req.body.id,
			password = req.body.password;

		const users = UserStorage.getUsers("id", "password");
		
		const response = {};
		if (users.id.includes(id)) {
			const idx = users.id.indexOf(id);
			if (users.password[idx] === password) {
				response.success = true;
				return res.json(response);
			}
		}

		response.success = false;
		response.msg = "로그인 할 수 없습니다.";
		return res.json(response);
	}
}
```
`res.json(response)`를 반환하는데 반환되는 값은 `Promise`이다. 
`.then` 혹은 `.catch`로 처리해 주어야 한다. 

문서와 연결된 js 파일에서 처리하는 코드이다. 
```js

button.addEventListener('click', () => {
	req = {
		id: id.value,
		password: password.value,
	}

	fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req),
	})
		.then(res=> res.json())
		.then(res => {
			if (res.success) {
				location.href = "/";
			} else {
				alert(res.msg);
			}
		})
		.catch(err=>{
			console.error(err);
		});
})
```
- `.then(res => res.json())` 에서 res.json을 호출함으로서 완전히 로딩 된 이후에 다음 then을 처리한다. 
- `location.href = "/"` 를 통해서 리다이렉트 한다. 

## 모델 분리 
컨트롤러에 모델 관련된 코드가 있으면 유지 보수에 성도 떨어지고 보안에도 문제가 있을 수 있다. 
모델을 분리해 주도록 한다. 

src폴더에 models라는 폴더 를 만들고 UserStorage 클래스를 생성한다.
`src/models/UserStorage.js`
```js
class UserStorage{
	static #users = {
		id: ['koo', 'ja', 'yoon'],
		password: ['123', '456', '789'],
		name: ['구', '자', '윤'],
	}

	static getUsers(...fields) {
		const users = this.#users;
		const newUsers = fields.reduce((newUsers, field) => {
			if (users.hasOwnProperty(field)) {
				newUsers[field] = users[field];
			}
			return newUsers;
		}, {})

		return newUsers;
	}
}

module.exports = UserStorage;
```

- users 는 private 한 속성으로 가져가야 하니까 #을 더해서 private 속성으로 만든다. 
- static 으로 만들어서 인스턴스 생성을 안해도 메서드를 사용할 수 있도록 만든다. 
- users 같은 경우 지금은 메모리에 올렸지만, 후에 db에 있는 정보라고 할 수 있다. 
- getUsers를 사용하여 쿼리 할 수 있도록 만들었다. reduce를 사용하여 구현하였다. 

컨트롤러에서 모델은 다음과 같이 사용한다. 
```js
const users = UserStorage.getUsers("id", "password");
```

