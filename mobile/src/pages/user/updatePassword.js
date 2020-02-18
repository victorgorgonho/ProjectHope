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

import logo from '../../icons/logo3.png';
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

  //Send token to mail to reset password
  forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot_password', {
        email,
      });
      
      //Storage email in AsyncStorage to be used in other screens
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
        source = {logo}
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
  textHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 60,
    marginLeft: 40,
    color: '#4B0082',
  },
  textError: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#CC0000',
  }, 
  input: {
    width: 350,
    marginTop: 25,
    padding: 10,
    fontSize: 14,
    borderBottomWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  textForgotPassword: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 42,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 9,
    backgroundColor: '#4B0082',
  },
  textExistingUser: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#4B0082',
  },
  textInfo: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingTop: 110,
    color: '#4B0082',
  },
  existingUserButton: {
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
});
