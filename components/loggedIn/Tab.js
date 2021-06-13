import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthContext from '../../context/AuthContext';
import LogOutTab from './LogOutTab';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

function TabLoggedIn() {

    const { signOut } = React.useContext(AuthContext);
    return (
    <Tab.Navigator>
        <Tab.Screen
        name="Profile"
        component={Profile}
        />
        <Tab.Screen
        name="Log Out" 
        component={LogOutTab}
        listeners={{
            tabPress: e => {
                signOut();
                }
            }
        }/>
    </Tab.Navigator>
    );
}

export default TabLoggedIn;