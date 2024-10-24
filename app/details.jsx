import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import Loading from '../components/Loading';
import OpeningHours from '../components/OpeningHours';
import FavoriteButton from '../components/FavoriteButton';



const Details = () => {
  const router = useRouter();
 
  const { place_id, theme} = useLocalSearchParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
 
 

  
  useFocusEffect(
    React.useCallback(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          if (!storedToken) {
            setToken(false);
            console.log('Token não encontrado');
          } else {
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Erro ao recuperar o token:', error);
          setToken(false);
        }
      };

      fetchToken();
    }, [])
  );

  useEffect(() => {
    if (place_id) {
      fetchPlaceDetails();
    }
  }, [place_id]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://places.googleapis.com/v1/places/${place_id}?languageCode=pt-BR`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'displayName,formatted_address,rating,photos,currentOpeningHours,editorial_summary,location,internationalPhoneNumber',
        },
      });
      setPlaceDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Erro ao buscar detalhes do lugar', error);
      setLoading(false);
    }
  };

 

  if (loading) {
    return <Loading />;
  }

  if (!placeDetails) {
    return <Text style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Detalhes não disponíveis</Text>;
  }
  

  const photoUri = placeDetails.photos && placeDetails.photos[0]
    ? `https://places.googleapis.com/v1/${placeDetails.photos[0].name}/media?maxWidthPx=400&maxHeightPx=400&key=${GOOGLE_PLACES_API_KEY}`
    : 'https://via.placeholder.com/400';

  return (
    <ScrollView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />

        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name='chevron-back' size={35} color="#3d3d3d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchIcon} onPress={()=> router.push('/search')}>
          <Ionicons name='search' size={26} color={"#000000"} />
         
        </TouchableOpacity> 
        <View style={styles.heartIconContainer}>
          <FavoriteButton itemId={place_id} imageUrl={photoUri} title={placeDetails.displayName.text} style={styles.heartIcon} token={token} onFavoriteChange={()=>{}} />
        </View>
       
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/map',
              params: {
                latitude: placeDetails.location.latitude,
                longitude: placeDetails.location.longitude,
                name: placeDetails.displayName.text,
                photoUri: photoUri
              }
            })
          }}
          style={({ pressed }) => [
            styles.mapContainer,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Ionicons name='map' size={27} color="#000000" />
          <Text style={styles.mapText}>Mapa</Text>
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>{placeDetails.displayName.text}</Text>
        {placeDetails.editorialSummary && (
          <View>
            <Text style={[styles.description, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>{placeDetails.editorialSummary.text}</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>Mais informações</Text>
        <View style={styles.iconTextRow}>
          <Ionicons name="location-sharp" size={26} color={theme === 'dark' ? '#ffffff' : '#000000'} />
          <Text style={[styles.address, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>{placeDetails.formattedAddress}</Text>
        </View>

        <View style={styles.iconTextRow}>
          <Ionicons name="star" size={26} color={theme === 'dark' ? '#ffffff' : '#000000'} />
          <Text style={[styles.rating, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}> {placeDetails.rating || 'Não disponível'}</Text>
        </View>
        <View style={styles.iconTextRow}>
          <Ionicons name='call' size={26} color={theme === 'dark' ? '#ffffff' : '#000000'} /> 
          <Text style={[styles.phoneNumber, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>{placeDetails.internationalPhoneNumber || 'Não disponível'}</Text>
        </View>
        <View style={styles.openingHours}>
          {placeDetails.currentOpeningHours && (
            <OpeningHours openingHours={placeDetails.currentOpeningHours} theme={theme} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: '#333333',
  },
  lightBackground: {
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 270,
  },
  backIcon: {
    position: 'absolute',
    top: 10,
    left: 15,
    backgroundColor: '#ffffffc0',
    borderRadius: 50,
  },
  searchIcon: {
    position: 'absolute',
    top: 12,
    right: 120,
    paddingVertical: 7,
    paddingHorizontal: 7,
    backgroundColor: '#ffffffc0',
    borderRadius: 50,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 12,
    right: 10,
    zIndex: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: 1,
    right: 40,
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: '#ffffffc0',
    borderRadius: 50,
  },
  mapContainer: {
    position: 'absolute',
    bottom: 15,
    right: 27,
    backgroundColor: '#ffffffb0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    marginLeft: 5,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
  },
  address: {
    fontSize: 14,
    marginLeft: 5,
    flex: 1,
  },
  rating: {
    fontSize: 15,
    marginLeft: 5,
    flex: 1,
  },
  phoneNumber: {
    fontSize: 15,
    marginLeft: 5,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 5,
  },
  openingHours: {
    marginVertical: 15,
  },
});
export default Details;