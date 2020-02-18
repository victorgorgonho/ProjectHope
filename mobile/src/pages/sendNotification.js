import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
  } from 'react-native';

export default class SendNotification extends Component {

    static navigationOptions = {
        headerTitle: 'Enviar notificação',
    }

    state = {
        loggedInUser: null,
        title: '',
        description: '',
    }

    onChangeTextTitle = (event) => {
        this.setState({ title:event.nativeEvent.text });
    };
    
    onChangeTextDescription = (event) => {
        this.setState({ description:event.nativeEvent.text });
    };

    //Send push notification to user, right now can only send to my device due to static token
    sendPushNotification = async () => {
        const message = {
          to: this.state.loggedInUser.tokenExpo,
          sound: 'default',
          title: this.state.title,
          body: this.state.description
        };

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
    };

    //Load user before component mount as Object
    async componentWillMount(){
        const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:users'));

        this.setState({ loggedInUser: user });
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChange={this.onChangeTextTitle}
                    placeholder = 'Título'
                    placeholderTextColor = '#4B0082'
                />

                <TextInput
                    style={styles.input}
                    onChange={this.onChangeTextDescription}
                    placeholder = 'Descrição'
                    placeholderTextColor = '#4B0082'
                />

                <TouchableOpacity
                    style={styles.buttonSend}
                    onPress={() => this.sendPushNotification()}
                >
                    <Text style={styles.textUpdateDelete}>
                        ENVIAR
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#FFF',
    },
    input: {
        width: 350,
        height: 42,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 10,
        borderWidth: 1.5, 
        borderColor: '#4B0082',
        backgroundColor: '#FFF',
    },
    
    buttonSend: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 42,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#4B0082',
        backgroundColor: '#FFF',
    },
    textSend: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#4B0082',
    },
});