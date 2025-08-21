import { useState, useEffect } from 'react';

import { getAuth, User } from 'firebase/auth';

type AuthState = 'loggedIn' | 'loggedOut' | 'loading';

const useAuthentication = (): {
  authState: AuthState;
  currentUser: User | null;
} => {
  const [authState, setAuthState] = useState<AuthState>('loading');

  const auth = getAuth();

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
