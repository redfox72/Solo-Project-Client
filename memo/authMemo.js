import { API_URL} from '@env';
import * as SecureStore from 'expo-secure-store';

const memo = (dispatch) => {
    return () => ({
    signIn: async (data) => {
      // In a production app, we need to send some data (usually username, password) to server and get a token
      // We will also need to handle errors if sign in failed
      // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      // In the example, we'll use a dummy tokena
      fetch(API_URL + 'login', {
        method: 'POST',
        body: JSON.stringify({username: data.username, password: data.password}),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.ok) {
          data.setStatus('');
          res.json().then(json => {
            SecureStore.setItemAsync('userToken', json.token);
            dispatch({type: 'SIGN_IN', token: json.token})
          });
        } else {
          res.json().then(json => data.setStatus(json.error));
        }
      }).catch(err => data.setStatus(err));
    },
    signOut: async () => {
      let token = await SecureStore.getItemAsync('userToken');
      fetch (API_URL + 'logout', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(_ => {
        SecureStore.setItemAsync('userToken', '')
        .then(_ => dispatch({type: 'SIGN_OUT'}));
      });
    },
    signUp: async (data) => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      // In the example, we'll use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
  });
};

export { memo };