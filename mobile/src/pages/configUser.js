import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    Image,
    Alert,
  } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Constants from 'expo-constants';

import Header from '../config/Header';
import noIcon_png from '../icons/nouser.png';

import api from '../services/api';

export default class ConfigUser extends Component {

    state = {
        cards: null,
        loggedInUser: null,
        avatar: null,
    };

    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:users'));

        this.getPermissionAsync();
        this.setState({ loggedInUser: user });
        this.setState({ avatar: user.avatar });
    };

    getPermissionAsync = async () => {
        // if (Constants.platform.ios) {
        //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //     if (status !== 'granted') {
        //         Alert('','Sorry, we need camera roll permissions to make this work!');
        //     }
        // }
        // else 
        // if(Constants.platform.android) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (status !== 'granted') {
            Alert('','Sorry, we need camera roll permissions to make this work!');
        }
    }
    
    updateAvatar = async (id) => {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                base64: true,
                aspect: [4,3],
                quality: 1
            });
        
            if (!result.cancelled) {
              this.setState({ avatar: result.base64 });
            }
        
            const avatar = this.state.avatar;
            const token = await AsyncStorage.getItem('@CodeApi:token');
            const user = this.state.loggedInUser;
            
            user.avatar = `data:image/jpeg;base64,${avatar}`;

            await AsyncStorage.setItem(
                '@CodeApi:users', JSON.stringify(user),
            );

            await api.put(`/user/${id}/avatar/`, {
                avatar
            }, { headers: { Authorization: `Bearer ${token}` }});

        } catch (response) {
            this.setState({ errorMessage: response.data.error });
        }
        
        
    };

    render(){
        return(
            <View style = { styles.container }>

                <Header
                    onPressBack={() => this.props.navigation.navigate('HomeScreen')}
                    title="Configurações"
                />

                <View style={styles.containerImage}>
                    
                    <TouchableOpacity
                        style={styles.buttonImage}
                        onPress={() => this.updateAvatar(this.state.loggedInUser._id)}
                    >
                        <Image
                            style={styles.image}
                            resizeMode='cover'
                            source={this.state.avatar ? {uri: this.state.avatar} : noIcon_png}
                        />
                    </TouchableOpacity>
                 </View> 

                 <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.updateAvatar(this.state.loggedInUser._id)}
                >
                    <Text style={styles.textButton}>
                        MUDAR FOTO DE PERFIL
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('InfoUser')}
                >
                    <Text style={styles.textButton}>
                        INFORMAÇÕES PESSOAIS
                    </Text>
                </TouchableOpacity>

                {this.state.loggedInUser && 
                 this.state.loggedInUser.isAdmin &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('CardsConfig')}
                    >
                        <Text style={styles.textButton}>
                            CARDS
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    containerImage: {
        width: 200,
        height: 200,
        marginTop: 60,
        marginBottom: 60,
    },
    image:{
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        width: 350,
        height: 42,
        backgroundColor: '#4B0082',
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF',
    }
});