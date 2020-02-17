import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import dicas_png from '../icons/dicas.png';
import fatos_png from '../icons/fatos.png';
import aspas_png from '../icons/aspas.png';
import noUser_png from '../icons/nouser.png';

import api from '../services/api';

//This function makes another function wait 'timeout' ms before continue.
function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

export default class HomeScreen extends Component {

    //This constructor will work to keep profile picture updated in real time.
    constructor(props){
        super(props);
        
        const didWillFocusSubscription = this.props.navigation.addListener(
            'willFocus', async (payLoad) => {
                const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:users'));

                if(user)
                    this.setState({user: user});
            }
        );
        this.setState({didWillFocusSubscription});
    }

    state = {
        loggedInUser: null,
        cards: null,
        didWillFocusSubscription: null,
        isLoading: false,
    }
    
    async componentDidMount() {
        const token = await AsyncStorage.getItem('@CodeApi:token');
        const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:users'));
    
        if(token && user) {
            this.setState({ loggedInUser: user });
        }
        this.getCards();
    };

    getCards = async () => {
        const token = await AsyncStorage.getItem('@CodeApi:token');
        const response = await api.get('/cards/', {}, { headers: { Authorization: `Bearer ${token}` }});
        const cards =  response.data.cards;

        this.setState({cards});
    }

    listCards = () => {
        wait(5000).then(() => this.setState({isLoading: true})).then(() => this.setState({isLoading: false}));
        this.getCards();
    }

    render(){
        if(!this.state.cards) return null;

        return(

            <View style={styles.container}> 
                <View style={styles.header}>   
                    <View style={styles.containerTextHeader}>
                        <Text style={styles.textHeader}>
                            Olá, {this.state.loggedInUser.name}
                        </Text>
                    </View>

                    <View style={styles.containerAvatar}>
                        <TouchableOpacity
                            style={styles.buttonAvatar}
                            onPress={() => this.props.navigation.navigate('ConfigUser')}
                        >
                            
                            <Image
                                style={styles.avatarPic}
                                source={this.state.loggedInUser && 
                                    this.state.loggedInUser.avatar ? 
                                    {uri: this.state.loggedInUser.avatar} : noUser_png}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList 
                    data={this.state.cards}
                    refreshing={this.state.isLoading}
                    onRefresh={this.listCards}
                    renderItem={({ item }) => {
                        return(
                            <View style={styles.containerCards}>
                                {
                                    item.type === 'dicas' &&
                                    <View style={styles.container, styles.dicas}>
                                        <View style={styles.containerDicas}>
                                            <View style={styles.containerDicasPic}>
                                                <Image
                                                    source = {dicas_png}
                                                    style = { styles.picDicas }
                                                    resizeMode='center'
                                                />
                                            </View>

                                            <View style={styles.containerDicasInfos}>
                                                <Text style={styles.title}>
                                                    {item.title}
                                                </Text>
                                                
                                                <Text style={styles.description}>
                                                    {item.description}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        <TouchableOpacity style={styles.button}>
                                            <Text style={styles.textButton}>
                                                VER MAIS DICAS
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                {
                                    item.type === 'fatos' &&
                                    <View style={styles.container, styles.fatos}>
                                        <View style={styles.containerFatos}>
                                            <View style={styles.containerFatosInfos}>
                                                <Text style={styles.title}>
                                                    {item.title}
                                                </Text>

                                                <Text style={styles.description}>
                                                    {item.description}
                                                </Text>
                                            </View>
                                            
                                            <View style={styles.containerFatosPic}>
                                                <Image
                                                    source = {fatos_png}
                                                    style = { styles.picDicas }
                                                    resizeMode='center'
                                                />
                                            </View>
                                        </View>
                                    </View>
                                }
                                {
                                    item.type === 'motivacional' &&
                                    <View style={styles.container, styles.motivacional}>
                                        <View style={styles.containerMotivacional}>
                                            <View style={styles.containerMotivacionalPic}>
                                                <Image
                                                    source = {aspas_png}
                                                    style = { styles.picMotivacional }
                                                    resizeMode='center'
                                                />
                                            </View>

                                            <View style={styles.containerMotivacionalInfos}>
                                                <Text style={styles.descriptionMotivacional}>
                                                    {item.description}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#FFF',
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        height: 80,
        marginBottom: 10,
    },
    containerTextHeader: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 20,
        height: 80,
        width: 300,
    },
    containerAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 95,
    },
    buttonAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderWidth: 5,
        borderRadius: 40,
        borderColor: '#4B0082',
    },
    avatarPic: {
        height: 45,
        width: 45,
        borderRadius: 100,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 23,
        color: '#4B0082',
    },

    dicas: {
        alignItems: 'center',
        height: 260,
        marginBottom: 20,
        marginHorizontal: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#d3d3d3',
        backgroundColor: '#FFF',
    },  
    containerDicas: {
        flexDirection: 'row',
        marginRight: 10,
        borderRadius: 25,
        
    },
    containerDicasPic: {
        justifyContent: 'flex-start',
        position: 'relative',
        height: 200,
        width: 120,
        borderRadius: 25,
    },
    containerDicasInfos: {
        flex: 1,
        height: 200,
        borderRadius: 25,
    },
    picDicas: {
        width: 110,
        height: 130,
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D3BDF0',
        width: 320,
        height: 43,
        borderRadius: 20,
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#4B0082',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 20,
        color: '#334',
    },
    description: {
        fontSize: 15,
        paddingTop: 10,
        color: '#333',
    },

    //fatos
    fatos: {
        alignItems: 'center',
        height: 260,
        marginBottom: 20,
        marginHorizontal: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#33333333',
        backgroundColor: '#FFF',
    },  
    containerFatos: {
        flexDirection: 'row',
        marginLeft: 10,
        borderRadius: 25,
        marginBottom: 10,
    },
    containerFatosPic: {
        position: 'relative',
        justifyContent: 'flex-start',
        width: 110,
        height: 200,
        borderRadius: 25,
        marginRight: 10,
    },
    containerFatosInfos: {
        flex: 1,
        height: 200,
        borderRadius: 25,
        paddingLeft: 10,
    },
    picDicas: {
        width: 140,
        height: 140,
    },

    //motivacional
    motivacional: {
        alignItems: 'center',
        height: 260,
        marginBottom: 20,
        marginHorizontal: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        backgroundColor: '#4B0082',
    },
    containerMotivacional: {
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 25,
        marginBottom: 10,
    },
    containerMotivacionalPic: {
        alignItems: 'center',
        width: 110,
        height: 80,
        borderRadius: 25,
        marginRight: 10,
        paddingTop: 25,
    },
    containerMotivacionalInfos: {
        flex: 1,
        height: 200,
        borderRadius: 25,
        marginRight: 20,
        marginLeft: 20,
        paddingTop: 15,
    },
    picMotivacional: {
        width: 60,
        height: 60,
    },
    descriptionMotivacional:{
        fontFamily: 'sans-serif-condensed',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        paddingTop: 10,
        color: '#FFF',
    }
});