import { Provider } from 'react-redux';

// core components
import { AppRouter, AppAuthenticator } from './core';

import { store } from './integration/store';

// styles
import './app.styles.scss';
import 'firebaseui/dist/firebaseui.css';

const App = () => {
  return (
    <AppAuthenticator>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </AppAuthenticator>
  );
};

export default App;
