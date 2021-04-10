import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getToken, setTokenToCookie } from '../../util';
import PageTemplate from '../templates/PageTemplate';

const REACT_APP_APP_URL = process.env.REACT_APP_APP_URL as string;

interface Params {
  code: string;
  state: string;
}

const getCodeAndState = (locationSearch: string): Params | undefined => {
  const params = locationSearch;
  if (params === undefined) return undefined;
  if (params === '') return undefined;
  const list = params.split(/[?]|[&]/);

  let code: string | undefined = undefined;
  let state: string | undefined = undefined;

  list.forEach((l) => {
    if (!code && l.startsWith('code=')) {
      code = l.substring(5);
    } else if (!state && l.startsWith('state=')) {
      state = l.substring(6);
    }
  });

  if (code && state) {
    return {
      code: code,
      state: state,
    };
  }
  return undefined;
};

export default function CallbackPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location) return;
    const params = getCodeAndState(location.search);
    if (!params) {
      window.location.href = '/signin';
      return;
    }

    const f = async () => {
      const token = await getToken(params.code, params.state);
      if (!token) {
        console.log('The token could not be get.');
        window.location.href = '/signin';
        return;
      }

      const accessToken = token.access_token;
      const idToken = token.id_token;
      const refreshToken = token.refresh_token;


      const setCookieSuccess = await setTokenToCookie({
        accessToken: accessToken,
        refreshToken: refreshToken,
        idToken: idToken,
      });
      if (!setCookieSuccess) {
        // TODO Token を Cookie に設定するのを失敗したことをエラーメッセージとして表示する
        console.log('The token could not be set as a cookie.');
        return;
      }

      if (!REACT_APP_APP_URL) {
        console.log('The application URL cannot be found.');
        return;
      }
      // アプリケーションに遷移する
      window.location.href = REACT_APP_APP_URL;
    };
    f();
  }, [location]);

  return (
    <PageTemplate>
      <div>callback</div>
    </PageTemplate>
  );
}
