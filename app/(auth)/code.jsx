import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Code = () => {
  const [codigo, setCodigo] = useState('');
  const router = useRouter();
  const { email } = useLocalSearchParams(); 

  // Função para verificar o código
  const handleCodeSubmit = async () => {
    try {
      const response = await fetch('http://192.168.0.8:3000/redefinirSenha/VerificaCodigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetaSenhaToken: codigo }),
      });

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Código válido, você pode redefinir sua senha');
        router.push(`/redefinir?token=${codigo}`); // Navega para a tela de redefinição
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      console.log('Erro ao verificar o código:', error);
      Alert.alert('Erro', 'Falha ao verificar o código.');
    }
  };

  // Função para reenviar o código
  const handleResendCode = async () => {
    try {
      const response = await fetch('http://192.168.0.8:3000/redefinirSenha/requere', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Código reenviado com sucesso.');
      } else {
        Alert.alert('Erro', 'Falha ao reenviar o código.');
      }
    } catch (error) {
      console.log('Erro ao reenviar o código:', error);
      Alert.alert('Erro', 'Falha ao reenviar o código.');
    }
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
      </Pressable>
      <Text style={styles.title}>Insira o código</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCodigo}
        value={codigo}
        placeholder="Digite o código"
        keyboardType="numeric" // Apenas números
      />
      <Pressable style={styles.button} onPress={handleCodeSubmit}>
        <Text style={styles.buttonText}>Verificar Código</Text>
      </Pressable>

      {/* Link para reenviar o código com efeito de opacidade ao pressionar */}
      <Pressable 
        onPress={handleResendCode}
        style={({ pressed }) => [
          styles.resendContainer,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Text style={styles.resendText}>Reenviar código</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
    position: 'relative', 
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60, 
    marginBottom: 60,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#37822C',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: '#084D6E',
    textDecorationLine: 'underline',
  },
});

export default Code;
