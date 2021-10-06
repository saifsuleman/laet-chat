import ChatHandler from "./chathandler";
import LoginForm from "./components/login";
import { CircularProgress, Grid } from "@material-ui/core";
import React from "react";

const chathandler = new ChatHandler();

interface AppState {
  authenticated: boolean;
  connected: boolean;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = { authenticated: false, connected: false };
  }

  componentDidMount() {
    chathandler.on("reload", this.reload.bind(this));
  }

  reload() {
    const { authenticated, connected } = chathandler;
    this.setState({ authenticated, connected });
  }

  render(): JSX.Element {
    if (!this.state.connected) {
      return (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={0}
          direction="column"
          style={{ minHeight: "100vh" }}
        >
          <CircularProgress />
        </Grid>
      );
    }

    if (!this.state.authenticated) {
      return <LoginForm chathandler={chathandler} />;
    }

    if (this.state.authenticated) return <h1>Connected!</h1>;
    return <h1>dont know whats here</h1>;
  }
}
