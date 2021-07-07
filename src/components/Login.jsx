import jwtDecode from "jwt-decode";
import { useState } from "react";
import { Redirect } from 'react-router-dom';
import { authorizedFetch, setAuthToken } from "../util/setAuthToken";
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleEmail = e => {
    setEmail(e.target.value);
  };
  const handlePassword = e => {
    setPassword(e.target.value);
  };
  /**
   * 
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async e => {
    e.preventDefault();
    const userData = { email, password };
    const init = {
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(userData),
    };
    const post = await authorizedFetch(`${REACT_APP_SERVER_URL}/api/users/login`, init);
    if (!post.ok) {
      alert('either username or password are incorrect');
      return;
    }
    const json = await post.json();
    const { token } = json;
    const decoded = jwtDecode(token);
    localStorage.setItem('jwt', token);
    setAuthToken(token);
    props.nowCurrentUser(decoded);
  };
  if (props.user) {
    return <Redirect to='/' />;
  }
  return (
    <div>
      <h2>Login</h2>
      <form method="post" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email}
            onChange={handleEmail} className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password}
            onChange={handlePassword} className="form-control"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};