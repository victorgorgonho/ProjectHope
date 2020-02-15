import React, { Component } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import api from '../../services/api';

export default class ConfirmToken extends Component{
  
  static navigationOptions = {
    header: null,
  };
  
  state = {
    errorMessage: null,
    email: '',
    token: '',
    password: '',
  };

  UNSAFE_componentWillMount() {
    this.setState ({
      email: this.props.navigation.getParam('email')
    });
  }

  onChangeTextEmail = (event) => {
    event.persist();
    this.setState({ email:event.nativeEvent.text });
  };
  
  onChangeTextToken = (event) => {
    event.persist();
    this.setState({ token:event.nativeEvent.text });
  };
  
  onChangeTextPassword = (event) => {
    event.persist();
    this.setState({ password:event.nativeEvent.text });
  };


  resetPassword = async (email, token, password) => {
    try {
      const response = await api.post('/auth/reset_password', {
        email,
        token,
        password,
      });

      Alert.alert('','Senha atualizada com sucesso');
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
      <Text style={styles.textHeader}>
          Digite o token recebido no e-mail e a nova senha para completar a mudança de senha.
      </Text>
      
      <View style={styles.containerTextInput}>
        
      <TextInput
          style = {styles.input}
          placeholder = "E-mail"
          placeholderTextColor = "#4B0082"
          onChange = {this.onChangeTextEmail}
        />

        <TextInput
          style = {styles.input}
          placeholder = "Token"
          placeholderTextColor = "#4B0082"
          onChange = {this.onChangeTextToken}
        />

        <TextInput
          style = {styles.input}
          placeholder = "Nova senha"
          placeholderTextColor = "#4B0082"
          onChange = {this.onChangeTextPassword}
        />

      </View>

      <TouchableOpacity 
        onPress = { () => this.resetPassword(this.state.email.trim().toLowerCase(), this.state.token, this.state.password)}
        style = { styles.resetPasswordButton}
      >
        
        <Text style = {styles.textResetPassword}>
          ENVIAR
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
  textHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B0082',
    marginLeft: 40,
    marginTop: 20,
  },
  textError: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC0000',
  }, 
  input: {
    borderColor: '#E8E8E8',
    borderBottomWidth: 1.5,
    width: 350,
    marginTop: 25,
    padding: 10,
    fontSize: 14,
  },
  textResetPassword: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  resetPasswordButton: {
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
  textInfo: {
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
