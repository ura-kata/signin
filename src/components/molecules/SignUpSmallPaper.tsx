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
      height: '420px',
      width: '300px',
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

export interface SignUpSmallPaperProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  onChangeUsername?: (username: string) => void;
  onChangeEmail?: (email: string) => void;
  onChangePassword?: (password: string) => void;
  onChangeConfirmPassword?: (password: string) => void;
  onSignUpClick?: () => void;
}

export default function SignUpSmallPaper(props: SignUpSmallPaperProps) {
  const _username = props.username;
  const _email = props.email;
  const _password = props.password;
  const _confirmPassword = props.confirmPassword;
  const _onChangeUsername = props.onChangeUsername;
  const _onChangeEmail = props.onChangeEmail;
  const _onChangePassword = props.onChangePassword;
  const _onChangeConfirmPassword = props.onChangeConfirmPassword;
  const _onSignUpClick = props.onSignUpClick;

  const trimUsername = _username.trim();
  const usernameErrorMessage = trimUsername
    ? /^[^\s]{1,128}$/.test(trimUsername)
      ? undefined
      : 'ユーザー名が長すぎます'
    : undefined;

  const trimEmail = _email.trim();
  const emailErrorMessage = trimEmail
    ? /^[^\s]{1,2048}$/.test(trimEmail) && /[^\s]+@[^\s]+/.test(trimEmail)
      ? undefined
      : 'メールアドレスが不適切です'
    : undefined;

  const trimPassword = _password.trim();
  const passwordErrorMessage = trimPassword
    ? /^[^\s]{1,256}$/.test(trimPassword)
      ? undefined
      : 'パスワードが長すぎます'
    : undefined;

  const trimConfirmPassword = _confirmPassword.trim();
  const confirmPasswordErrorMessage = trimConfirmPassword
    ? trimConfirmPassword === trimPassword
      ? undefined
      : 'パスワードが異なります'
    : undefined;

  const disabledSginButton =
    trimUsername &&
    trimEmail &&
    trimPassword &&
    trimConfirmPassword &&
    !usernameErrorMessage &&
    !emailErrorMessage &&
    !passwordErrorMessage &&
    !confirmPasswordErrorMessage
      ? false
      : true;

  const handleOnUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (_onChangeUsername) _onChangeUsername(event.target.value ?? '');
  };
  const handleOnEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (_onChangeEmail) _onChangeEmail(event.target.value ?? '');
  };
  const handleOnPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (_onChangePassword) _onChangePassword(event.target.value ?? '');
  };
  const handleOnConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (_onChangeConfirmPassword)
      _onChangeConfirmPassword(event.target.value ?? '');
  };

  const handleOnSignUpClick = () => {
    if (_onSignUpClick) _onSignUpClick();
  };

  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Grid
        container
        direction="column"
        spacing={1}
        className={classes.googleSignInRoot}
      >
        <Grid item>
          <Typography>Google アカウントで SignUp する</Typography>
        </Grid>
        <Grid item>
          <GoogleSignInButton />
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <form>
        <Grid container spacing={2} className={classes.cognitoSignInRoot}>
          <Grid item xs={12} className={classes.fieldItem}>
            <TextField
              label="user"
              value={_username}
              onChange={handleOnUserChange}
              error={usernameErrorMessage ? true : false}
              helperText={usernameErrorMessage}
            />
          </Grid>
          <Grid item xs={12} className={classes.fieldItem}>
            <TextField
              label="e-mail"
              value={_email}
              onChange={handleOnEmailChange}
              error={emailErrorMessage ? true : false}
              helperText={emailErrorMessage}
            />
          </Grid>
          <Grid item xs={12} className={classes.fieldItem}>
            <TextField
              label="password"
              type="password"
              value={_password}
              onChange={handleOnPasswordChange}
              error={passwordErrorMessage ? true : false}
              helperText={passwordErrorMessage}
            />
          </Grid>
          <Grid item xs={12} className={classes.fieldItem}>
            <TextField
              label="confirm password"
              type="password"
              value={_confirmPassword}
              onChange={handleOnConfirmPasswordChange}
              error={confirmPasswordErrorMessage ? true : false}
              helperText={confirmPasswordErrorMessage}
            />
          </Grid>
          <Grid item xs={12} className={classes.fieldItem}>
            <Grid container>
              <Grid item xs={6}>
                <Button component={Link} to="/signin">
                  SignIn
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  disabled={disabledSginButton}
                  onClick={handleOnSignUpClick}
                >
                  SignUp
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
