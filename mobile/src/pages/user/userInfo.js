import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    AsyncStorage,
  } from 'react-native';

import noIcon_png from '../../icons/nouser.png';

export default class UserInfo extends Component {

    static navigationOptions = {
        headerTitle: 'Informações pessoais',
    }

    state = {
        loggedInUser: null,
    }

    //Load user before component mount as Object
    async componentWillMount(){
        const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:users'));

        this.setState({ loggedInUser: user });
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.avatar}>
                    <Image
                        source={this.state.loggedInUser &&
                            this.state.loggedInUser.avatar ? 
                            {uri: this.state.loggedInUser.avatar} : 
                            noIcon_png}
                        style={styles.iconUser}
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.textTitle}>
                        Nome
                    </Text>

                    <Text style={styles.textDescription}>
                        { this.state.loggedInUser && this.state.loggedInUser.name }
                    </Text>

                    <Text style={styles.textTitle}>
                        E-mail
                    </Text>

                    <Text style={styles.textDescription}>
                        { this.state.loggedInUser && this.state.loggedInUser.email}
                    </Text>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    avatar: {
        alignItems: 'center',
        marginTop: 30,
        paddingBottom: 40,
        borderBottomWidth: 1,
        borderColor: '#6667',
    },  
    iconUser: {
        height: 300,
        width: 300,
        borderRadius: 300,
    },
    content:{
        alignItems: 'flex-start',
        paddingLeft: 32,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 19,
        marginVertical: 10,
        color: '#4B0082',
    },
    textDescription: {
        fontSize: 15,
        color: '#6669',
    }
});