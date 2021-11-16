import auth, { register } from "./auth.js"
import { EventEmitter } from "events"

const users = new Map()
const emitter = new EventEmitter()
const rooms = {
    general: {
        messages: [],
    },
    "not-general": {
        messages: [],
    },
}

const init = (socket) => {
    socket.on(`login-request`, async (data) => {
        const { username, password } = data

        if (!(await auth(username, password))) {
            return socket.emit(`incorrect-password`)
        }

        const room = rooms[0]
        users.set(socket, { username, socket, room })

        socket.emit(`welcome`, {
            username,
            users: Object.values(users),
            rooms,
        })

        emitter.emit(`user-join`, username)
    })

    socket.on("signup-request", async (data) => {
        const { username, password } = data

        const res = await register(username, password)
        if (res) {
            socket.emit("signup-success", { username, password })
        } else {
            console.log(`emitting signup-fail`)
            socket.emit("signup-fail", { username })
        }
    })

    socket.on(`chat-message`, (content) => {
        if (!content || !content.length) return

        const user = users.get(socket)
        if (user) {
            const { username: sender, room } = user
            const message = { content, sender, room }
            emitter.emit(`chat-message`, message)
        }
    })

    socket.on(`disconnect`, () => {
        const user = users.get(socket)

        if (user) {
            const { username } = user
            emitter.emit(`user-leave`, username)
            users.delete(socket)
        }
    })
}

const broadcast = (key, data, room = undefined) => {
    console.log(`sending ${key} to ${room}`)

    let receivers = Array.from(users.keys())
    if (room) {
        receivers = receivers.filter((key) => users.get(key).room == room)
    }
    receivers.forEach((socket) => socket.emit(key, data))
}

emitter.on(`chat-message`, (data) => broadcast(`chat-message`, data, data.room))
emitter.on(`chat-message`, (data) => {
    if (!(data.room in rooms)) return
    rooms[data.room].push({ content: data.content, sender: data.sender })
})
emitter.on(`user-join`, (user) => broadcast(`user-join`, user))
emitter.on(`user-leave`, (user) => broadcast(`user-leave`, user))

export default { ...emitter, init }
