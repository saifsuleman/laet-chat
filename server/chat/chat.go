package chat

import (
	"net/http"

	"xchat/server/auth"

	"github.com/gorilla/websocket"
)

type ChatServer struct {
	connections  map[*websocket.Conn]string
	upgrader     websocket.Upgrader
	killChannels map[*websocket.Conn]chan bool
}

type DataPacket struct {
	Kill bool
	Data map[string]interface{}
}

type MessagePacket struct {
	Sender  string `json:"sender"`
	Content string `json:"content"`
}

type WelcomePacket struct {
	Username string   `json:"username"`
	Users    []string `json:"users"`
}

func (cs *ChatServer) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := cs.upgrader.Upgrade(w, r, nil)

	if err != nil {
		panic(err)
	}

	killChannel := make(chan bool)
	cs.killChannels[conn] = killChannel

	defer conn.Close()
	defer delete(cs.connections, conn)
	defer delete(cs.killChannels, conn)

	for {
		alive := true
		ch := make(chan DataPacket)

		go func() {
			var p map[string]interface{}
			if err := conn.ReadJSON(&p); err != nil && alive {
				// TODO: broadcast die/leave
				ch <- DataPacket{true, nil}
				username, has := cs.connections[conn]
				if has {
					cs.BroadcastLeave(username)
				}
			} else if alive {
				ch <- DataPacket{false, p}
			}
		}()

		go func() {
			if <-killChannel {
				ch <- DataPacket{true, nil}
				username, has := cs.connections[conn]
				if has {
					cs.BroadcastKick(username)
				}
			}
		}()

		p := <-ch
		if p.Kill {
			alive = false
			break
		}

		packet := p.Data

		typ, ok := packet["type"].(string)
		if !ok {
			continue
		}

		data := packet["data"].(map[string]interface{})

		switch typ {
		case "chat-message":
			username, has := cs.connections[conn]
			content, ok := data["content"].(string)
			if ok && has {
				cs.BroadcastMessage(username, content)
			}
		case "login-request":
			username, has := data["username"].(string)
			if !has {
				continue
			}
			password, has := data["password"].(string)
			if !has {
				continue
			}

			if auth.IsUserAuth(username, password) {
				users := []string{}

				for _, username := range cs.connections {
					users = append(users, username)
				}

				packet := WelcomePacket{
					Username: username,
					Users:    users,
				}

				cs.Write(conn, "welcome", packet)
				cs.connections[conn] = username
				cs.BroadcastJoin(username)
			} else {
				cs.WriteNaked(conn, "incorrect-password")
			}
		}
	}
}

func (cs *ChatServer) BroadcastJoin(username string) {
	type JoinPacket struct {
		User string `json:"user"`
	}

	p := JoinPacket{username}
	cs.BroadcastPacket("user-join", p)
}

func (cs *ChatServer) BroadcastLeave(username string) {
	type LeavePacket struct {
		User string `json:"user"`
	}

	p := LeavePacket{username}
	cs.BroadcastPacket("user-leave", p)
}

func (cs *ChatServer) BroadcastKick(username string) {
	type KickPacket struct {
		User string `json:"user"`
	}

	p := KickPacket{username}
	cs.BroadcastPacket("user-kick", p)
}

func (cs *ChatServer) BroadcastMessage(sender string, content string) {
	p := MessagePacket{
		Sender:  sender,
		Content: content,
	}

	cs.BroadcastPacket("chat-message", p)
}

func (cs *ChatServer) BroadcastPacket(id string, v interface{}) {
	for conn := range cs.connections {
		if !cs.Write(conn, id, v) {
			continue
			// TODO remove user
		}
	}
}

func (cs *ChatServer) Write(conn *websocket.Conn, id string, v interface{}) bool {
	type Packet struct {
		Type string      `json:"type"`
		Data interface{} `json:"data"`
	}

	return conn.WriteJSON(Packet{id, v}) == nil
}

func (cs *ChatServer) WriteNaked(conn *websocket.Conn, id string) bool {
	type NakedPacket struct {
		Type string `json:"type"`
	}

	return conn.WriteJSON(NakedPacket{id}) == nil
}

func HasKeys(v map[string]interface{}, keys ...string) bool {
	for _, key := range keys {
		_, ok := v[key]
		if !ok {
			return false
		}
	}
	return true
}

func NewChatServer() ChatServer {
	return ChatServer{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(*http.Request) bool {
				return true
			},
		},
		connections:  make(map[*websocket.Conn]string),
		killChannels: make(map[*websocket.Conn]chan bool),
	}
}
