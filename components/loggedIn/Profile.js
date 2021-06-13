import * as React from 'react';
import { Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import AuthContext from '../../context/AuthContext';

const blankState = {savedRecipes: {}, currentIngrediants: [], currentIngrediantQuantities: []}

function Profile () {
    const { signOut } = React.useContext(AuthContext);
    const [profile, setProfile] = React.useState(blankState);
    getProfile(signOut).then(res => {
        if (res) setProfile(res);
    });
    return (
        <>
            <Text>{profile.savedRecipes.toString()}</Text>
            <Text>{profile.currentIngrediants.toString()}</Text>
            <Text>{profile.currentIngrediantQuantities.toString()}</Text>
        </>
    )
}

async function getProfile (signOut) {
    let token = await SecureStore.getItemAsync('userToken');
    if (!token) {
        return blankState;
    }
    return await fetch(API_URL + 'profile', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(async res => {
        return res.json().then(json => {
            if (res.ok) {
                return json;
            } else {
                signOut();
                return '';
            }
        });
    });
}

export default Profile;