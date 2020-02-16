import React, { Component } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';

import api from '../../services/api';

export default class CreateUser extends Component{
  
  static navigationOptions = {
    header: null,
  };
  
  state = {
    loggedInUser: null,
    errorMessage: null,
    name: '',
    email: '',
    password: '',
  };
  
  onChangeTextName = (event) => {
    event.persist();
    this.setState({ name:event.nativeEvent.text });
  };

  onChangeTextEmail = (event) => {
    event.persist();
    this.setState({ email:event.nativeEvent.text });
  };

  onChangeTextPassword = (event) => {
    event.persist();
    this.setState({ password:event.nativeEvent.text });
  };

  register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      const { user, token } = response.data;
    
      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:user', JSON.stringify(user)],
      ]);

      Alert.alert('','Usuário criado com sucesso!');
      this.props.navigation.navigate('LoginScreen');

    } catch (response) {
      this.setState({ errorMessage: response.data.error });
    }
  };

  render() {
    return (
    <View style={styles.container}>
      
      <Image
        style = {styles.logo}
        source = {require('../../icons/logo3.png')}
      />
      
      {!!this.state.errorMessage && <Text style = {styles.textError}>{ this.state.errorMessage }</Text>}
      <View style={styles.containerTextInput}>
        <TextInput
          style = {styles.input}
          placeholder = "Nome"
          placeholderTextColor = "#4B0082"
          onChange = {this.onChangeTextName}
        />
        
        <TextInput
          style = {styles.input}
          placeholder = "E-mail"
          placeholderTextColor = "#4B0082"
          onChange = {this.onChangeTextEmail}
        />
        
        <TextInput
          style = {styles.input}
          placeholder = "Senha"
          placeholderTextColor = "#4B0082"
          secureTextEntry = {true}
          onChange = {this.onChangeTextPassword}
        />

      </View>

      <TouchableOpacity 
        onPress = { () => this.register(this.state.name.trim(),this.state.email.trim(), this.state.password)}
        style = { styles.newUserButton}
      >
        
        <Text style = {styles.textNewUser}>
          FINALIZAR REGISTRO
        </Text>
      
      </TouchableOpacity>
    
      <Text style={styles.textInfo}>
        JÁ POSSUI CONTA?
      </Text> 

      <TouchableOpacity 
        style={styles.existingUserButton}
        onPress={() => this.props.navigation.navigate('LoginScreen')}
      >
        <Text style={styles.textExistingUser}>
          FAZER LOGIN
        </Text>
      </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 110,
  },
  logo: {
    width: 500,
    height: 160,
  },
  textError: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC0000',
  }, 
  input: {
    borderColor: '#E8E8E8',
    borderBottomWidth: 1.5,
    width: 340,
    marginTop: 25,
    padding: 10,
    fontSize: 14,
  },
  textInfo: {
    paddingTop: 50,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textNewUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  newUserButton: {
    width: 350,
    height: 42,
    backgroundColor: '#4B0082',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textExistingUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  existingUserButton: {
    width: 350,
    height: 42,
    borderWidth: 2,
    borderColor: '#4B0082',
    backgroundColor: '#FFF',
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInfo: {
    paddingTop: 50,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B0082',
  },    
});
