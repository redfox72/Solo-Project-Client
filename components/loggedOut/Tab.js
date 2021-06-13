import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Register from './Register';
import SignIn from './Signin';

const Tab = createBottomTabNavigator();

function AuthTab () {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Sign In" component={SignIn}/>
            <Tab.Screen name="Register" component={Register}/>
        </Tab.Navigator>
    )
}

export default AuthTab;