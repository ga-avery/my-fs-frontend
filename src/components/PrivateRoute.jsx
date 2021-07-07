import { Route, Redirect } from "react-router-dom";
export const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log('This is a private route...');
  let user = localStorage.getItem('jwt');

  return (
    <Route {...rest}
      render={
        (props) => {
          return user
            ? <Component {...rest} {...props} />
            : <Redirect to='/login' />;
        }}
    />
  );
};
