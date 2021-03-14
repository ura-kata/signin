import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getToken } from '../../util';
import PageTemplate from '../templates/PageTemplate';

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
        window.location.href = '/signin';
        return;
      }
      console.log(token?.access_token);

      // TODO Cookie に Token を設定しアプリケーションに遷移する
    };
    f();
  }, [location]);

  return (
    <PageTemplate>
      <div>callback</div>
    </PageTemplate>
  );
}
