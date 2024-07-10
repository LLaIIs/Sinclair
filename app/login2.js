import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, TextInput, Pressable, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Login2Screen = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // Adicione a lógica de autenticação da senha
  };

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
        <Text>E-mail</Text>
      </Pressable>
      
      <Text style={styles.title}>Insira sua senha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
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
      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          styles.button,
          { transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      <TouchableOpacity>
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
    borderRadius: 5,
    width: 370,
    height: 53,
  },
  input: {
    flex: 1,
  },
  button: {
    width: 370,
    backgroundColor: '#084D6E',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    height: 53,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default Login2Screen;
