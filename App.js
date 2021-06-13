import * as React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AuthContext from './context/AuthContext';
const Tab = createBottomTabNavigator();
import * as authReducer from './reducers/signedInReducer';
import * as authBootstrap from './bootstrap/authBootstrap';
import * as authMemo from './memo/authMemo';
import AuthTab from './components/loggedOut/Tab';
import TabLoggedIn from './components/loggedIn/Tab';

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
  
}

const Stack = createStackNavigator();

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
            <Stack.Screen name="Log in" component={AuthTab}/>
          ) : (
            // User is signed in
            <Stack.Screen name= "loggedIn" component={TabLoggedIn}/>
            
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
