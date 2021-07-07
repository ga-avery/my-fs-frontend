import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authorizedFetch } from '../util/setAuthToken';
const BACKEND = process.env.BACKEND || 'https://my-fs.herokuapp.com';
export const Profile = props => {
  const { handleLogout, files, setFiles } = props;
  const { exp, id, name, email } = props.user;
  const [nm, setNm] = useState(<></>);
  const expirationTime = new Date(exp * 1000);
  const currentTime = Date.now();
  if (currentTime >= expirationTime) {
    handleLogout();
    alert('Session has ended. Please login again.');
  }

  useEffect(() => {
    setNm(<span>{name} [<span style={{ cursor: 'pointer', color: 'rgb(20, 79, 174)' }} onClick={editName}>edit</span>]</span>);
  }, [name]);
  /**
   * @param {React.MouseEvent} event 
   */
  const editName = async event => {
    setNm(
      <span>
        <input type="text" id="newName" />
        <button onClick={async () => {
          const newName = document.querySelector('#newName').value;
          const init = {
            method: 'put',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ newName })
          };
          await authorizedFetch(`${BACKEND}/profile`, init);

          window.location.assign('logout');
          // setNm(<span>{name} [<span style={{ cursor: 'pointer', color: 'rgb(20, 79, 174)' }} onClick={editName}>edit</span>]</span>);
        }}>submit</button>
      </span>
    );
  };
  /**
   * @param {React.MouseEvent} event 
   */
  const del = async (event, link) => {
    event.preventDefault();
    event.stopPropagation();
    const init = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link })
    };
    await authorizedFetch(link, init);
    setFiles(files.filter(file => file !== link));
  };

  const fs = files.map((link, idx) => (
    <div key={idx}>
      <a target="_blank" rel="noreferrer" href={link}>{link}</a>&nbsp;
      [<span style={{ cursor: 'pointer', color: 'rgb(20, 79, 174)' }} onClick={e => del(e, link)}>delete</span>]
    </div>
  ));

  const userData = props.user
    ? (
      <div>
        <h1>Profile</h1>
        <div><strong>Name:</strong>{nm}</div>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>ID:</strong> {id}</p>
        <div><strong>Files:</strong>{fs}</div>
      </div>
    )
    : (
      <h4>Loading...</h4>
    );

  const errorDiv = (
    <div>
      <h3>Please <Link to="/login">login</Link> to view this page</h3>
    </div>
  );

  return (
    <>{props.user ? userData : errorDiv}</>
  );
};