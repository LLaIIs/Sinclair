import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




const ProfileScreen = () => {
    const router = useRouter()
    const {token} = useLocalSearchParams();
    const [userName, setUserName]= useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserName, setEditedUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [editedUserEmail, setEditedUserEmail] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [theme, setTheme] = useState('light');


  
    useEffect(() => {
      console.log('ProfileScreen token', token)
      if (token) {
        
        fetchUserName(token);
        fetchUserEmail(token);
      }
    }, [token]);
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
          setTheme(storedTheme || 'light');
       
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
  
    useEffect(() => {
     
      loadTheme(); 
    }, []);
  
    const fetchUserName = async (token) => {
      try {
        const response = await axios.get('http://192.168.0.8:3000/profile/user', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
  
        const name = response.data.name || 'Nome não disponível';
        setUserName(name);
        setEditedUserName(name);
      } catch (error) {
        console.error('Erro ao buscar o nome do usuário:', error.response ? error.response.data.message : error.message);
      }
    };
    const fetchUserEmail = async (token) => {
      try {
        const response = await axios.get('http://192.168.0.8:3000/profile/email', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
    
        const email = response.data.email || 'Email não disponível';
        setUserEmail(email);
        setEditedUserEmail(email);
      } catch (error) {
        console.error('Erro ao buscar o email do usuário:', error.response ? error.response.data.message : error.message);
      }
    };
    



    const handleSaveUserName = async () => {
     
      try {
          const response = await axios.put('http://192.168.0.8:3000/profile/updateNome', 
          { nome: editedUserName }, 
          {
              headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token,
              },
          });

          setUserName(editedUserName); // Atualiza o nome na UI
          setIsEditing(false); // Desabilita o modo de edição
      } catch (error) {
          console.error('Erro ao salvar o nome do usuário:', error.response ? error.response.data.message : error.message);
      }
  };
  const handleSaveUserEmail = async () => {
    try {
      const response = await axios.put('http://192.168.0.8:3000/profile/updateEmail', 
      { email: editedUserEmail }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
  
      setUserEmail(editedUserEmail); // Atualiza o email na UI
      setIsEditingEmail(false); // Desabilita o modo de edição
    } catch (error) {
      console.error('Erro ao salvar o email do usuário:', error.response ? error.response.data.message : error.message);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333333' : '#fff' }]}>
        <Pressable
            style={({ pressed }) => [styles.iconLeft, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => router.push('/userConfig')}>
            <Ionicons name="chevron-back" size={34} color={theme === 'dark' ? 'white' : "#363636"} />
        </Pressable>
        {/* Imagem de perfil e nome de usuário */}
        <View style={styles.profileContainer}>
            <Text style={[styles.username, { color: theme === 'dark' ? 'white' : '#000' }]}>{userName}</Text>
        </View>
        {/* Informações pessoais */}
        <Text style={[styles.sectionHeader, { color: theme === 'dark' ? 'white' : '#000' }]}>Informações pessoais</Text>
        {/* Campo de Nome */}
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme === 'dark' ? 'white' : '#000' }]}>Nome</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, { color: theme === 'dark' ? 'white' : '#000' }]} 
                    value={editedUserName}
                    onChangeText={setEditedUserName}
                    placeholder={userName}
                    editable={isEditing}
                    placeholderTextColor={theme === 'dark' ? '#a1a1a1' : '#777777'}
                />
                <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditing(!isEditing)}>
                    <Ionicons name={isEditing ? "checkmark-outline" : "pencil-outline"} size={24} color={theme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>
            {isEditing && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveUserName}>
                    <Text style={[styles.saveButtonText,{ color: theme === 'dark' ? 'white' : '#000' } ]}>Salvar</Text>
                </TouchableOpacity>
            )}
        </View>
        {/* Campo de Email */}
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme === 'dark' ? 'white' : '#000' }]}>Email</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, { color: theme === 'dark' ? 'white' : '#000' }]}
                    value={editedUserEmail} 
                    onChangeText={setEditedUserEmail}
                    editable={isEditingEmail}
                    placeholder={userEmail} 
                    placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
                />
                <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditingEmail(!isEditingEmail)}>
                    <Ionicons name={isEditingEmail ? "checkmark-outline" : "pencil-outline"} size={24} color={theme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>
            {isEditingEmail && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveUserEmail}>
                    <Text style={[styles.saveButtonText,{ color: theme === 'dark' ? 'white' : '#000' } ]}>Salvar</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
);
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    iconLeft: {
      borderRadius: 50,
      padding: 4,
    },
    username: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 5,
    },
    editIcon: {
      marginLeft: 10,
    },
  });
  
  export default ProfileScreen;