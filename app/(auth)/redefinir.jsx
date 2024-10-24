import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';

const Redefinir = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaSegura, setSenhaSegura] = useState(true);
  const [confirmarSenhaSegura, setConfirmarSenhaSegura] = useState(true);
  const [errors, setErrors] = useState({
    novaSenha: '',
    confirmarSenha: ''
  });
  const { token } = useLocalSearchParams();
  const router = useRouter();

  const handleResetPassword = async () => {
    // Limpa os erros antes da nova tentativa
    setErrors({ novaSenha: '', confirmarSenha: '' });

    if (novaSenha !== confirmarSenha) {
      setErrors({ confirmarSenha: 'As senhas não são iguais.' });
      return;
    }

    try {
      const response = await fetch('http://192.168.0.8:3000/redefinirSenha/reseta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetaSenhaToken: token, novaSenha, confirmarSenha }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Senha redefinida com sucesso
        router.push('/login');
      } else if (response.status === 400) {
        // Exibe erros específicos da validação no backend
        setErrors(data.errors);
      } else {
        setErrors({ novaSenha: data.message });
      }
    } catch (error) {
      console.log('Erro ao redefinir a senha:', error);
      setErrors({ novaSenha: 'Erro de conexão com o servidor.' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
    

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite a nova senha"
          secureTextEntry={senhaSegura}
          value={novaSenha}
          onChangeText={setNovaSenha}
        />
        <TouchableOpacity onPress={() => setSenhaSegura(!senhaSegura)}>
          <Icon name={senhaSegura ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errors.novaSenha ? <Text style={styles.errorText}>{errors.novaSenha}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirme a nova senha"
          secureTextEntry={confirmarSenhaSegura}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity onPress={() => setConfirmarSenhaSegura(!confirmarSenhaSegura)}>
          <Icon name={confirmarSenhaSegura ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errors.confirmarSenha ? <Text style={styles.errorText}>{errors.confirmarSenha}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
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
    marginTop: 75,
    justifyContent: 'start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
    width: '100%',
  },
  input: {
    flex: 1,
  
  },
  button: {
    backgroundColor: '#37822C',
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
  },
});

export default Redefinir;
