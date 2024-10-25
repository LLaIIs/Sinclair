import React, { useEffect, useState, useCallback} from 'react';
import { View, TextInput, Pressable, Alert, StyleSheet, SafeAreaView, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [theme, setTheme] = useState('light');
  const router = useRouter();
 


 
  useFocusEffect(
    useCallback(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          if (!storedToken) {
            setIsLoggedIn(false); // Se o token não existir, setar como false
            setToken(storedToken);
            console.log('Token não encontrado');
          } else {
            setToken(storedToken);
            setIsLoggedIn(true); // Se o token existir, setar como valor do token
           // Chama fetchFavorites assim que o token é encontrado
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
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme); // Define o tema com o valor armazenado
      }
    } catch (error) {
      console.error('Erro ao carregar o tema:', error);
    }
  };

  useEffect(() => {
    loadTheme(); // Carrega o tema quando o componente é montado
  }, []);


  useEffect(() => {
    if (isLoggedIn) {
      fetchSearchHistory();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (query.length > 2) {
      fetchPredictions(query);
    } else {
      setPredictions([]);
    }
  }, [query]);

  const fetchPredictions = async (input) => {
    try {
        const response = await axios.post(
            'https://places.googleapis.com/v1/places:autocomplete',
            {
                input: input,
                languageCode: 'pt-BR',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                },
            }
        );

        // Filtrar as previsões para obter as mais conhecidas
        const suggestions = response.data.suggestions
            .filter(suggestion => suggestion.placePrediction || suggestion.queryPrediction)
            .map(suggestion => ({
                place_id: suggestion.placePrediction?.placeId || null,
                description: suggestion.placePrediction?.text.text || suggestion.queryPrediction?.text.text,
            }))
            .slice(0, 5); 

        setPredictions(suggestions);
    } catch (error) {
        console.error('Erro ao obter previsões:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao obter previsões.');
    }
};


  const getCoordinatesFromPlaceId = async (placeId) => {
    try {
      const response = await axios.get(`https://places.googleapis.com/v1/places/${placeId}?languageCode=pt-BR`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'location',
        },
      });
  
      const { location } = response.data;
      
      return { lat:location.latitude, lng:location.longitude }; 
    } catch (error) {
      console.error('Erro ao obter as coordenadas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao obter as coordenadas.');
      throw error;
    }
  };
  
  const fetchPlacesByText = async (placeId, description) => {
    try {
      const { lat, lng } = await getCoordinatesFromPlaceId(placeId); // Obtém as coordenadas usando o place_id da previsão
      if(isLoggedIn){
      await saveSearchHistory(description, placeId); 
      }// Salva no histórico de pesquisas **apenas quando a pesquisa for confirmada**
      
      router.push({
        pathname: '/explore',
        params: {
          searchQuery: description,
          lat,
          lng,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar lugares por texto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os lugares.');
    }
  };

  const saveSearchHistory = async (query, placeId) => {
    if (!isLoggedIn) return; 

    try {
      await axios.post('http://192.168.0.8:3000/search-history/add', { query, place_id: placeId }, {
        headers: {
          'x-auth-token': token, 
        },
      });
      fetchSearchHistory(); // Atualiza o histórico
    } catch (error) {
      if (error.response?.status !== 400) {
        console.error('Erro ao salvar o histórico de pesquisas:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o histórico.');
      }
    }
  };

  const fetchSearchHistory = async () => {
    if (!isLoggedIn) return; // Não busca histórico se o usuário não estiver logado

    try {
      const response = await axios.get('http://192.168.0.8:3000/search-history/get',{
        headers: {
            'x-auth-token': token,
        }});
      setSearchHistory(response.data);
    } catch (error) {
      console.error('Erro ao recuperar o histórico de pesquisas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao recuperar o histórico.');
    }
  };

  const deleteSearchHistory = async () => {
    if (!isLoggedIn) return; // Não exclui histórico se o usuário não estiver logado

    try {
      await axios.delete('http://192.168.0.8:3000/search-history/delete',{
        headers: {
            'x-auth-token': token,
        }});
      setSearchHistory([]); // Limpa o estado de histórico após exclusão
      Alert.alert('Histórico excluído', 'O histórico de pesquisas foi excluído.');
    } catch (error) {
      console.error('Erro ao excluir o histórico de pesquisas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir o histórico.');
    }
  };

  const handlePredictionPress = async (prediction) => {
    setQuery(prediction.description);
    await fetchPlacesByText(prediction.place_id, prediction.description);
  };

  const renderHistoryItem = ({ item }) => (
    <Pressable onPress={() => {
      setQuery(item.query);
      fetchPlacesByText(item.place_id, item.query);
    }} style={styles.historyItem}>
     <Ionicons name="location-outline" size={20} color={theme === 'dark' ? 'white' : 'black'} style={styles.icon} />
     <Text style={[styles.historyText, { color: theme === 'dark' ? 'white' : 'black' }]}>{item.query}</Text>
    </Pressable>
  );

  const renderPredictionItem = ({ item }) => (
    <Pressable onPress={() => handlePredictionPress(item)} style={styles.suggestionItem}>
      <Ionicons name="location" size={20} color="#84d679" style={styles.icon} />
      <Text style={[styles.historyText, theme==='dark'?  styles.darkText : styles.lightText]}>{item.description}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Ionicons name='arrow-back' size={25} color={theme === 'dark' ? 'white' : 'black'} />
        </Pressable>
        <View style={styles.inputContainer}>
          <TextInput
            value={query}
            placeholder="Qual o seu destino?"
            placeholderTextColor={theme === 'dark' ? "#cccccc" : "#949494"}
            onChangeText={(text) => setQuery(text)}
            style={[styles.input, theme === 'dark' ? styles.darkInput : styles.lightInput]}
            returnKeyType='search'
            onSubmitEditing={() => fetchPlacesByText(predictions[0]?.place_id, predictions[0]?.description)}
          />
        </View>
      </View>

      <View style={styles.historyContainer}>
        <FlatList
          data={predictions}
          renderItem={renderPredictionItem}
          keyExtractor={(item) => item.place_id}
          keyboardShouldPersistTaps='always'
        />
        <Text style={[styles.sectionTitle, theme === 'dark' ? styles.darkText : styles.lightText]}> Buscas recentes</Text>
        
        <FlatList
          data={searchHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item._id}
        />

        <Pressable onPress={deleteSearchHistory} style={styles.deleteButton}>
          <Text style={[styles.deleteButtonText,{color: theme==='dark'?'white':'black'}]}>Excluir Histórico</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#333333',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    marginLeft: 10,
  },
  darkInput: {
    backgroundColor: '#333333',
    borderRadius:20,
    color: 'white',
  },
  lightInput: {
    backgroundColor: 'white',
    color: 'black',
  },
  historyContainer: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 16,
    marginLeft: 10, 
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  icon: {
    marginRight: 10, 
  },
  deleteButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 17.5,
    marginTop: 20,
  },
});


export default Search;
