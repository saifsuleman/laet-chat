import EventEmitter from "events";
import { Socket } from "socket.io";
import AuthenticationHandler from "./authentication";
import User from "./user";

interface IntroductionPacket {
  username: string;
  users: string[];
  time: string;
}

interface LoginPacket {
  username: string;
  password: string;
}

export default class ChatServer extends EventEmitter {
  users: User[];
  auth: AuthenticationHandler;

  constructor() {
    super();

    this.users = [];
    this.auth = new AuthenticationHandler();
  }

  init(socket: Socket) {
    console.log("some mofo connected");

    socket.on("login-request", (data: LoginPacket) => {
      console.log(this.users);

      const { username, password } = data;
      if (!this.auth.isCredentialsValid(username, password)) {
        socket.emit("incorrect-password");
        return;
      }

      console.log(`user joined: ${username}`);
      const user: User = { username, socket };
      this.users.push(user);

      const introduction: IntroductionPacket = {
        username,
        users: this.users.map((u) => u.username),
        time: "",
      };
      socket.emit("welcome", introduction);
      this.emit("user-join", user);
    });
  }
}
