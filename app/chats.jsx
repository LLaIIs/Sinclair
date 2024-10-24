import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Pressable, Text } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import Loading from '../components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';


const ChatS = () => {
  const { chatSessionId } = useLocalSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        console.log('Token não encontrado');
      } else {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://192.168.0.8:3000/chat/get-messages/${chatSessionId}`, {
        headers: { 'x-auth-token': token }
      });
      const formattedMessages = response.data.messages.reverse().map(msg => ({
        _id: msg.id,
        text: msg.text,
        user: {
          _id: msg.sender === 'User' ? 1 : 2,
          name: msg.sender === 'User' ? 'Você' : 'ChatGPT',
        },
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };
 
  useEffect(() => {
    fetchToken();
    if (token) {
      fetchMessages();
    }
  }, [token, chatSessionId]);

  const extractedJson = (message) => {
    try {
      // Procurar por um JSON na mensagem
      const jsonString = message.match(/\{[^]*?\}|\[[^]*?\]/); // Captura o primeiro {} ou []
    
      if (jsonString) {
      
        const parsedData = JSON.parse(jsonString[0]);
    
        // Verifica se o resultado é um array ou um objeto
        return Array.isArray(parsedData) ? parsedData : [parsedData]; // Retorna sempre um array
      }
      return null;
    } catch (error) {
      console.error('Erro ao extrair JSON da mensagem:', error);
      return null;
    }
  };
  
  
  
  const sendMessage = async (message) => {
    // Limpar o campo de input imediatamente
    setInputMessage('');
    setIsLoading(true);

    // Adicionar a nova mensagem do usuário às mensagens
    const newUserMessage = {
      _id: Date.now(),
      text: message,
      user: {
        _id: 1,
        name: 'Você',
      },
    };

    setMessages((prevMessages) => GiftedChat.append(prevMessages, [newUserMessage]));

    try {
      const chatGPTResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um assistente especializado em sugerir lugares turísticos com base nos interesses do usuário. Retorne sugestões em texto e explique os lugares dando algumas informações extras' 
          },
          { 
            role: 'user', 
            content: `Sugira lugares turísticos com base no seguinte pedido: ${message}` 
          }
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPEN_AI_API_KEY}`
        }
      });

      let chatGPTMessage = chatGPTResponse.data.choices[0].message.content;
      console.log('Resposta completa do ChatGPT:', chatGPTMessage);
      const jsonData = extractedJson(chatGPTMessage);

      if (jsonData) {
        console.log('JSON de localização', jsonData);
      

        chatGPTMessage = chatGPTMessage.replace(/\{[^]*?\}|\[[^]*?\]/, '').trim();
      }
   
      // Salvar mensagens do usuário e do ChatGPT no backend
      await saveMessageToBackend(message, 'User');
      await saveMessageToBackend(chatGPTMessage, 'ChatGPT');

      const newChatGPTMessage = {
        _id: Date.now() + 1, // Garantindo ID único
        text: chatGPTMessage,
        user: {
          _id: 2, // ID do ChatGPT
          name: 'ChatGPT',
        },
      };

      // Atualizando as mensagens
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [newChatGPTMessage]));

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
    } finally {
      setIsLoading(false); // Para o carregamento
    }
  };

  const saveMessageToBackend = async (message, sender) => {
    try {
      await axios.post('http://192.168.0.8:3000/chat/save-message', {
        chatSessionId,
        message,
        sender
      }, {
        headers: { 'x-auth-token': token }
      });
    } catch (error) {
      console.error('Erro ao salvar a mensagem no backend:', error);
    }
  };

  const handleSendMessage = (newMessages) => {
    if (newMessages.length > 0) {
      const userMessage = newMessages[0]; // Pegando a nova mensagem enviada pelo usuário
      sendMessage(userMessage.text);
    }
  };

  const renderBubble = (props) => {
    const { currentMessage } = props;
    return (
      <View style={[currentMessage.user._id === 1 ? styles.userMessage : styles.chatGPTMessage]}>
        <Text>{currentMessage.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={({ pressed }) => [styles.back, { transform: [{ scale: pressed ? 0.95 : 1 }] }]} onPress={() => router.push('/dicas')}>
        <Ionicons name='arrow-back' color='black' size={30} />
      </Pressable>
     
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        user={{
          _id: 1,
          name: 'Você',
        }}
        isLoadingEarlier={isLoading}
        renderAvatar={() => null}
        onSend={handleSendMessage}
        renderInputToolbar={(props) => (
          <View>
             {isLoading && <Loading  />}
            {/* <Pressable onPress={()=>{
              console.log('jsonDataLocal', jsonLocal)
              router.push({
              pathname:'/explore',
              params:{jsonData: JSON.stringify(jsonLocal)}
            })}}
             style={styles.explore}>
              <Ionicons name='compass' size={30} color='black'/>
              <Text> Ver lugares</Text>
            </Pressable> */}
          <View style={styles.inputContainer}>
            
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Digite sua mensagem..."
            />
            <Pressable
              onPress={() => handleSendMessage([{ text: inputMessage, user: { _id: 1 } }])}
              disabled={!inputMessage.trim() || isLoading}
              style={({ pressed }) => [
                styles.button,
                !inputMessage.trim() || isLoading ? styles.disabledButton : {},
                pressed && !(!inputMessage.trim() || isLoading) && { opacity: 0.5 },
              ]}
            >
              <Ionicons name="send" color="black" size={23} />
            </Pressable>
          </View>
          
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  back: {
    marginLeft: 20,
    marginTop: 20,
    width: 40,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 15,
    margin: 5,
    padding: 10,
    maxWidth: '80%',
    marginRight: 20,
  },
  chatGPTMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#0047ab5a', 
    borderRadius: 15,
    margin: 5,
    padding: 10,
    maxWidth: '80%',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#0084ff',
    borderRadius: 20,
    padding: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  explore:{
    flexDirection: 'row',
   
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#cfcfcff4',
    width:140, 
    height: 50,
    borderRadius:20,
    position:'absolute',
    right:260,
    bottom:80,
    
  }
});

export default ChatS;