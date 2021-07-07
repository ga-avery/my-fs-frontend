import { authorizedFetch } from "../util/setAuthToken";
import { useState } from "react";
import { Redirect } from "react-router-dom";
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState('');


  const handleInput = e => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };


  const handleSubmit = async () => {
    if (password.length < 8) {
      alert('password must be 8 characters or greater');
      return;
    }

    if (password !== confirmPassword) {
      alert('password must match');
      return;
    }

    const payload = { name, email, password };
    try {
      const init = {
        method: 'post',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(payload)
      };
      const response = await authorizedFetch(
        `${REACT_APP_SERVER_URL}/api/users/signup`,
        init
      );
      if (!response.ok) {
        // handle email already exists here
        alert('email already exists');
        return;
      }
      const json = await response.json();
      console.log(json);
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };


  if (redirect) {
    return <Redirect to='/login' />;
  }


  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(e); }}>
        <div className="form-group">
          <label htmlFor='name'>Name</label>
          <input
            type='text' name='name' id='name' className='form-control'
            value={name} onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor='email'>Email</label>
          <input
            type='text' name='email' id='email' className='form-control'
            value={email} onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            type='password' name='password' id='password' className='form-control'
            value={password} onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password' name='confirmPassword' id='confirmPassword' className='form-control'
            value={confirmPassword} onChange={handleInput}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};
