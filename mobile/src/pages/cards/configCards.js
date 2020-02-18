import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    Image,
    FlatList,
    TextInput,
    Alert,
} from 'react-native';

import api from '../../services/api';

import create_png from '../../icons/createWhite.png';
import dicas_png from '../../icons/dicas.png';
import fatos_png from '../../icons/fatos.png';
import aspas_png from '../../icons/aspas.png';

//Wait 'timeout' ms before do something
function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

export default class ConfigCards extends Component {

    static navigationOptions = {
        headerTitle: 'Cards',
    }

    state = {
        cards: null,
        loggedInUser: null,

        isLoading: false,
        isUpdateDelete: false,
        isUpdate: false,

        idCard: null,
        title: null,
        type: null,
        description: null,
        link: null,
        image: null,
    }

    //Update cards state with cards array from AsyncStorage
    getCards = async () => {
        const token = await AsyncStorage.getItem('@CodeApi:token');
        const response = await api.get('/cards/', {}, { headers: { Authorization: `Bearer ${token}` }});
        const cards =  response.data.cards;

        this.setState({cards});
    }

    //Wait 5s then update cards
    listCards = () => {
        wait(5000).then(() => this.setState({isLoading: true})).then(() => this.setState({isLoading: false}));
        this.getCards();
    }
    
    //Update cards right before mounting
    componentWillMount(){
        this.getCards();
    }

    //Delete card based on ID
    delete = async (id) => {
        const token = await AsyncStorage.getItem('@CodeApi:token');
        await api.delete(`/cards/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});

        Alert.alert('','Card deletado com sucesso!');

        this.setState({isUpdateDelete: false});
    }

    //Update card based on ID
    update = async (title, type, description, link, image, id) => {
        try{
            const token = await AsyncStorage.getItem('@CodeApi:token');

            await api.put(`/cards/${id}`, {
                title,
                type,
                description,
                link,
                image
            }, { headers: { Authorization: `Bearer ${token}` }});

            Alert.alert('','Card editado com sucesso!');

        } catch (response) {
            this.setState({ errorMessage: response.data.error });
        }
    }

    //Update title based on textinput event
    onChangeTextTitle = (event) => {
        this.setState({ title: event.nativeEvent.text });
    };

    //Update description based on textinput event
    onChangeTextDescription = (event) => {
        this.setState({ description: event.nativeEvent.text });
    };

    render(){
        //If cards returned null, don't render to avoid memory leak
        if(!this.state.cards){
            return null;
        }

        return(
            <View style={styles.container}>
                <View style = {styles.containerTextInfo}>
                    <Text style = {styles.textInfo}>
                        Clique no card que deseja editar ou remover.
                    </Text>
                </View>

                <FlatList 
                    data={this.state.cards}
                    refreshing={this.state.isLoading}
                    onRefresh={this.listCards}
                    renderItem={({ item }) => {
                        return(
                            <View style={styles.containerCards}>
                                {   
                                    // If item.type equal 'dicas', load next TouchableOpacity
                                    item.type === 'dicas' &&
                                    
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isUpdateDelete: true, 
                                                idCard: item._id,
                                                title: item.title,
                                                type: item.type,
                                                description: item.description,
                                                link: item.link,
                                                image: item.image
                                            });
                                        }}
                                    >
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
                                    </TouchableOpacity>
                                }
                                {
                                    // If item.type equal 'fatos', load next TouchableOpacity
                                    item.type === 'fatos' &&
                                    
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isUpdateDelete: true, 
                                                idCard: item._id,
                                                title: item.title,
                                                type: item.type,
                                                description: item.description,
                                                link: item.link,
                                                image: item.image
                                            });
                                        }}
                                    >
                                    
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
                                    </TouchableOpacity>
                                }
                                {
                                    // If item.type equal 'motivacional', load next TouchableOpacity
                                    item.type === 'motivacional' &&
                                    
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isUpdateDelete: true, 
                                                idCard: item._id,
                                                title: item.title,
                                                type: item.type,
                                                description: item.description,
                                                link: item.link,
                                                image: item.image
                                            });
                                        }}
                                    >
                                    
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
                                    </TouchableOpacity>
                                }
                            </View>
                        );
                    }}
                />
                {
                    // If isUpdateDelete is true, then open sub-menu from the bottom
                    this.state.isUpdateDelete &&

                    <View style={styles.containerUpdateDelete}>
                        <TouchableOpacity
                            style={styles.buttonUpdateDelete}
                            onPress={() => this.setState({isUpdate: true, isUpdateDelete: false})}
                        >
                            <Text style={styles.textUpdateDelete}>
                                EDITAR
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonUpdateDelete}
                            onPress={() => this.delete(this.state.idCard)}
                        >
                            <Text style={styles.textUpdateDelete}>
                                DELETAR
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonBack}
                            onPress={() => this.setState({isUpdateDelete: false})}
                        >
                            <Text style={styles.TextBack}>
                                VOLTAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    // If isUpdate is true, load TextInputs
                    this.state.isUpdate &&

                    <View style={styles.containerUpdate}>
                        <FlatList
                            data={this.state.cards}
                            refreshing={this.state.isLoading}
                            onRefresh={this.listCards}
                            renderItem={({ item }) => {

                                return(
                                    <View>
                                        {
                                            (item._id == this.state.idCard) &&

                                            <View>
                                                { 
                                                    (item.type == 'dicas' ||
                                                    item.type == 'fatos') &&

                                                    <View style={{height: 320}}>
                                                        <TextInput
                                                            style={styles.input}
                                                            onChange={this.onChangeTextTitle}
                                                            placeholder = {item.title}
                                                            placeholderTextColor = '#4B0082'
                                                        />

                                                        <TextInput
                                                            style={styles.input}
                                                            onChange={this.onChangeTextDescription}
                                                            placeholder = {item.description}
                                                            placeholderTextColor = '#4B0082'
                                                        />
                                                    </View>
                                                }
                                                {
                                                    item.type == 'motivacional' &&

                                                    <View style={{height: 320}}>
                                                        <TextInput
                                                            style={styles.input}
                                                            onChange={this.onChangeTextDescription}
                                                            placeholder = {item.description}
                                                            placeholderTextColor = '#4B0082'
                                                        />
                                                    </View>
                                                }

                                                <TouchableOpacity
                                                    style={styles.buttonUpdateDelete}
                                                    onPress={() => {
                                                        this.setState({isUpdate: false}),
                                                        this.update(
                                                            this.state.title, 
                                                            this.state.type, 
                                                            this.state.description, 
                                                            this.state.link, 
                                                            this.state.image,
                                                            this.state.idCard,
                                                        )
                                                    }}
                                                >
                                                    <Text style={styles.textUpdateDelete}>
                                                        EDITAR
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.buttonBack}
                                                    onPress={() => this.setState({isUpdate: false, isUpdateDelete: true})}
                                                >
                                                    <Text style={styles.TextBack}>
                                                        VOLTAR
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        }   
                                    </View>
                                );
                            }}
                        />
                    </View>
                }
                {
                    // If isUpdateDelete and isUpdate are both false, load CreateCards button
                    !this.state.isUpdateDelete && 
                    !this.state.isUpdate &&

                    <View style={styles.containerButtonCreate}>
                        <TouchableOpacity
                            style={styles.buttonCreate}
                            onPress={() => this.props.navigation.navigate('CreateCards')}
                        >
                            <Image
                                style={styles.createIcon}
                                source={create_png}
                            />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    containerTextInfo: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    textInfo: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#4B0082',
    },
    containerRow:{
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#6667',
    },
    containerInfo: {
        width: 350,
        marginTop: -10,
    },
    textType: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#4B0082',
    },
    textDescription: {
        fontSize: 18,
        color: '#6669',
    },
    buttonMore: {
        alignItems: 'center',
        width: 40,
        height: 40,
        paddingTop: 1,
        borderRadius: 100,
    },
    imageButton: {
        width: 25,
        height: 25,
    },
    containerUpdateDelete: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 250,
        borderTopWidth: 3,
        borderColor: '#4B0082',
        backgroundColor: '#8B5CAC',
    },
    textUpdateDelete: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#4B0082',
    },
    buttonUpdateDelete: {
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
    TextBack: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF',
    },
    buttonBack: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 42,
        borderRadius: 10,
        marginBottom: 15,
        marginTop: 10,
        backgroundColor: '#4B0082',
    },
    containerUpdate: {
        alignItems: 'center',
        height: 500,
        paddingTop: 20,
        borderTopWidth: 3,
        borderColor: '#4B0082',
        backgroundColor: '#8B5CAC',
    },
    input: {
        width: 350,
        height: 42,
        marginTop: 25,
        paddingLeft: 10,
        borderRadius: 10,
        borderWidth: 1.5, 
        borderColor: '#4B0082',
        backgroundColor: '#FFF',
    },
    containerButtonCreate: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 15,
        right: 15,
        elevation: 3,
        borderRadius: 100,
        backgroundColor: '#4B0082',
    },
    buttonCreate:{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        borderRadius: 100,
        backgroundColor: '#4B0082',
    },
    createIcon: {
        height: 25,
        width: 25,
    },

    //HomeScreen
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
        borderRadius: 25,
        marginRight: 10,
        
    },
    containerDicasPic: {
        justifyContent: 'flex-start',
        position: 'relative',
        width: 120,
        height: 200,
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
        borderRadius: 25,
        marginLeft: 10,
        marginBottom: 10,
    },
    containerFatosPic: {
        justifyContent: 'flex-start',
        position: 'relative',
        width: 110,
        height: 200,
        borderRadius: 25,
        marginRight: 10,
    },
    containerFatosInfos: {
        height: 200,
        flex: 1,
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
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 25,
        marginBottom: 10,
    },
    containerMotivacionalPic: {
        alignItems: 'center',
        width: 110,
        height: 80,
        paddingTop: 25,
        borderRadius: 25,
        marginRight: 10,
    },
    containerMotivacionalInfos: {
        height: 200,
        flex: 1,
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
    },
    //end HomeScreen
});