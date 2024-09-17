import { FC } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const publicRoutes = createBrowserRouter([
  {
    path: '/',
    element: <div id='firebaseui-auth-container'></div>, // this div id is important and is used by firebase
  },
]);

const securedRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <h1>Home</h1>
      </>
    ),
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
]);

const AppRouter: FC<{ authenticated?: boolean }> = (props) => {
  const { authenticated = false } = props;

  return (
    <RouterProvider router={authenticated ? securedRouter : publicRoutes} />
  );
};

export default AppRouter;
