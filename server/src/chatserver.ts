import EventEmitter from "events";
import { Socket } from "socket.io";
import AuthenticationHandler from "./authentication";
import Message from "./chatmessage";
import User from "./user";

interface LoginPacket {
  username: string;
  password: string;
}

export default class ChatServer extends EventEmitter {
  users: Map<Socket, User>;
  auth: AuthenticationHandler;

  constructor() {
    super();

    this.users = new Map();
    this.auth = new AuthenticationHandler();

    this.on("user-join", (user: User) =>
      console.log(`welcome ${user.username}`)
    );

    this.on("user-leave", (user: User) =>
      console.log(`goodbye ${user.username}`)
    );

    this.on("chat-message", (data: Message) => {
      const { sender, content } = data;
      console.log(`${sender}: ${content}`);
      Array.from(this.users.keys()).forEach((socket) =>
        socket.emit("chat-message", data)
      );
    });
  }

  init(socket: Socket) {
    socket.on("login-request", (data: LoginPacket) => {
      const { username, password } = data;
      if (!this.auth.isCredentialsValid(username, password)) {
        socket.emit("incorrect-password");
        return;
      }

      const user: User = { username, socket };
      this.users.set(socket, user);

      socket.emit("welcome", {
        username,
        users: Object.values(this.users).map((u) => u.username),
        time: "",
      });
      this.emit("user-join", user);
    });

    socket.on("chat-message", (content: string) => {
      if (!content || !content.length) return;

      const user = this.users.get(socket);

      if (user) {
        const message: Message = {
          content,
          sender: user.username,
        };
        this.emit("chat-message", message);
      }
    });

    socket.on("disconnect", () => {
      const user = this.users.get(socket);

      if (user) {
        this.emit("user-leave", user);
        this.users.delete(socket);
      }
    });
  }
}
