import * as React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

const AuthContext = React.createContext();
const Tab = createBottomTabNavigator();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

function HomeScreen2() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in 2!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {status !== '' ? <Text>{status}</Text> : <></>}
      <Button title="Sign in" onPress={() => signIn({ username, password, setStatus })} />
    </View>
  );
}

const Stack = createStackNavigator();

function TabLoggedIn() {
  return (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen}/>
    <Tab.Screen name="Home2" component={HomeScreen2}/>
  </Tab.Navigator>
  );
}

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
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
        await SecureStore.setItemAsync('userToken', null);
      }
      dispatch({type: 'RESTORE_TOKEN', token: null});
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
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
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name= "loggedIn" component={TabLoggedIn}/>
            
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
