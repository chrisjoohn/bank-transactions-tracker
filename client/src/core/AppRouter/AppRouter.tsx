import { FC } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../../layouts';

import { Accounts, Tags } from '../../pages';

import AccountDetails from '../../pages/Accounts/AccountDetails';
import AccountsList from '../../pages/Accounts/AccountsList';

const publicRoutes = createBrowserRouter([
  {
    path: '/',
    element: <div id="firebaseui-auth-container"></div>, // this div id is important and is used by firebase
  },
]);

const securedRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Accounts />,
        children: [
          {
            path: '/',
            element: <AccountsList />,
          },
          {
            path: ':id',
            element: <AccountDetails />,
          },
        ],
      },
      {
        path: 'tags',
        element: <Tags />,
      },
      {
        path: 'transactions',
        element: (
          <>
            <h1>Transactions</h1>
          </>
        ),
      },
      {
        path: 'reports',
        element: (
          <>
            <h1>Reports</h1>
          </>
        ),
      },
    ],
  },
]);

const AppRouter: FC<{ authenticated?: boolean }> = (props) => {
  const { authenticated = false } = props;

  return <RouterProvider router={authenticated ? securedRouter : publicRoutes} />;
};

export default AppRouter;
