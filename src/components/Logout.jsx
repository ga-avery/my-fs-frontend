import { Redirect } from "react-router-dom";
export const Logout = ({ handleLogout }) => {
  if (handleLogout) {
    handleLogout();
  } else {
    localStorage.removeItem('jwt');
  }
  return <Redirect to='/' />;
};