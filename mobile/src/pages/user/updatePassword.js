import React, { Component } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Keyboard,
} from 'react-native';

import api from '../../services/api';

export default class UpdatePassword extends Component{
  
  static navigationOptions = {
    header: null,
  };
  
  state = {
    loggedInUser: null,
    errorMessage: null,
    email: '',
  };
  
  onChangeTextEmail = (event) => {
    event.persist();
    this.setState({ email:event.nativeEvent.text });
  };

  forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot_password', {
        email,
      });
    
      await AsyncStorage.setItem('@CodeApi:email', email);

      Keyboard.dismiss();
      Alert.alert('','Token enviado para e-mail', [{
        text: 'OK',
        onPress: () => this.props.navigation.navigate('ConfirmToken'),
      }]);
      
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
          Digite aqui o e-mail da conta que deseja recuperar a senha.
      </Text>
      
      <View style={styles.containerTextInput}>
        
        <TextInput
          style = {styles.input}
          placeholder = "E-mail"
          placeholderTextColor = "#4B0082"
          onChange = {this.onChangeTextEmail}
        />

      </View>

      <TouchableOpacity 
        onPress = { () => this.forgotPassword(this.state.email.trim().toLowerCase())}
        style = { styles.forgotPasswordButton}
      >
        
        <Text style = {styles.textForgotPassword}>
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
    marginTop: 60,
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
  textForgotPassword: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  forgotPasswordButton: {
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
    paddingTop: 110,
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
