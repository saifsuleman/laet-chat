import { Button, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Send } from "@material-ui/icons";
import ChatHandler from "../chathandler";

interface Message {
  sender: string;
  content: string;
}

const ChatMessage = (props: Message) => (
  <Typography>
    <b>{props.sender}</b>: {props.content}
  </Typography>
);

interface ChatState {
  input: string;
  messages: JSX.Element[];
}

interface ChatProps {
  chathandler: ChatHandler;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props);

    this.state = { input: "", messages: [] };
  }

  componentDidMount() {
    this.props.chathandler.on("chat-message", this.appendMessage.bind(this));
    this.props.chathandler.on("announcement", this.appendAnnouncement.bind(this));
  }

  private appendMessage(message: Message) {
    let { input, messages } = this.state;
    const { sender, content } = message;
    messages.push(<ChatMessage sender={sender} content={content} />);
    this.setState({ input, messages });
  }

  private appendAnnouncement(content: string) {
    let { input, messages } = this.state;
    messages.push(<Typography><b>{content}</b></Typography>)
    this.setState({ input, messages })
  }

  private setInput(input: string) {
    this.setState({ input, messages: this.state.messages });
  }

  render(): JSX.Element {
    const buttonStyle = {
      width: 80,
      height: 50,
    };

    return (
      <Grid
        container
        direction="column"
        spacing={0}
        alignItems="center"
        justifyContent="center"
      >
        {this.state.messages.map((e, i) => <Grid item key={i}> {e} </Grid>)}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const { input } = this.state;
            this.props.chathandler.sendMessage(input);
            this.setInput("");
          }}
        >
          <Grid item>
            <TextField
              id="outlined-basic"
              label="Message"
              value={this.state.input}
              variant="outlined"
              onChange={(e) => this.setInput(e.target.value)}
            />
            <Button
              variant="contained"
              type="submit"
              color="primary"
              style={buttonStyle}
              endIcon={<Send />}
            >
              Send
            </Button>
          </Grid>
        </form>
      </Grid >
    );
  }
}
