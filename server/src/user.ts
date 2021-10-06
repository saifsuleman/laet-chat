import { Socket } from "socket.io";

export default interface User {
  username: string;
  socket: Socket;
}
