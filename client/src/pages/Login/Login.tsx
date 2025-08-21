import { FC, useEffect } from 'react';

import * as firebaseui from 'firebaseui';
import { getAuth, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';

const Login: FC = () => {
  const auth = getAuth();

  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    const authConfig = {
      signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
      signInFlow: 'popup',
    };
    ui.start('#firebaseui-auth-container', authConfig);
  });

  return <div id="firebaseui-auth-container"></div>;
};

export default Login;
