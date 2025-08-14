import { FC, ReactNode } from 'react';

// hooks
import useAuthentication from './appAuthenticator.hooks';

// context
import { AuthContext } from './auth.context';

const AppAuthenticator: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const { authState } = useAuthentication();

  if (authState === 'loading') {
    return <h1>Loading...</h1>; // update UI
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated: authState === 'loggedIn',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AppAuthenticator;
