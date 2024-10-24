import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Button, FlatList, Text, StyleSheet, SafeAreaView, Pressable, TextInput, Modal } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Octicons } from '@expo/vector-icons';
import NotLogged from '../../components/NotLogged';

const Dicas = () => {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null); // Chat que está sendo editado
  const [newChatName, setNewChatName] = useState(''); // Nome novo do chat
  const [isModalVisible, setIsModalVisible] = useState(false); // Controle do modal
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  const router = useRouter();

  
  useFocusEffect(
    useCallback(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (!storedToken) {
                    setIsLoggedIn(false); // Se o token não existir, setar como false
                    setToken(storedToken)
                    console.log('Token não encontrado');
                } else {
                    setToken(storedToken)
                    setIsLoggedIn(true); // Se o token existir, setar como valor do token
                    fetchChatList // Chama fetchFavorites assim que o token é encontrado
                }
            } catch (error) {
                console.error('Erro ao recuperar o token:', error);
                setToken(false); // Em caso de erro, também setar como false
            }
        };

        fetchToken();
    }, [])
);
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
  

useFocusEffect(
    useCallback(() => {
        if (token) {
            fetchChatList();
        }
    }, [token])
);
  

  const fetchChatList = async () => {
    try {
      const response = await axios.get('http://192.168.0.8:3000/chat/get-chats', {
        headers: { 'x-auth-token': token }
      });
      setChatList(response.data); // Assume que a resposta é uma lista de chats
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    }
  };

  const createChat = async () => {
    try {
      const response = await axios.post('http://192.168.0.8:3000/chat/create-chat', {}, {
        headers: { 'x-auth-token': token }
      });
      fetchChatList(); // Atualiza a lista de chats após criar um novo chat
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`http://192.168.0.8:3000/chat/delete-chat/${chatId}`, {
        headers: { 'x-auth-token': token }
      });
      fetchChatList(); // Atualiza a lista de chats após deletar
    } catch (error) {
      console.error('Erro ao deletar chat:', error);
    }
  };

  const updateChatName = async (chatId, newName) => {
    try {
      await axios.patch(`http://192.168.0.8:3000/chat/update-chat-name/${chatId}`, { name: newName }, {
        headers: { 'x-auth-token': token }
      });
      fetchChatList(); // Atualiza a lista de chats após alterar o nome
      setEditingChatId(null); // Sair do modo de edição
    } catch (error) {
      console.error('Erro ao atualizar nome do chat:', error);
    }
  };

  const handleChatPress = (chatId) => {
    router.push({
      pathname: '/chats',
      params: {
        chatSessionId: chatId
      }
    });
  };

  const handleEditPress = (chatId, currentName) => {
    setEditingChatId(chatId);
    setNewChatName(currentName);
  };

  const handleAddChatPress = () => {
    if (!token) {
      setIsModalVisible(true); // Mostrar modal se não estiver logado
    } else {
      createChat(); // Criar chat se estiver logado
    }
  };

  


  const renderChatItem = ({ item }) => (
    <Pressable
      onPress={() => handleChatPress(item.chatSessionId)}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
    >
      <View style={styles.chatItem}>
        {editingChatId === item.chatSessionId ? (
          <TextInput
            style={styles.chatItemTextInput}
            value={newChatName}
            onChangeText={setNewChatName}
            onSubmitEditing={() => updateChatName(item.chatSessionId, newChatName)}
            autoFocus
          />
        ) : (
          <Text style={styles.chatItemText}>{item.name || `Chat ${item.chatSessionId}`}</Text>
        )}

        {editingChatId === item.chatSessionId ? (
          <Pressable
            onPress={() => updateChatName(item.chatSessionId, newChatName)}
            style={styles.saveButton}
          >
            <Ionicons name='checkmark' size={24} color='green' />
          </Pressable>
        ) : (
          <Pressable onPress={() => handleEditPress(item.chatSessionId, item.name)}>
            <Ionicons name='pencil' size={24} color='black' />
          </Pressable>
        )}

        <Pressable
          onPress={() => deleteChat(item.chatSessionId)}
          style={({ pressed }) => [styles.delete, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
        >
          <Octicons name='trash' size={24} color='black' />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowIcons}>
      <Pressable
        onPress={handleAddChatPress}
        style={({ pressed }) => [styles.add, { transform: [{ scale: pressed ? 0.85 : 1 }] }]}
      >
        <Ionicons name='add' size={30} color='white' />
      </Pressable>
      <Pressable onPress={() => setIsInfoModalVisible(true)} >
        <Ionicons name='information-circle' size={40} color={'grey'} style={{marginTop: 30,}}/>
      </Pressable>
      </View>
      {!isLoggedIn?(
         <NotLogged title='' text='Acesse sua conta para visualizar os chats' buttonStyle={{ width: '37%', alignSelf: 'flex-start' }}  containerStyle={{flex:1, padding: 50,paddingTop:20, backgroundColor: theme === 'dark' ? '#333333' : '#ffffff' }} theme={theme}/>
      ):(
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.chatSessionId}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatListContainer}
      />)}
    
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Você precisa fazer login para criar um chat.</Text>
           
            <View style={styles.buttonRow}>
              <Pressable 
                onPress={() => router.push('/login')} 
                style={({ pressed }) => [styles.closeModal, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
              >
                <Text style={styles.textCloseModal}>Fazer login</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => setIsModalVisible(false)} 
                style={({ pressed }) => [styles.closeModal, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
              >
                <Text style={styles.textCloseModal}>Fechar</Text>
              </Pressable>
            </View>
          
          </View>
        </View>
      </Modal>
       {/* Modal de Informação */}
       <Modal
        transparent={true}
        visible={isInfoModalVisible}
        animationType="slide"
        onRequestClose={() => setIsInfoModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
         
            <Text style={styles.modalText}>  <Ionicons name='information-circle' size={27} color={'grey'} />  Crie chats para pedir sugestões de lugares para explorar.</Text>
            
            <Pressable
              onPress={() => setIsInfoModalVisible(false)}
              style={({ pressed }) => [styles.closeModal, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
              <Text style={styles.textCloseModal}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatListContainer: {
    paddingBottom: 16,
  },
  chatItem: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatItemText: {
    fontSize: 18,
    flex: 1,
  },
  chatItemTextInput: {
    fontSize: 18,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
  delete: {
    padding: 10,
  },
  add: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 20,
    margin: 20,
  },
  saveButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
   
  },
  modalContent: {
    
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom:190
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 20, 
  },
  closeModal: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 5
  },
  textCloseModal:{
    color:'white',
    fontSize:16

  },
  rowIcons:{
    flexDirection: 'row', 
    
  }
});

export default Dicas;
