import {
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import ChatHandler from "../chathandler";

const Error = withStyles({
  root: {
    color: "#ff0000",
  },
})(Typography);

interface LoginProps {
  chathandler: ChatHandler;
}

interface LoginState {
  username: string;
  password: string;
  error: string;
}

export default class LoginForm extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
    };
    this.props.chathandler.on("incorrect-password", () => {
      this.setState({
        username: this.state.username,
        password: "",
        error: "Your password is incorrect!",
      });
    });
  }

  render(): JSX.Element {
    const paperStyle = {
      padding: 50,
      height: 320,
      width: 320,
      margin: "20px auto",
    };

    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper elevation={10} style={paperStyle}>
          <Grid
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            style={{ minHeight: "35" }}
          >
            <h2>LAET Chat - Sign In</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const { username, password } = this.state;
                this.props.chathandler.requestLogin(username, password);
              }}
            >
              <TextField
                label="Username"
                value={this.state.username}
                onChange={(e) =>
                  this.setState({
                    username: e.target.value,
                    password: this.state.password,
                    error: "",
                  })
                }
                fullWidth
                required
              ></TextField>
              <TextField
                label="Password"
                type="password"
                value={this.state.password}
                onChange={(e) =>
                  this.setState({
                    username: this.state.username,
                    password: e.target.value,
                    error: "",
                  })
                }
                fullWidth
                required
              ></TextField>

              <FormControlLabel
                control={<Checkbox name="checkedB" color="primary" />}
                label="Remember me"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Sign In
              </Button>

              {this.state.error ? <Error>{this.state.error}</Error> : <></>}
            </form>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}
