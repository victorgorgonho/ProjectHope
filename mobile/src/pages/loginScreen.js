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
  Keyboard,
} from 'react-native';

import api from '../services/api';

export default class LoginScreen extends Component{
  
  static navigationOptions = {
    header: null,
  };
  
    state = {
    loggedInUser: null,
    errorMessage: null,
    email: '',
    password: '',
  };
  
  onChangeTextEmail = (event) => {
    event.persist();
    this.setState({ email:event.nativeEvent.text });
  };

  onChangeTextPassword = (event) => {
    event.persist();
    this.setState({ password:event.nativeEvent.text });
  };

  signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/authenticate', {
        email,
        password,
      });

      const { user, token } = response.data;
    
      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:users', JSON.stringify(user)],
      ]);

      this.setState({ loggedInUser: user });
      Keyboard.dismiss();
      
      Alert.alert('','Login com sucesso!');
      this.props.navigation.navigate('HomeScreen');
      
    } catch (response) {
      this.setState({ errorMessage: response.data.error });
    }
  };

  render() {
    return (
    <View style={styles.container}>
      
      <Image
        style = {styles.logo}
        source = {require('../icons/logo3.png')}
      />
      
      {!!this.state.errorMessage && <Text style = {styles.textError}>{ this.state.errorMessage }</Text>}
      <View style={styles.containerTextInput}>
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
        onPress = { () => this.signIn(this.state.email.trim().toLowerCase(), this.state.password) }
        style = { styles.loginButton}
      >
        
        <Text style = {styles.textLoginButton}>
          ENTRAR
        </Text>
      
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.forgotPasswordButton}
        onPress={() => this.props.navigation.navigate('UpdatePassword')}  
      >
        <Text style={styles.textForgotPassword}>
          ESQUECI MINHA SENHA
        </Text>
      </TouchableOpacity>
    
      <Text style={styles.textNewUser}>
        NÃO POSSUI CONTA?
      </Text> 

      <TouchableOpacity 
        style={styles.newUserButton}
        onPress={() => this.props.navigation.navigate('CreateUser')}
      >
        <Text style={styles.textNewUser}>
          CRIAR NOVA CONTA
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
  loginButton: {
    width: 350,
    height: 42,
    backgroundColor: '#4B0082',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLoginButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  textForgotPassword: {
    marginTop: 55,
    marginBottom: 55,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#979696',
  },
  newUserButton: {
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
  textNewUser: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4B0082',
  },
});
