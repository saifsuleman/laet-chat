import React from "react";
import ChatHandler from "../chathandler";
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

interface LoginProps {
  chathandler: ChatHandler;
}

interface LoginState {
  username: string;
  password: string;
  footer: JSX.Element;
}

const Error = withStyles({
  root: {
    color: "#ff0000",
  },
})(Typography);

const Success = withStyles({
  root: {
    color: "#00ff00",
  },
})(Typography);

export default class SignupForm extends React.Component<
  LoginProps,
  LoginState
> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      footer: <></>,
    };
  }
  componentDidMount() {
    this.props.chathandler.on("signup-fail", () => {
      this.setState({
        username: this.state.username,
        password: "",
        footer: <Error>There is already a user with that name!</Error>,
      });
    });

    this.props.chathandler.on(`signup-success`, (data) => {
      const { username } = data;
      this.setState({
        username: "",
        password: "",
        footer: <Success>User {username} successfully created!</Success>,
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
          <h2>LAET Chat - Sign Up</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { username, password } = this.state;
              this.props.chathandler.requestSignup(username, password);
            }}
          >
            <TextField
              label="Username"
              value={this.state.username}
              onChange={(e) =>
                this.setState({
                  username: e.target.value,
                  password: this.state.password,
                  footer: <></>,
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
                  footer: <></>,
                })
              }
              fullWidth
              required
            ></TextField>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign In
            </Button>{" "}
            {this.state.footer}
          </form>
        </Paper>
      </Grid>
    );
  }
}
