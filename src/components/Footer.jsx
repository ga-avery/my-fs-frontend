import './Footer.css';
import { NavLink, Link } from 'react-router-dom';
export const Footer = props => {
  const { isAuthenticated, handleLogout } = props;
  const profileOptions = isAuthenticated
    ? (
      <>
        <NavLink to="profile">Profile</NavLink> |&nbsp;
        <Link onClick={handleLogout} to="logout">Logout</Link> |&nbsp;
      </>
    )
    : (
      <>
        <NavLink to="signup">Register</NavLink> |&nbsp;
        <NavLink to="login">Login</NavLink> |&nbsp;
      </>
    );

  return (
    <footer className="footer">
      <span>
        <NavLink to="/">Home</NavLink> |&nbsp;
        {profileOptions}
        <NavLink to="about">About</NavLink> |&nbsp;
        {/* <NavLink to="contact">Contact Us</NavLink> | */}
        file-store
      </span>
    </footer>
  );
};