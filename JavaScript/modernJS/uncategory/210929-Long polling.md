# Long polling

Long polling 은 WebSocket 또는 Server Side Event와 같은 특정 프로토콜을 사용하지 않고 서버와 지속적으로 연결하는 가장 간단한 방법이다.

## Reqular Polling

서버에서 새로운 정보를 얻는 가장 간단한 방법은 주기적인 요청이다. 예를 들어 새로운 정보를 얻기 위해 10초 간격으로 서버에 "새로운 정보 있나요?" 요청을 보내는 것과 같다.

서버는 이에대한 응답으로 클라이언트를 확인하고 패킷을 보낸다. 정상적으로 작동하지만 다음과 같은 문제가 있다.

1. 메시지는 최대 10초 지연으로 전달 된다.
2. 서버는 사용자의 유무나 메세지가 없더라도 계속해서 요청을 받는다. 이는 성능 부하를 일으킨다.

개선해 보자.

## Long polling

Long polling은 구현하기도 쉽고 지연 없이 메세지를 전달한다.

1. 요청이 서버로 전송된다.
2. 서버는 보낼 메세지가 있을 때까지 연결을 닫지 않는다.
3. 메세지가 나타나면 서버는 요청에 응답한다.
4. 브라우저는 즉시 새 요청을 만든다.

보통 요청은 보내지면 바로 응답을 받는다. 그런데 Long polling은 서버가 요청을 받고 대기하고 있다고 전달할 메세지가 있다는 이벤트가 발생하면 그때 응답한다. 따라서 연결을 유지할 수 있게 되는 것이다.

<img src="images/210929-Long polling/1.png" width="500">

네트워크 오류로 인해 연결이 끊어지면 브라우저는 즉시 새 요청을 보낸다.

긴 요청을 만드는 클라이언트에 `subscribe` 함수 예제:

```js
async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // Status 502 is a connection timeout error,
    // may happen when the connection was pending for too long,
    // and the remote server or a proxy closed it
    // let's reconnect
    await subscribe();
  } else if (response.status != 200) {
    // An error - let's show it
    showMessage(response.statusText);
    // Reconnect in one second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await subscribe();
  } else {
    // Get and show the message
    let message = await response.text();
    showMessage(message);
    // Call subscribe() again to get the next message
    await subscribe();
  }
}

subscribe();
```

요즘은 web push 와 같은 기능을 사용할 수 있기 때문에, 실시간이 중요한 서비스에서는 web push 기능을 사용하는것이 바람직하다.
