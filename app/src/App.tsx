import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CallbackPage from './components/pages/CallbackPage';
import SignInPage from './components/pages/SignInPage';
import SignUpPage from './components/pages/SignUpPage';
import ValidationCodePage from './components/pages/ValidationCodePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" component={SignUpPage} />
        <Route path="/callback" component={CallbackPage} />
        <Route path="/validation-code" component={ValidationCodePage} />
        <Route path={['/', '/signin']} component={SignInPage} />
      </Switch>
    </Router>
  );
}

export default App;
