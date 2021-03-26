import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import PageTemplate from '../templates/PageTemplate';

interface Params {
  userName: string;
  confirmationCode: string;
}

type ValidationState = 'validating' | 'done';

const getUrlParams = (locationSearch: string): Params | undefined => {
  const params = locationSearch;
  if (params === undefined) return undefined;
  if (params === '') return undefined;
  const list = params.split(/[?]|[&]/);

  let userName: string | undefined = undefined;
  let confirmationCode: string | undefined = undefined;

  list.forEach((l) => {
    if (!userName && l.startsWith('user_name=')) {
      userName = l.substring(10);
    } else if (!confirmationCode && l.startsWith('confirmation_code=')) {
      confirmationCode = l.substring(18);
    }
  });

  if (userName && confirmationCode) {
    return {
      userName: userName,
      confirmationCode: confirmationCode,
    };
  }
  return undefined;
};

export default function ValidationCodePage() {
  const [validationState, setValidationState] = useState<ValidationState>(
    'validating'
  );
  const [validationMessage, setValidationMessage] = useState('');
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (validationState !== 'done') {
      return;
    }

    const timerId = setTimeout(() => {
      window.location.href = '/signin';
    }, 2000);
    return () => clearTimeout(timerId);
  }, [validationState]);

  useEffect(() => {
    if (!location) return;
    const params = getUrlParams(location.search);
    if (!params) {
      setValidationErrorMessage('検証に失敗しました');
      setValidationState('done');
      return;
    }

    const poolData = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID as string,
      ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID as string,
    };
    const userPool = new CognitoUserPool(poolData);

    const userData = {
      Username: params.userName,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(
      params.confirmationCode,
      true,
      (err, result) => {
        console.log('confirm registration done.');
        console.log(result);
        if (err) {
          console.log(err);
          setValidationErrorMessage('検証に失敗しました');
          setValidationState('done');
          return;
        }

        setValidationMessage('検証に成功しました');
        setValidationState('done');
      }
    );
  }, [location]);

  return (
    <PageTemplate>
      <div>
        {validationMessage ? <p>{validationMessage}</p> : undefined}
        {validationErrorMessage ? <p>{validationErrorMessage}</p> : undefined}
      </div>
    </PageTemplate>
  );
}
