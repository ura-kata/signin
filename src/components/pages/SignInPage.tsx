import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { useState } from 'react';
import SignInLargePaper from '../molecules/SignInLargePaper';
import SignInSmallPaper from '../molecules/SignInSmallPaper';
import PageTemplate from '../templates/PageTemplate';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
  })
);

export default function SignInPage() {
  const classes = useStyles();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const handleOnChangeUsername = (username: string) => {
    setUser(username);
  };
  const handleOnChangePassword = (password: string) => {
    setPassword(password);
  };

  const handleOnSignInClick = () => {
    console.log(process.env.REACT_APP_COGNITO_USER_POOL_ID);
    const authenticationData = {
      Username: user,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID as string,
      ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID as string,
    };
    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: user,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        console.log(accessToken);
        console.log(idToken);
        console.log(refreshToken);
      },
      onFailure: (err) => {
        console.log(err);
      },
    });
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
          {matches ? (
            <SignInLargePaper
              username={user}
              password={password}
              onChangeUsername={handleOnChangeUsername}
              onChangePassword={handleOnChangePassword}
              onSignInClick={handleOnSignInClick}
            />
          ) : (
            <SignInSmallPaper
              username={user}
              password={password}
              onChangeUsername={handleOnChangeUsername}
              onChangePassword={handleOnChangePassword}
              onSignInClick={handleOnSignInClick}
            />
          )}
        </Grid>
      </Grid>
    </PageTemplate>
  );
}
