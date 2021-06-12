import * as SecureStore from 'expo-secure-store';

import { API_URL } from '@env';

const bootstrap = (dispatch) => {
  return () => 
    {
      // Fetch the token from storage then navigate to our appropriate place
      const bootstrapAsync = async () => {
        let userToken;

        try {
          // Restore token stored in `SecureStore` or any other encrypted storage
          userToken = await SecureStore.getItemAsync('userToken');
          if (userToken) {
            return fetch(API_URL + 'validate', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${userToken}`
              }
            }).then(async res => {
              if (res.ok) {
                dispatch({type: 'RESTORE_TOKEN', token: userToken});
              } 
              else {
                SecureStore.setItemAsync('userToken', '')
                .then(res => {
                  dispatch({type: 'RESTORE_TOKEN', token: null});
                });
              }
            });
          }
        } catch (e) {
          console.warn(e);
          await SecureStore.setItemAsync('userToken', '');
        }
        dispatch({type: 'RESTORE_TOKEN', token: null});
        // After restoring token, we may need to validate it in production apps

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        
      };

      bootstrapAsync();
    }
  };

  export { bootstrap };