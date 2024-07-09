import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import {useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const router = useRouter();
const Login3Screen = () => {
  const [code, setCode] = useState('');

  const handleContinue = () => {
    // Adicione a lógica a seguir após a pessoa colocar o código
    console.log('Código inserido:', code);
  };

  const resendCode = () => {
    // Lógica para re-enviar o código
    console.log('Código enviado novamente...');
  };

  return (
    <View style={styles.container}>
        <Pressable
      onPress={()=> router.back()}

      style={({ pressed }) => [
        styles.backButton,
        { opacity: pressed ? 0.7 : 1 }  
      ]}
      >
      {/* arrow-back */}
      <Ionicons name="chevron-back" size={34} color="#363636"/> 
      </Pressable>
      <Text style={styles.title}>Confirme o seu número</Text>
      <Text style={styles.subtitle}>Insira o código que enviamos por SMS para (número)</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        placeholder="-  -  -  -"
      />
      <Text style={styles.resendText}>Não recebeu o código? <Text style={styles.resendLink} onPress={resendCode}>Enviar novamente.</Text></Text>
      <Pressable
      onPress={handleContinue}
        style={({pressed})=>[
          styles.button,
          {transform:[{scale:pressed?0.95:1}]}
        ]}

        >
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resendText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login3Screen;
