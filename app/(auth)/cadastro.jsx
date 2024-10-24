import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, TextInput, TouchableOpacity, ScrollView, View, Alert} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CadastroScreen = () => {

  const [nomeCompleto, setNomeCompleto] = useState('');
  // const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  //Olho magico
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  //Armazenar mensagens de erro
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: '',
  });
  const router = useRouter();

  const handleSignUp = async () => {
    //Resetando mensagens de erro
    setErrors({
      nome:'',
      email:'',
      senha:'',
    })

  
   
    try{
      //Faz uma requisição para o /cadastrar na api (back-end)
      const response = await fetch('http://192.168.0.8:3000/cadastrar',{
        method:'POST',
        headers:{
          'Content-type': 'application/json'
        },
        //converte os dados digitados para uma string JSON
        body:JSON.stringify({nome:nomeCompleto,email,senha})
      })
      //Converte a resposta do servidor que esta em JSON em Obj JS
      const data = await response.json();
      if(response.status === 201){
        router.push('/login')
    
      }else if (response.status === 400){
        //Se for retornado um HTTP 400 definir as mensagens do objeto errors
        setErrors(data.errors)
      }else{
        Alert.alert('Erro',data.error);
        console.log(data +'erro')
      }
    }catch(error){
      Alert.alert('Erro','Não foi possível realizar o cadastro.');
      console.log('erro do catch '+error)
    }

  };

  return (
    <ScrollView contentContainerStyle={styles.container}   keyboardShouldPersistTaps='always' >
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
      {errors.nome? <Text style={styles.errorText}>{errors.nome}</Text>:null}
      {/*Por enquanto não vejo nescessidade de um campo de data de nascimento
       <TextInput
        style={styles.input}
        placeholder="Data de nascimento"
        keyboardType="numeric"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email? <Text style={styles.errorText}>{errors.email}</Text>:null}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={senha}
          secureTextEntry={isPasswordVisible}
          onChangeText={setSenha}
        />
       <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off':'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errors.senha? <Text style={styles.errorText}>{errors.senha}</Text>:null}
      

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
    marginBottom: 25,
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
  
  button: {
    backgroundColor: '#41B130',
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    marginTop:20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: -15,
    marginBottom:15,
    
  },
});

export default CadastroScreen;