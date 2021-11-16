import ChatHandler, { ChatHandlerSIO, ChatHandlerGo } from "./chathandler";
import LoginForm from "./components/login";
import { CircularProgress, Grid } from "@material-ui/core";
import React from "react";
import Chat from "./components/chat";
import { Route, Switch } from "react-router-dom";
import SignupForm from "./components/signup";

export const chathandler: ChatHandler = new ChatHandlerSIO();

interface AppState {
  authenticated: boolean;
  connected: boolean;
}

export class App extends React.Component<{}, AppState> {
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

    return <Chat chathandler={chathandler} />;
  }
}

export default () => (
  <Switch>
    <Route exact path="/" component={App} />
    <Route
      exact
      path="/signup"
      component={() => <SignupForm chathandler={chathandler} />}
    ></Route>
  </Switch>
);
