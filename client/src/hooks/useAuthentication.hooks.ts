import { useState, useEffect } from 'react';

import * as firebaseui from 'firebaseui';
import {
  getAuth,
  User,
  EmailAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';

type AuthState = 'loggedIn' | 'loggedOut' | 'loading';

const useAuthentication = (): {
  authState: AuthState;
  currentUser: User | null;
} => {
  const [authState, setAuthState] = useState<AuthState>('loading');

  const auth = getAuth();
  useEffect(() => {
    if (authState !== 'loggedOut') {
      return;
    }
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    const authConfig = {
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup',
    };
    ui.start('#firebaseui-auth-container', authConfig);
  }, [authState]);

  useEffect(() => {
    const authListener = auth.onAuthStateChanged((result) => {
      if (result) {
        setAuthState('loggedIn');
      } else {
        setAuthState('loggedOut');
      }
    });

    return () => {
      if (authListener) {
        authListener();
      }
    };
  }, []);
  const currentUser = auth.currentUser;

  return {
    authState,
    currentUser,
  };
};

export default useAuthentication;
