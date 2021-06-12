import * as React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AuthContext = React.createContext();
const Tab = createBottomTabNavigator();
import * as authReducer from './reducers/signedInReducer';
import * as authBootstrap from './bootstrap/authBootstrap';
import * as authMemo from './memo/authMemo';

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
    authReducer.reducer, authReducer.initialState
  );

  React.useEffect(authBootstrap.bootstrap(dispatch), []);

  const authContext = React.useMemo(authMemo.memo(dispatch),
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
