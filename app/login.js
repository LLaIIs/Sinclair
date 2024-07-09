import React from 'react';
import {useRouter} from 'expo-router';
import {Link} from 'expo-router';
import { View, Text, TextInput, Pressable,TouchableOpacity, StyleSheet } from 'react-native';
const router = useRouter();
const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login ou crie uma conta</Text>
      <TextInput placeholder="E-mail" style={styles.input} />
      
      <Pressable
        style={({pressed})=>[
          styles.button,
          {transform:[{scale:pressed?0.95:1}]}
        ]}
        onPress={() => router.push('/login2')}
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
});

export default LoginScreen;
