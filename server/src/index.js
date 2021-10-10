import express from "express"
import http from "http"
import { Server } from "socket.io"
import chat from "./chat.js"

const PORT = 3001

const app = express()
app.use(express.static(`../client/build`))

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: `*`,
		methods: [`GET`, `POST`],
	},
})

io.on(`connection`, chat.init)

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

