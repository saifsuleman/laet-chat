import mongo from "mongodb"
import crypto from "crypto"

const DATABASE_URL = `mongodb://127.0.0.1:27017/`

let database

mongo.MongoClient.connect(DATABASE_URL, (err, db) => {
	if (err) throw err
	database = db.db(`auth-db`)
})

const generateSalt = rounds => crypto.randomBytes(Math.ceil(rounds/2)).toString(`hex`).slice(0, rounds)

const hash = (password, salt) => {
	const h = crypto.createHmac(`sha512`, salt)
	h.update(password)
	const val = h.digest(`hex`)
	return { hash: val, salt }
}

const register = async (username, password) => new Promise(r => {
	const { hash: hashed, salt } = hash(password, generateSalt(12))

	const entry = { _id: username, hash: hashed, salt }

	database.collection(`logins`).insertOne(entry, err => {
		if (err) throw err
		return r(err == null)
	})
})

const login = async (username, password) => new Promise(r => {
	if (!database) return r(false)

	database.collection(`logins`).findOne({ _id: username }, (err, res) => {
		if (!res || err) return r(false)
		return r(res.hash === hash(password, res.salt).hash)
	})
})

export { register }
export default login
