import React, { useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Alert, Pressable,  Image, Text } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import SearchInputShell from '../../components/SearchInputShell';
import MapPlaces from '../../components/mapPlaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Map = () => {
  const { latitude, longitude, name, photoUri } = useLocalSearchParams();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [mode, setMode] = useState('transit');
  const [isCentering, setIsCentering] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [places, setPlaces] = useState([]);
  const [theme, setTheme] = useState('light');
 

  const router = useRouter();
  const mapRef = useRef(null); // Referência ao MapView

 

  // Função para obter a localização do usuário
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    } catch (error) {
      setErrorMsg(error.message);
      Alert.alert('Error', error.message);
    }
  };


  const fetchNearbyPlaces = async () => {
    if (!location) return;
  
   //Diminuir quantidade de locais
  
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchNearby',
        {
          includedTypes: [selectedType || ' '],
          locationRestriction: {
            circle: {
              center: {
                latitude: latitude,
                longitude:longitude,
              },
              radius: 1000.0,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.location,places.displayName',
          },
        }
      );
  
    if (response.data.places && response.data.places.length) {
     
      setPlaces(response.data.places);
      
      console.log('response', response.data.places);
    } else {
      console.log('No Places Found', 'No nearby places available at this time.');
      setPlaces([]);
    }
      
    } catch (error) {
      console.error('Error fetching places', error);
      Alert.alert('Error', error.response?.data?.error?.message || 'Unable to fetch nearby places');
    }
  };
  

  useEffect(() => {
    
    getLocation(); 
  }, []);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
        setTheme(storedTheme || 'light');
     
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  useEffect(() => {
    getLocation(); 
    loadTheme(); 
  }, []);

  useEffect(() => {

    if (location && selectedType) {
     fetchNearbyPlaces();// Busca os lugares com base no tipo selecionado
    }
  }, [ location, selectedType]);
 
  useEffect(() => {
    const fetchRoute = async () => {
      if (location && latitude && longitude) {
        const origin = `${location.latitude},${location.longitude}`;
        const destination = `${latitude},${longitude}`;

        try {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/directions/json',
            {
              params: {
                origin,
                destination,
                key: GOOGLE_PLACES_API_KEY,
                mode: mode,
              },
            }
          );

          console.log('Response data:', response.data); 
          if (response.data.status === 'ZERO_RESULTS') {
            // Centralizar na localização do destino quando não há resultados
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
            return; 
          }

          if (response.data.routes && response.data.routes.length > 0) {
            const points = response.data.routes[0].overview_polyline?.points;
            if (points) {
              const decodedPath = polyline.decode(points);
              setRouteCoords(decodedPath.map(([lat, lng]) => ({ latitude: lat, longitude: lng })));
            } else {
              Alert.alert('Error', 'No route found');
            }
          } else {
            Alert.alert('Error', 'No routes available');
          }
        } catch (error) {
          console.error('Error fetching route:', error);
          Alert.alert('Error', 'Unable to fetch route');
        }
      }
    };

    if (location) {
      fetchRoute();
    }
  }, [location, latitude, longitude, mode]);

  const bounds = location && latitude && longitude
    ? {
        latitude: (location.latitude + parseFloat(latitude)) / 2,
        longitude: (location.longitude + parseFloat(longitude)) / 2,
        latitudeDelta: Math.abs(location.latitude - parseFloat(latitude)) * 1.5,
        longitudeDelta: Math.abs(location.longitude - parseFloat(longitude)) * 1.5,
      }
    : location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : latitude && longitude
    ? {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  // Função para centralizar o mapa na localização atual
  const centerOnUserLocation = async () => {
      if (location && mapRef.current) {
      
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
    } else {
      await getLocation(); // Chama getLocation se a localização não estiver disponível
      
    }
    setIsCentering(true);
   
  };
  useEffect(() => {
    console.log('is Centering has changed:', isCentering);
  }, [isCentering]);

  const onRegionChangeComplete = (region) => {
    if (location) {
      const isUserCentered =
        Math.abs(region.latitude - location.latitude) < 0.001 &&
        Math.abs(region.longitude - location.longitude) < 0.001;
      
      if (!isUserCentered) {
        setIsCentering(false); // Seta como falso quando o mapa é movido
      }
    }
  };
 

  const CustomMarker = React.memo(() => (
    <View style={styles.markerContainer}>
    <Image source={require('../../assets/images/alfinete.png')} style={styles.iconStyle}/>
    <Image source={{ uri: photoUri }} style={styles.markerImage} />
    
  </View>
  ));

  const CustomMarkerByType = React.memo( () => {
    console.log('Rendering marker for type:', selectedType); 
  
    let pinSource;
    let icon;
  
    switch (selectedType) {
      case 'historical_landmark':
        pinSource = require('../../assets/images/culture.png');
        icon = 'building-columns';
        break;
      case 'shopping_mall':
        pinSource = require('../../assets/images/shop.png');
        icon = 'bag-shopping';
        break;
      case 'restaurant':
        pinSource = require('../../assets/images/restaurant.png');
        icon = 'bell-concierge';
        break;
      case 'bar':
        pinSource = require('../../assets/images/party.png');
        icon = 'martini-glass-citrus';
        break;
      case 'airport':
        pinSource = require('../../assets/images/airplane.png');
        icon = 'plane-departure';
        break;
      case 'hotel':
        pinSource = require('../../assets/images/hotel.png');
        icon = 'bed';
        break;
    
    }
  
    return (
      <View style={styles.markerContainer}>
        <Image source={pinSource} style={styles.iconStyle} />
        <FontAwesome6 name={icon} size={17} color={'white'} style={styles.markerIcon} />
      </View>
    );
  });

  const getMapStyle = () => {
    return [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }] // Oculta todos os POIs
      }
    ];
  };

  return (
    <View style={styles.container}>
      

      <MapView
        ref={mapRef} 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={bounds}
        onRegionChangeComplete={onRegionChangeComplete}
       customMapStyle={getMapStyle()}
      >
        
        {location && location.latitude && location.longitude && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Minha Localização"
          />
        )}
        {latitude && longitude && (
           <Marker
           coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
           title={name || 'Localização'}
          
         >
           <CustomMarker photoUri={photoUri}/>
         </Marker>
        )}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#fc4747"
            strokeWidth={3}
          />
        )}
{places.map((place, index) => {
  const isCustomMarker = place.location.latitude === parseFloat(latitude) && place.location.longitude === parseFloat(longitude);

  if(isCustomMarker){
    return null;
  }
  return (
    <Marker
      key={index}
      coordinate={{ latitude: place.location.latitude, longitude: place.location.longitude }}
      title={place.displayName.text}
    >
      <CustomMarkerByType />
    </Marker>
  );
})}

      </MapView>
      <SearchInputShell style={styles.inputShell} theme={theme}/>
      {latitude && longitude && ( 
      <MapPlaces style={styles.mapPlaces} setSelectCategory={setSelectedType}/>
      )}
      
      {/* Botão para voltar à localização atual */}
      <Pressable style={styles.locationButton} onPress={centerOnUserLocation}>
        <MaterialIcons 
        name={isCentering ? "my-location" : "location-searching"} 
        size={30}  
        color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  markerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.4,
    shadowRadius: 4, 
    elevation: 5, 
  },
  markerImage: {
    height: 47,
    width: 47,
    borderRadius: 50, 
    position: 'absolute', 
    top: 6, 
    left: 11.5, 
  },
  iconStyle:{
    width:70,
    height:70
  },
  mapPlaces:{
    position: 'absolute',
    top: 80, 
    left: 0,
    right: 0,
    zIndex: 2, 
  },
  inputShell:{
    position: 'absolute',
    top: 0, 
    left: 0,
    right: 0,
    zIndex: 1, 
  },
  markerIcon: {
    height: 47,
    width: 47,
    borderRadius: 50, 
    position: 'absolute', 
    top: 20, 
    left: 26, 
  },

});

export default Map;
