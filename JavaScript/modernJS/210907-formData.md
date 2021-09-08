# FormData

HTML에 formData를 나타내는 생성자는 다음과 같다.

```js
let formData = new FormData([form]);
```

이렇게 생성해서 서버에서 보내는 작업을 하면 서버에서 볼 때 일반적인 양식 제출처럼 보인다.

## Sending a simple form

```html
<form id="formElem">
  <input type="text" name="name" value="John" />
  <input type="text" name="surname" value="Smith" />
  <input type="submit" />
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch("/article/formdata/post/user", {
      method: "POST",
      body: new FormData(formElem),
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

서버 코드는 여기에 없다. 서버는 위에 코드에서 보낸 request를 받아서 응답한다.

## FormData Methods

- `formData.append(name, value)` - form data에 name과 value를 추가
- `formData.append(name, blob, fileName)` - `<input type="file">` 인 것처럼 추가, 세번째 매개변수인 `fileName`인 진짜 파일 이름을 넣어줌.
- `formData.delete(name)` - `name`이란 이름으로 추가된 필드를 제거함
- `formData.get(name)` - `name`이란 이름으로 추가된 필드에 `value` 값을 얻음.
- `formData.has(name)` - `name`이란 이름으로 추가된 필드가 있다면 ,`true` 반환 아닐 경우 `false` 반환

formData는 기술적으로 같은 name에 필드를 추가할 수 있다. 따라서 append를 사용한다. 비슷한 역할을 하는 `.set` 메서드도 있다. 이 경우 기존에 있던것을 삭제 하고 추가한다.

- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

또한 `for..of` 를 사용해서 요소를 반복할 수 있다.

## Sending a form with a file

form은 `Content-Type: multipart/form-data`로 보내지고 이것은 파일도 보낼 수 있다.

```html
<form id="formElem">
  <input type="text" name="firstName" value="John" />
  Picture: <input type="file" name="picture" accept="image/*" />
  <input type="submit" />
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch("/article/formdata/post/user-avatar", {
      method: "POST",
      body: new FormData(formElem),
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

## Sending a form with Blob data

동적으로 생성된 바이너리 데이타 이미지 같은 것을 `Blob`으로 보낼 수 있다. `fetch`에 `body` 파라미터로 넒길 수 있다.
그러나 실제로는 이미지를 별도로 보내는 것이 아니라 name 을 추가한 form 으로 보내는 것이 편리한 경우가 많다.

서버도 form으로 받는게 더 어울린다.

```html
<body style="margin:0">
  <canvas
    id="canvasElem"
    width="100"
    height="80"
    style="border:1px solid"
  ></canvas>

  <input type="button" value="Submit" onclick="submit()" />

  <script>
    canvasElem.onmousemove = function (e) {
      let ctx = canvasElem.getContext("2d");
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let imageBlob = await new Promise((resolve) =>
        canvasElem.toBlob(resolve, "image/png")
      );

      let formData = new FormData();
      formData.append("firstName", "John");
      formData.append("image", imageBlob, "image.png");

      let response = await fetch("/article/formdata/post/image-form", {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      alert(result.message);
    }
  </script>
</body>
```

이미지 blob 데이터를 어떻게 추가했는지 보자.

```js
formData.append("image", imageBlob, "image.png");
```

이는 `<input type="file" name="image">`와 같다.
