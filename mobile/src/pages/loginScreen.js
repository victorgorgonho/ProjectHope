import React, { Component } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback, 
  AsyncStorage,
  StatusBar,
  ActivityIndicator,
  Alert,
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
    this.setState({ email:event.nativeEvent.text });
  };

  onChangeTextPassword = (event) => {
    this.setState({ password:event.nativeEvent.text });
  };

  signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/authenticate', {
        email: 'josegorgonho@eng.ci.ufpb.br',
        password: '123456789',
      });

      const { user, token } = response.data;
    
      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:user', JSON.stringify(user)],
      ]);

      this.setState({ loggedInUser: user });

      Alert.alert('Login com sucesso!');

    } catch (response) {
      this.setState({ errorMessage: response.data.error });
    }
  };

  render() {
    return (
    <View style={styles.container}>
      {!!this.state.errorMessage && <Text>{ this.state.errorMessage }</Text>}
      <View style={styles.containerTextInput}>
        <TextInput
          style = {styles.input}
          placeholder = "Login"
          onChange = {this.onChangeTextEmail}
        />
        
        <TextInput
          style = {styles.input}
          placeholder = "Senha"
          secureTextEntry = {true}
          onChange = {this.onChangeTextPassword}
        />
        
      </View>

      <TouchableOpacity 
        onPress = { this.signIn }
        style = { styles.loginButton}
      >
        
        <Text style = {styles.textLoginButton}>
          ENTRAR
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
    justifyContent: 'center',
  },
  containerTextInput: {

  },
  input: {

  },
  

});
