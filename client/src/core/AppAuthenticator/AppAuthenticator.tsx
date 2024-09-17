import { FC, cloneElement, Children, ReactNode, isValidElement } from 'react';

import useAuthentication from '../../hooks/useAuthentication.hooks';

const AppAuthenticator: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const { authState, currentUser } = useAuthentication();

  if (authState === 'loading') {
    return <h1>Loading...</h1>; // update UI
  }

  const childWithAuthProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        authenticated: authState === 'loggedIn', // need to update this one for ts handling
      });
    }
  });

  return childWithAuthProps;
};

export default AppAuthenticator;
