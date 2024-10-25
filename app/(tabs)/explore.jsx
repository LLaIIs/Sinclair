import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrollPlaces from '../../components/ScrollPlaces';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SearchInputShell from '../../components/SearchInputShell';
import Loading from '../../components/Loading';
import FavoriteButton from '../../components/FavoriteButton';




const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const {searchQuery, lat, lng} = useLocalSearchParams();
  const [theme, setTheme] = useState('light');

  const router = useRouter();

 
 
  
 useFocusEffect(
  React.useCallback(() => {
    const fetchTokenAndTheme= async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedTheme = await AsyncStorage.getItem('theme');
        setTheme(storedTheme || 'light');
        if (!storedToken) {
          setToken(false);  // Se o token não existir, setar como false
          console.log('Token não encontrado');
        } else {
          setToken(storedToken);  // Se o token existir, setar como valor do token
        }   
      } catch (error) {
        console.error('Erro ao recuperar o token:', error);
        setToken(false);  // Em caso de erro, também setar como false
      }
    };

    const fetchNearbyPlaces = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          'https://places.googleapis.com/v1/places:searchNearby',
          {
            includedTypes: [selectedCategory || 'tourist_attraction'],
            maxResultCount: 10,
            locationRestriction: {
              circle: {
                center: {
                  latitude: parseFloat(lat) || -23.55052, // Latitude
                  longitude: parseFloat(lng) || -46.633308, // Longitude
                },
                radius: 1000.0, // Raio de busca em metros
              },
            },
            languageCode: 'pt-BR',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos,places.id',
            },
          }
        );
        setPlaces(response.data.places); // Definir os dados de lugares recebidos
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar lugares:', error);
        setLoading(false);
      }
    };

    fetchTokenAndTheme();
    fetchNearbyPlaces();
  }, [selectedCategory, lat, lng])
);



  const renderItem = ({ item }) => {
    const photoUri = item.photos && item.photos[0]
      ? `https://places.googleapis.com/v1/${item.photos[0].name}/media?maxWidthPx=400&maxHeightPx=400&key=${GOOGLE_PLACES_API_KEY}`
      : 'https://via.placeholder.com/400';

      
    return (
      
      <Pressable
    
        style={styles.itemContainer}
        onPress={() => {
          console.log('place_id', item.id)
          router.push({
            pathname: '/details',
            params: {
              place_id: item.id,
              theme: theme
            },
          })}
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{uri:photoUri}}
            style={styles.image}
            resizeMode="cover"
          />
               <View style={styles.heartIconContainer}>
                    <FavoriteButton itemId={item.id} imageUrl={photoUri} title={item.displayName.text} style={styles.heartIcon} token={token} onFavoriteChange={()=>{}} />
                </View>
        </View>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>
        {item.displayName.text}
      </Text>
      <Text style={[styles.description, { color: theme === 'dark' ? '#ffffff' : '#555555' }]}>
        {item.formattedAddress || 'Endereço não disponível'}
      </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView   style={[styles.safeArea, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <SearchInputShell theme={theme}/>
    
      <ScrollPlaces setSelectedCategory={setSelectedCategory} theme={theme} />
      
      {loading ? (
        <Loading/>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          
        />
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
        
      }, 
    lightBackground: {
        backgroundColor: '#ffffff',
      },
    darkBackground: {
        backgroundColor: '#333333',
      },
    itemContainer: {
        padding:10,
        marginHorizontal: 20,
       
    },
    imageContainer: {
        position: 'relative',
      },
    image: {
        width: '100%',
        height: 270,
        borderRadius: 18, 
    }, 
    heartIconContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1, 
  },
    heartIcon: {
      position: 'absolute',
      top: 5,
      right: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.671)',
      borderRadius: 20,
      padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    flatListContent: {
        flexGrow: 1, 
        paddingBottom:20,
        marginTop:40
    }
})

export default Explore;