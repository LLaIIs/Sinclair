import React, { useState } from 'react';
import { useRouter} from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity } from 'react-native';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    // Verifica se o e-mail foi preenchido
    if (!email) {
      setErrorMessage('E-mail é obrigatório!');
      return;
    }

    // Requisição para o /login/checkEmail
    fetch('http://192.168.0.8:3000/login/checkEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(response => response.json())
      .then(data => {
        // Verifica a resposta do backend
        if (data.message === 'E-mail encontrado!') {
          // Navega para a próxima tela com o e-mail como parâmetro
          router.push({
            pathname: '/password',
            params: { email },
          });
          setErrorMessage(''); // Limpa qualquer mensagem de erro
        } else {
          // Exibe mensagens de erro baseadas na resposta
          setErrorMessage(data.message || 'Erro ao verificar o e-mail.');
        }
      })
      .catch(error => {
        setErrorMessage('Erro ao verificar o e-mail.');
        console.log(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login ou crie uma conta</Text>
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    
      <View  style={styles.row}> 
        <Text style={styles.orText}>Ainda não tem conta? </Text>
      <TouchableOpacity onPress={()=>{router.push('/cadastro')}}>
        <Text style={styles.linkText}>Cadastre-se</Text>
      </TouchableOpacity>
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 70,
    textAlign: 'center',
  },
  input: {
    width: 370,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    width: 370,
    backgroundColor: '#37822C',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    height: 53
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  // orText: {
  //   textAlign: 'center',
  //   marginBottom: 20,
  //   color: '#555',
  // },
  linkText: {
    color: '#084D6E',
    textDecorationLine: 'underline',
  },
  
  errorText: {
    color: 'red',
    marginTop: -15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 20,
  },
  row:{
    flexDirection: 'row',
  }
});

export default LoginScreen;
