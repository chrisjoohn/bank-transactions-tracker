// core components
import { AppRouter, AppAuthenticator } from './core';

// styles
import './app.styles.scss';
import 'firebaseui/dist/firebaseui.css';

const App = () => {
  return (
    <AppAuthenticator>
      <AppRouter />
    </AppAuthenticator>
  );
};

export default App;
