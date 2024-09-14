// hooks
import useAuthentication from './hooks/useAuthentication.hooks';

// styles
import 'firebaseui/dist/firebaseui.css';

const App = () => {
  const { authState, currentUser } = useAuthentication();

  if (authState === 'loading') {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (authState === 'loggedIn') {
    return (
      <>
        <h1>Welcome {currentUser?.displayName}</h1>
      </>
    );
  }

  return (
    <>
      <div>Initial Bank Transactions Tracker FE</div>
      <div id='firebaseui-auth-container'></div>
    </>
  );
};

export default App;
