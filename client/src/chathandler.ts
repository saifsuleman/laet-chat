import { EventEmitter } from "events";
import io, { Socket } from "socket.io-client";

interface IntroductionPacket {
  username: string;
  users: string[];
  time: string;
}

interface ChatState {
  username: string;
  users: string[];
}

interface MessagePacket {
  sender: string;
  content: string;
}

export default interface IChatHandler extends EventEmitter {
  get state(): ChatState | undefined;
  set state(v: ChatState | undefined);
  get connected(): boolean;
  get authenticated(): boolean;

  requestLogin(username: string, password: string): void;
  sendMessage(content: string): void;
}

export class ChatHandlerGo extends EventEmitter implements IChatHandler {
  private socket: WebSocket;
  private _state: ChatState | undefined;

  public get state(): ChatState | undefined {
    return this._state;
  }

  private set state(v: ChatState | undefined) {
    this._state = v;
  }

  public get authenticated(): boolean {
    return this.state !== undefined;
  }

  public get connected(): boolean {
    return this.socket && this.socket.readyState == this.socket.OPEN;
  }

  constructor() {
    super();

    this.socket = new WebSocket(`ws://${window.location.host}/ws`);

    const reload = () => this.emit("reload");

    this.socket.onopen = reload;
    this.socket.onclose = reload;

    this.socket.onmessage = (message) => {
      const data = JSON.parse(message["data"]);
      console.log(`received ${JSON.stringify(data)}`);
      if (data.type) this.emit(data.type, data.data);
    };

    this.on("welcome", (data: IntroductionPacket) => {
      this._state = data;
      reload();
    });

    this.on("user-join", (data: any) => {
      const { user } = data;
      this.emit("announcement", `${user} has joined the chat!`);

      this.state?.users.push(user);
      this.emit("reload");
    });

    this.on("user-leave", (data: any) => {
      const { user } = data;
      this.emit("announcement", `${user} has left the chat!`);

      if (!this.state) return;

      this.state.users = this.state?.users.filter((u) => u !== user);
      this.emit("reload");
    });
  }

  send(type: string, data?: object) {
    const packet = { type, data };
    this.socket.send(JSON.stringify(packet));
  }

  requestLogin(username: string, password: string) {
    this.send("login-request", { username, password });
  }

  sendMessage(content: string) {
    this.send("chat-message", { content });
  }
}

export class ChatHandlerSIO extends EventEmitter implements IChatHandler {
  private socket: Socket;
  private _state: ChatState | undefined;

  public get state(): ChatState | undefined {
    return this._state;
  }

  private set state(v: ChatState | undefined) {
    this._state = v;
  }

  public get connected(): boolean {
    return this.socket && this.socket.active;
  }

  public get authenticated(): boolean {
    return this.state !== undefined;
  }

  constructor() {
    super();

    this.socket = io(`http://${window.location.host.split(":")[0]}:3001`);

    this.socket.on("connect", () => this.emit("reload"));
    this.socket.on("disconnect", () => this.emit("reload"));

    this.socket.on("welcome", (data: IntroductionPacket) => {
      this.state = data;
      this.emit("reload");
    });

    this.socket.on("incorrect-password", () => this.emit("incorrect-password"));

    this.socket.on("chat-message", (data: MessagePacket) => {
      if (this.state) this.emit("chat-message", data);
    });

    this.socket.on("user-join", (user: string) => {
      this.emit("announcement", `${user} has joined the chat!`);

      this.state?.users.push(user);
      this.emit("reload");
    });

    this.socket.on("user-leave", (user: string) => {
      this.emit("announcement", `${user} has left the chat!`);

      if (!this.state) return;

      this.state.users = this.state?.users.filter((u) => u !== user);
      this.emit("reload");
    });
  }

  requestLogin(username: string, password: string) {
    this.socket.emit("login-request", { username, password });
  }

  sendMessage(content: string) {
    this.socket.emit("chat-message", content);
  }
}
