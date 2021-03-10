import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from '@material-ui/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../templates/PageTemplate';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      height: '300px',
      width: '300px',
    },
    fieldItem: {
      textAlign: 'center',
    },
  })
);

export default function SignInPage() {
  const classes = useStyles();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleOnUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
  };
  const handleOnPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
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
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Paper className={classes.paper}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.fieldItem}>
                  <TextField
                    label="user"
                    value={user}
                    onChange={handleOnUserChange}
                  />
                </Grid>
                <Grid item xs={12} className={classes.fieldItem}>
                  <TextField
                    label="password"
                    type="password"
                    value={password}
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
          </Paper>
        </Grid>
      </Grid>
    </PageTemplate>
  );
}
