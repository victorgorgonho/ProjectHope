import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Alert,
} from 'react-native';

import api from '../../services/api';

export default class CreateCards extends Component {

    state = {
        errorMessage: null,
        title: null,
        type: null,
        description: null,
        link: null,
        image: null,
    };

    static navigationOptions = {
        title: 'Criar cards',
    };

    onChangeTextTitle = (event) => {
        this.setState({ title: event.nativeEvent.text });
    };

    onChangeTextDescription = (event) => {
        this.setState({ description: event.nativeEvent.text });
    };

    //Create Cards if token is valid
    createCards = async (title, type, description, link, image) => {
        try{
            const token = await AsyncStorage.getItem('@CodeApi:token');

            await api.post('/cards/create_card', {
                title,
                type,
                description,
                link,
                image
            }, { headers: { Authorization: `Bearer ${token}` }});

            Alert.alert('','Card criado com sucesso');
        } catch (response) {
            this.setState({ errorMessage: response.data.error });
        }
    }

    render() {
        return(
            <View style={styles.container}>   
                <View style={styles.containerPicker}>

                    <Text style={styles.textType}>
                        Selecione um tipo de card:
                    </Text>

                    <View style={styles.containerPickerContent}>

                        <Picker
                            style={styles.picker}
                            itemStyle={{fontSize: 50}}
                            selectedValue={this.state.type}
                            onValueChange={(itemValue) =>
                                this.setState({type: itemValue})
                            }
                        >
                            <Picker.Item label = '-' value = {null} />
                            <Picker.Item label = 'Dicas' value = 'dicas' />
                            <Picker.Item label = 'Fatos' value = 'fatos'/>
                            <Picker.Item label = 'Motivacional' value = 'motivacional'/>
                            
                        </Picker>
                    </View>

                    { 
                        // Based on Picker value, load different View with textInputs
                        (this.state.type == 'dicas' ||
                        this.state.type == 'fatos') &&

                        <View style = {styles.containerTextInput}>
                            <TextInput
                                style={styles.input}
                                placeholder = 'Título'
                                placeholderTextColor = '#4B0082'
                                onChange={this.onChangeTextTitle}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder = 'Descrição'
                                placeholderTextColor = '#4B0082'
                                onChange={this.onChangeTextDescription}
                            />
                        </View>
                    }
                    {
                        this.state.type == 'motivacional' &&

                        <View style = {styles.containerTextInput}>
                            <TextInput
                                style={styles.input}
                                placeholder = 'Descrição'
                                placeholderTextColor = '#4B0082'
                                onChange={this.onChangeTextDescription}
                            />
                        </View>
                    }
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.createCards(
                            this.state.title, 
                            this.state.type, 
                            this.state.description, 
                            this.state.link, 
                            this.state.image
                        )}
                    >
                        
                        <Text style = { styles.textbutton }>
                            CRIAR
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
    },
    containerPicker: {
        height: 590,
    },
    containerPickerContent: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderColor: '#33333333',
    },
    containerButton:{
        alignItems: 'center'
    },
    textType: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 30,
        paddingLeft: 5,
        paddingBottom: 30,
        color: '#4B0082',
    },
    picker: {
        color: '#4B0082',
    },
    input: {
        width: 370,
        height: 42,
        paddingLeft: 10,
        marginTop: 25,
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1.5, 
        borderColor: '#4B0082',
        backgroundColor: '#FFF',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 370,
        height: 42,
        borderRadius: 10,
        backgroundColor: '#4B0082',
    },
    textbutton: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF',
    },
    textError: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#CC0000',
    }
});