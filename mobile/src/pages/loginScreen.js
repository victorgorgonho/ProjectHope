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

import logo from '../icons/logo3.png';
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

  //Sign in if email and password match MongoDB user
  signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/authenticate', {
        email,
        password,
      });

      const { user, token } = response.data;
      
      //Storage token and user (as JSON) in AsyncStorage to use in other screens
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
        source = {logo}
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    paddingTop: 110,
    backgroundColor: '#fff',
  },
  logo: {
    width: 500,
    height: 160,
  },
  textError: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#CC0000',
  }, 
  input: {
    width: 340,
    marginTop: 25,
    padding: 10,
    fontSize: 14,
    borderBottomWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 42,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 9,
    backgroundColor: '#4B0082',
  },
  textLoginButton: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
  },
  textForgotPassword: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 55,
    marginBottom: 55,
    color: '#979696',
  },
  newUserButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 42,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4B0082',
    backgroundColor: '#FFF',
  },
  textNewUser: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#4B0082',
  },
});
