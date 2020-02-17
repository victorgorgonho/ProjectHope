import { createStackNavigator } from 'react-navigation';

import CreateUser from './pages/user/createUser';
import UpdatePassword from './pages/user/updatePassword';
import ConfirmToken from './pages/user/confirmToken';
import LoginScreen from './pages/loginScreen';
import HomeScreen from './pages/homeScreen';
import ConfigUser from './pages/configUser';
import UserInfo from './pages/userInfo';

export default createStackNavigator({
    LoginScreen: {
        screen: LoginScreen
    },
    CreateUser: {
        screen: CreateUser
    },
    UpdatePassword: {
        screen: UpdatePassword
    },
    ConfirmToken: {
        screen: ConfirmToken
    },
    HomeScreen: {
        screen: HomeScreen
    },
    ConfigUser: {
        screen: ConfigUser
    },
    UserInfo: {
        screen: UserInfo
    },
}, {
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#4B0082"
        },
        headerTintColor: "#ffffff"
    }, 
}, {
    initialRouteName: 'LoginScreen',
});