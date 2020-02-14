import { createStackNavigator } from 'react-navigation';

import Main from './pages/main';
import LoginScreen from './pages/loginScreen';

export default createStackNavigator({
    LoginScreen: {
        screen: LoginScreen
    },
}, {
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#DA552F"
        },
        headerTintColor: "#FFF"
    }, 
}, {
    initialRouteName: 'LoginScreen',
});