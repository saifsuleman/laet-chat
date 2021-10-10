import auth from "./auth.js"
import { EventEmitter } from "events"

const users = new Map()
const emitter = new EventEmitter()

const init = (socket) => {
	socket.on(`login-request`, async data => {
		const { username, password } = data

		if (!(await auth(username, password))) {
			return socket.emit(`incorrect-password`)
		}

		users.set(socket, username)

		socket.emit(`welcome`, {
			username,
			users: Object.values(users),
			time: ``
		})

		emitter.emit(`user-join`, username)
	})

	socket.on(`chat-message`, content => {
		if (!content || !content.length) return

		const sender = users.get(socket)
		if (sender) {
			const message = { content, sender }
			emitter.emit(`chat-message`, message)
		}
	})

	socket.on(`disconnect`, () => {
		const user = users.get(socket)

		if (user) {
			emitter.emit(`user-leave`, user)
			users.delete(socket)
		}
	})
}

const broadcast = (key, data) => Array.from(users.keys()).forEach(socket => socket.emit(key, data))

emitter.on(`chat-message`, data => broadcast(`chat-message`, data))
emitter.on(`user-join`, user => broadcast(`user-join`, user))
emitter.on(`user-leave`, user => broadcast(`user-leave`, user))

export default { ...emitter, init }
