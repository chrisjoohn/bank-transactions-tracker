import { FC, useContext } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// context
import { AuthContext } from '../AppAuthenticator/auth.context';

// layouts
import { MainLayout } from '../../layouts';

// pages
import { Accounts, Tags, Transactions } from '../../pages';

import AccountDetails from '../../pages/Accounts/AccountDetails';
import AccountsList from '../../pages/Accounts/AccountsList';

import TransactionDetails from '../../pages/Transactions/TransactionDetails';

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
        element: <Transactions />,
        children: [
          {
            path: ':accountId/:transactionId',
            element: <TransactionDetails />,
          },
        ],
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

const AppRouter: FC = () => {
  const { authenticated } = useContext(AuthContext);

  return <RouterProvider router={authenticated ? securedRouter : publicRoutes} />;
};

export default AppRouter;
