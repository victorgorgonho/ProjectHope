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

export default class ConfirmToken extends Component{
  
  static navigationOptions = {
    header: null,
  };
  
  state = {
    errorMessage: null,
    loggedInUser: null,
    email: '',
    token: '',
    password: '',
  }; 

  //Load email from AsyncStorage so you can autocomplete
  async componentDidMount(){
    const email = await AsyncStorage.getItem('@CodeApi:email');
      
    this.setState({email: email});
  }
  
  onChangeTextToken = (event) => {
    event.persist();
    this.setState({ token:event.nativeEvent.text });
  };
  
  onChangeTextPassword = (event) => {
    event.persist();
    this.setState({ password:event.nativeEvent.text });
  };

  //Reset password if all three infos are correct
  resetPassword = async (email, token, password) => {
    try {
      await api.post('/auth/reset_password', {
        email,
        token,
        password,
      });

      Keyboard.dismiss();
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
        source = {logo}
      />
  
      {!!this.state.errorMessage && <Text style = {styles.textError}>{ this.state.errorMessage }</Text>}
      <Text style={styles.textHeader}>
          Digite o token recebido no e-mail e a nova senha para completar a mudança de senha.
      </Text>

      <View style={styles.containerTextInput}>
        
      <TextInput
          style = {styles.input}
          placeholder = {this.state.email}
          placeholderTextColor = "#4B0082"
          editable = {false}
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
        onPress = { () => this.resetPassword(this.state.email.trim(), this.state.token, this.state.password)}
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
    marginLeft: 40,
    marginTop: 20,
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
    fontSize: 14,
    padding: 10,
    borderBottomWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  textResetPassword: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
  },
  resetPasswordButton: {
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
    paddingTop: 10,
    color: '#4B0082',
  },
  existingUserButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 42,
    marginBottom: 20,
    marginTop: 15,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4B0082',
    backgroundColor: '#FFF',
  }, 
});
