import {
  Button,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import GoogleSignInButton from '../atoms/GoogleSignInButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
    paper: {
      height: '300px',
      width: '550px',
    },
    googleSignInRoot: {
      padding: '5px',
      marginTop: '5px',
      marginBottom: '5px',
    },
    cognitoSignInRoot: {
      marginTop: '5px',
      marginBottom: '5px',
    },
    fieldItem: {
      textAlign: 'center',
    },
  })
);

export interface SignInLargePaperProps {
  username: string;
  password: string;
  onChangeUsername?: (username: string) => void;
  onChangePassword?: (password: string) => void;
  onSignInClick?: () => void;
}

export default function SignInLargePaper(props: SignInLargePaperProps) {
  const _username = props.username;
  const _password = props.password;
  const _onChangeUsername = props.onChangeUsername;
  const _onChangePassword = props.onChangePassword;
  const _onSignInClick = props.onSignInClick;

  const handleOnUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (_onChangeUsername) _onChangeUsername(event.target.value ?? '');
  };
  const handleOnPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (_onChangePassword) _onChangePassword(event.target.value ?? '');
  };

  const handleOnSignInClick = () => {
    if (_onSignInClick) _onSignInClick();
  };

  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={5}>
          <Grid
            container
            direction="column"
            spacing={1}
            className={classes.googleSignInRoot}
          >
            <Grid item>
              <Typography>Google アカウントでログインする</Typography>
            </Grid>
            <Grid item>
              <GoogleSignInButton />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <Divider variant="middle" orientation="vertical" flexItem />
        </Grid>
        <Grid item xs={5}>
          <form>
            <Grid container spacing={2} className={classes.cognitoSignInRoot}>
              <Grid item xs={12} className={classes.fieldItem}>
                <TextField
                  label="user"
                  value={_username}
                  onChange={handleOnUserChange}
                />
              </Grid>
              <Grid item xs={12} className={classes.fieldItem}>
                <TextField
                  label="password"
                  type="password"
                  value={_password}
                  onChange={handleOnPasswordChange}
                />
              </Grid>
              <Grid item xs={12} className={classes.fieldItem}>
                <Grid container>
                  <Grid item xs={6}>
                    <Button onClick={handleOnSignInClick}>SignIn</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button component={Link} to="/signup">
                      SignUp
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
}
