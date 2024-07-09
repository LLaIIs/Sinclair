import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import {useRouter} from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
const router = useRouter();
const RedefinirScreen = () => {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaSegura, setSenhaSegura] = useState(true);
  const [confirmarSenhaSegura, setConfirmarSenhaSegura] = useState(true);

  const handleResetPassword = () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas são diferentes');
      return;
    }
    // Lógica para redefinir a senha
    Alert.alert('Sucesso', 'Senha redefinida com sucesso!');
    router.push('/login');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Redefinir senha</Text>
      <Text style={styles.instructions} >A senha precisa ter pelo menos oito caracteres e conter um número ou símbolo</Text>
     
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite a senha"
          secureTextEntry={senhaSegura}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setSenhaSegura(!senhaSegura)}>
          <Icon
            name={senhaSegura ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          secureTextEntry={confirmarSenhaSegura}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity onPress={() => setConfirmarSenhaSegura(!confirmarSenhaSegura)}>
          <Icon
            name={confirmarSenhaSegura ? 'eye' : 'eye-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <Pressable
        style={({pressed})=>[
          styles.button,
          {transform:[{scale:pressed?0.95:1}]}
        ]}
        onPress={handleResetPassword}
        >
        <Text style={styles.buttonText}>Redefinir Senha</Text>
      </Pressable>
    
        
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:75,
    justifyContent: 'start',
    alignItems:'center',
    paddingHorizontal: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom:20
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap:50,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 30,
    borderRadius: 5,
    width: '100%',
  },
  input: {
    flex: 1,
  },
  button: {
    backgroundColor: '#084D6E',
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RedefinirScreen;
