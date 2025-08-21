import { FC, ReactNode } from 'react';

import { Spin } from 'antd';

// hooks
import useAuthentication from './appAuthenticator.hooks';

// context
import { AuthContext } from './auth.context';

const AppAuthenticator: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const { authState } = useAuthentication();

  if (authState === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large"></Spin>
      </div>
    );
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
