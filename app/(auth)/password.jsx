import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, TextInput, Pressable, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Password = () => {
  const router = useRouter();

  const {email} = useLocalSearchParams();
  const [senha, setSenha] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 

  

  //Realiza o login e define as mensagens de erro
  const handleLogin = async ()  => {
    setErrorMessage(''); //Limpa qualquer mensagem de erro anterior
    try{
      //requisição para /login
      const response = await fetch('http://192.168.0.8:3000/login',{
        method:'POST',
        headers:{
          'Content-type':'application/json'
        },
        //Converte os dados digitados para uma String  JSON
        body:JSON.stringify({email,senha})
      })
      //Converte a resposta que esta em JSON em Obj JS
      const data = await response.json();
      if(response.status ===200){
        await AsyncStorage.setItem('token',data.token)//Armazena o token JWT
        router.push('/explore')
      }else if(response.status ===401){
        //Se for retornado status 401 definir mensagem de erro
        setErrorMessage('Senha Incorreta. Tente novamente')
        
      }else{
        console.log('Erro :',data.error)
      }
    }catch(error){
      Alert.alert('Erro','Não foi possível logar')
      console.log('erro:', error)
    }
  };


  //Manda um email com um codigo de redefinição de senha
  const handleSendCode = async () =>{
    try{
      //requisição para o redefinirSenha/requere
      const response = await fetch('http://172.15.5.92:3000/redefinirSenha/requere',{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      //Converte os dados digitados para uma String JSON
      body:JSON.stringify({email})
    })
    const data = await response.json()
    if(response.status ===200){
      
      Alert.alert('Sucesso',`Enviamos um código para redefinir sua senha para ${email}`);
      router.push(`/code?email=${email}`);
    }else if(response.status === 401){
      console.log('usuario nao encontrado')
    }else{
      console.log('error', data.error)
    }

    }catch(error){
      Alert.alert('Erro', 'Não foi possivel enviar o email')
      console.log('erro',error)
    }
  }

  return (
    <View style={styles.container}>
   
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Ionicons name="chevron-back" size={34} color="#363636" />
        <Text>{email}</Text>
      </Pressable>
      
      <Text style={styles.title}>Insira sua senha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setSenha}
          value={senha}
          secureTextEntry={!isPasswordVisible}
          placeholder="Senha"
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      
      <TouchableOpacity onPress={handleSendCode}>
        <Text style={styles.linkText}>Esqueci a senha</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 20, // Ajuste conforme necessário
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 30,
    borderRadius: 10,
    width: 370,
    height: 53,
  },
  input: {
    flex: 1,
    
  },
  button: {
    width: 370,
    backgroundColor: '#37822C',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    height: 53,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#084D6E',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginTop: -15,
    marginBottom: 10,
  },
});

export default Password;
