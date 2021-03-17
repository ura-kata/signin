import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import {
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { useState } from 'react';
import SignUpSmallPaper from '../molecules/SignUpSmallPaper';
import PageTemplate from '../templates/PageTemplate';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
  })
);

export default function SignUpPage() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOnSignUpClick = () => {
    const trimUsername = username.trim();
    const trimEmail = email.trim();
    const trimPassword = password.trim();
    const trimConfirmPassword = confirmPassword.trim();

    if (!trimUsername || !trimEmail || !trimPassword || !trimConfirmPassword) {
      console.log('empty input');
      return;
    }
    if (trimPassword !== trimConfirmPassword) {
      console.log('confirm password error');
      // confirm password error.
      return;
    }

    const poolData = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID as string,
      ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID as string,
    };
    const userPool = new CognitoUserPool(poolData);

    const userAttributes: CognitoUserAttribute[] = [];
    const validationData: CognitoUserAttribute[] = [];

    const emailAttribute = {
      Name: 'email',
      Value: email,
    };
    userAttributes.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(
      username,
      password,
      userAttributes,
      validationData,
      (err, result) => {
        console.log('signUp result');
        if (err) {
          console.log(err);
          const anyErr = err as any;
          if (anyErr.code === 'UsernameExistsException') {
            // User already exists.
          } else if (anyErr.code === 'InvalidParameterException') {
            // Invalid email address format.
            // "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6"
          } else {
          }
          return;
        }
        console.log(result);

        // SignUp 処理が正常に終了しても email がすでに登録されている場合は
        // email の検証 URL のアクセスで "An account with the email already exists." とエラーになる
      }
    );
  };

  const handleOnChangeUsername = (username: string) => {
    setUsername(username);
  };
  const handleOnChangeEmail = (email: string) => {
    setEmail(email);
  };
  const handleOnChangePassword = (password: string) => {
    setPassword(password);
  };
  const handleOnChangeConfirmPassword = (confirmPassword: string) => {
    setConfirmPassword(confirmPassword);
  };

  return (
    <PageTemplate>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          <SignUpSmallPaper
            username={username}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            onChangeUsername={handleOnChangeUsername}
            onChangeEmail={handleOnChangeEmail}
            onChangePassword={handleOnChangePassword}
            onChangeConfirmPassword={handleOnChangeConfirmPassword}
            onSignUpClick={handleOnSignUpClick}
          />
        </Grid>
      </Grid>
    </PageTemplate>
  );
}
