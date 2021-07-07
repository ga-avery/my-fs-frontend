const setAuthToken = token => {
  if (!token) {
    authToken = '';
    return;
  }
  authToken = token;
};
let authToken;
const authorizedFetch = (resource, init = { headers: {} }) => {
  if (authToken) {
    init.headers['Authorization'] = authToken;
  }
  return fetch(resource, init);
};
export { setAuthToken, authorizedFetch };
