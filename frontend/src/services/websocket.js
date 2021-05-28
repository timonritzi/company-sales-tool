// const API_PATH = 'ws://127.0.0.1:8000/wss/chat/'

const API_PATH = 'wss://live.auto-zuerisee.ch/wss/chat/'

//change API path


class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
  setUsername(userName, seller) {
    this.userName = userName
    this.roomName = userName
    this.seller = seller
  }
  // setRoomname(roomName) { ----> is needed for room
  //   this.roomName = roomName
  // }
  constructor() {
    this.userName = "";
    this.socketRef = "";
    this.roomName = "";
    this.userEmail = "";
    this.seller = "";
  }


  connect() {
    //console.log(encodeURIComponent(`timon.pascal@gmail.com`))
    //console.log(this.roomName)
    // console.log("Websocket.js 101")
    // const path = API_PATH + this.seller + '/' + encodeURIComponent(this.roomName) + '/';
    const tmpRoomName = this.roomName.replace(/[^0-9a-z]/gi, '')
    const path = API_PATH + this.seller + '/' + tmpRoomName + '/';

    // console.log(path)
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      // console.log('WebSocket open');
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      // console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      this.callbacks[command](parsedData.message);
    }
    if (command === 'file_message') {
      this.callbacks[command](parsedData.message)
    }
  }

  initChatUser(username) {
    this.sendMessage({ command: 'init_chat', username: username});
  }

  // fetchMessages(username) {
  //   this.sendMessage({ command: 'fetch_messages', username: username });
  // }

  newChatMessage(message) {
    this.sendMessage({ command: 'new_message', from: message.from, text: message.text });
  }
  newFileMessage(files) {
    this.sendMessage({command: "file_message", files: files });
  }

  addCallbacks(messagesCallback, newMessageCallback, newFileMessage) {
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;
    this.callbacks['file_message'] = newFileMessage;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
    catch(err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }

   waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          // console.log("Connection is made")
          if(callback != null){
            callback();
          }
          return;

        } else {
          // console.log("wait for connection...")
          recursion(callback);
        }
      }, 1); // wait 5 milisecond for the connection...
  }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
