import { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import { title } from './util/title';
import { authorizedFetch, setAuthToken } from './util/setAuthToken';
import './App.css';
import smile from './img/smile.png';
import {
  _404, About, Contact,
  Footer, Home, Login, Logout,
  PrivateRoute, Profile, Signup,
} from './components';

const BACKEND = process.env.BACKEND;

function App() {
  const [user, setUser] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      console.log('is not authenticated...');
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    const token = jwt_decode(localStorage.getItem('jwt'));
    setIsAuthenticated(!!token);
    setAuthToken(localStorage.getItem('jwt'));
    setUser(token);
    console.log(BACKEND);
  }, []);

  const getFiles = async id => {
    console.log(Date.now(), 'getFiles called');
    console.log(isAuthenticated, user);
    const fs = await authorizedFetch(`${BACKEND}/profile/files`);
    const rs = await fs.text();
    if (rs === 'Unauthorized') {
      setFiles([]);
      return;
    }
    setFiles(JSON.parse(rs));
  };

  useEffect(() => {
    if (!user) { return; }
    console.log('user changed', user);
    getFiles(user.id);
    // eslint-disable-next-line
  }, [user]);

  const nowCurrentUser = userData => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (localStorage.getItem('jwt')) {
      localStorage.removeItem('jwt');
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  document.title = title();

  return (
    <>
      <img className="logo" src={smile} alt="logo" />
      <div className="main">
        <Switch>
          <Route
            exact path='/'
            render={_ => <Home
              user={user}
              isAuthenticated={isAuthenticated}
              files={files}
              setFiles={setFiles}
            />}
          />
          <Route path='/signup' component={Signup} />
          <Route
            path='/login'
            render={
              props => <Login
                {...props}
                user={user}
                nowCurrentUser={nowCurrentUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <PrivateRoute
            path='/profile'
            user={user}
            files={files}
            setFiles={setFiles}
            component={Profile}
            handleLogout={handleLogout}
          />
          <Route
            path='/about'
            component={About}
          />
          <Route
            path='/logout'
            handleLogout={handleLogout}
            component={Logout}
          />
          <Route path='/contact' component={Contact} />
          <Route path='*' component={_404} />
        </Switch>
        <Footer
          handleLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </>
  );
}

export default App;
