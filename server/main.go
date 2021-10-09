package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"strconv"
	"xchat/server/chat"

	"github.com/gorilla/mux"
)

const (
	PORT = 8000
)

//go:embed views
var embeds embed.FS

func main() {
	router := mux.NewRouter().StrictSlash(false)
	chatserver := chat.NewChatServer()

	views, err := fs.Sub(embeds, "views")
	if err != nil {
		panic(err)
	}

	router.HandleFunc("/ws", chatserver.HandleConnection)
	router.PathPrefix("/").Handler(http.FileServer(http.FS(views)))

	logOutbound()

	if err := http.ListenAndServe(":"+strconv.Itoa(PORT), router); err != nil {
		panic(err)
	}
}

func logOutbound() {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	ip := localAddr.IP
	fmt.Printf("Listening on: %s:%d\n", ip.String(), PORT)
}
