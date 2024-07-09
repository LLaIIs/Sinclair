import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable} from "react-native";
import {useRouter} from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
const router = useRouter();

const PhoneNumberScreen = () => {
  const [country, setCountry] = useState("Brasil (+55)");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Brasil (+55)', value: 'Brasil (+55)' },
    { label: 'África do Sul (+27)', value: 'África do Sul (+27)' },
    { label: 'Japão (+81)', value: 'Japão (+81)' },
    { label: 'Estados Unidos (+1)', value: 'Estados Unidos (+1)' },
    // Adicionar os outros números
  ]);

  const handleContinue = () => {
    router.push('/login3');
    console.log(`País: ${country}, Número de Telefone: ${phoneNumber}`);
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

      <Text style={styles.title}>Insira o seu número</Text>
      <DropDownPicker
        open={open}
        value={country}
        items={items}
        setOpen={setOpen}
        setValue={setCountry}
        setItems={setItems}
        containerStyle={styles.dropdown}
        style={styles.dropdownInner}
        dropDownStyle={styles.dropdownInner}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de telefone"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
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
    justifyContent: "start",
    
    padding: 16,
  },
  backButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft:0,
  },
  title: {
    alignSelf:'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  input: {
    width:370,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  dropdown: {
    width:370,
    marginBottom: 16,
  },
  dropdownInner: {
    backgroundColor: '#fafafa',
    borderColor: '#ddd',
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

export default PhoneNumberScreen;
