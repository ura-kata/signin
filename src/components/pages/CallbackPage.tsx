import { useLocation } from 'react-router';
import { checkState } from '../../util';
import PageTemplate from '../templates/PageTemplate';

export default function CallbackPage() {
  const location = useLocation();
  const getCodeAndState = (): { code: string; state: string } | undefined => {
    const params = location.search;
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

    if (code && state && checkState(state)) {
      return {
        code: code,
        state: state,
      };
    }
    return undefined;
  };

  return (
    <PageTemplate>
      <div>callback</div>
    </PageTemplate>
  );
}
