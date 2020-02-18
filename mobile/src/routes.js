import { createStackNavigator } from 'react-navigation';

import ConfigCards from './pages/cards/configCards';
import CreateCards from './pages/cards/createCards';
import ConfigUser from './pages/user/configUser';
import CreateUser from './pages/user/createUser';
import UserInfo from './pages/user/userInfo';
import LoginScreen from './pages/loginScreen';
import UpdatePassword from './pages/user/updatePassword';
import ConfirmToken from './pages/user/confirmToken';
import HomeScreen from './pages/homeScreen';
import SendNotification from './pages/sendNotification';

//Create StackNavigator, based on a Stack abstract data type, to travel between screens, starting from Login
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
    ConfigCards: {
        screen: ConfigCards
    },
    CreateCards: {
        screen: CreateCards
    },
    SendNotification: {
        screen: SendNotification
    },
}, {
    //Header standard colors
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#4B0082"
        },
        headerTintColor: "#ffffff"
    }, 
}, {
    initialRouteName: 'LoginScreen',
});