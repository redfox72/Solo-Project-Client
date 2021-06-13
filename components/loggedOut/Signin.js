import * as React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AuthContext from '../../context/AuthContext';

function SignIn () {
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

export default SignIn;