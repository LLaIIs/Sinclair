import React, { useState } from 'react';
import {useRouter, Link} from 'expo-router';
import { View, Text, TextInput, Pressable,TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

   //Valida o email e passa para a proxima "página" com um parâmetro {email}
   const handleContinue = () => {
    //Verifica se foi preenchido
    if (!email) {
      setErrorMessage('E-mail é obrigatório!');
      return;
    }
    //requisição para o /login/checkEmail
    fetch('http://192.168.0.4:3000/login/checkEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //Converte os dados digitados para uma String JSON
      body: JSON.stringify({ email }),
    })
      .then(response => {
        //recebe do back end resposta em status HTTP e defini as mensagens de erro
        if (response.status === 400) {
          setErrorMessage('E-mail inválido!');
        } else if (response.status === 401) {
          setErrorMessage('Endereço de e-mail não cadastrado!');
        } else if (response.status === 200) {
          //Navegua para a proxima "página" com um parâmetro {email}
          router.push({
            pathname: '/login2',
            params: { email },
          });
          setErrorMessage(''); // Limpa qualquer mensagem de erro
        } else {
          setErrorMessage('Erro ao verificar o e-mail.');
        }
      })
      .catch(() => {
        setErrorMessage('Erro ao verificar o e-mail.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login ou crie uma conta</Text>
      <TextInput 
      placeholder="E-mail"
       style={styles.input}
       value={email}
       onChangeText={setEmail} />
         {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Pressable
        style={({pressed})=>[
          styles.button,
          {transform:[{scale:pressed?0.95:1}]}
        ]}
        onPress={handleContinue}
        >
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
        
      <Text style={styles.orText}>Ainda não tem conta? 
        <Link href="/cadastro" style={styles.linkText}> Cadastre-se</Link>
      </Text>
     
      {/* arrumar o style when pressed e as rotas */}
    
      {/* Por enquanto não iremos ultilizar essas telas
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => router.push('/login4')}
      >
        <Text style={styles.socialButtonText}>Continuar com telefone</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Continuar com Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Continuar com o Google</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:15,
    flex: 1,
    justifyContent: 'flex-start',//center
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
    width:370,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    width:370,
    backgroundColor:'#084D6E',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    height: 53
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  socialButtonText: {
    color: '#007bff',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop:-15,
    marginBottom: 10,
  },
});

export default LoginScreen;
