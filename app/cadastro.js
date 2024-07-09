import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, TextInput, TouchableOpacity, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const router = useRouter();
const CadastroScreen = () => {

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUp = () => {
    // Adicione a lógica de cadastro aqui
    alert('Cadastro realizado com sucesso!');
    router.push('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Ionicons name="chevron-back" size={34} color="#363636" />
      </Pressable>

      <Text style={styles.title}>Cadastre-se</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de nascimento"
        keyboardType="numeric"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          secureTextEntry={!isPasswordVisible}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        Ao clicar em Concordar e Continuar, eu concordo com os Termos de Serviço, e reconheço nossa Política de Privacidade.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Concordar e Continuar</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'start',
    padding: 10,
    paddingLeft: 0,
  },
  title: {
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#61DBFB',
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CadastroScreen;
