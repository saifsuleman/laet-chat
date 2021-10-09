package auth

func IsUserAuth(username string, password string) bool {
	return username == password
}
