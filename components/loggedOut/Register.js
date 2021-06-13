import * as React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import AuthContext from '../../context/AuthContext';

function Register () {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [status, setStatus] = React.useState('');

    const { register } = React.useContext(AuthContext);

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
      <Button title="Register" onPress={() => register({ username, password, setStatus })} />
    </View>
  );
}

export default Register;