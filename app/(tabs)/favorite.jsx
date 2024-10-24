import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, Pressable, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteButton from '../../components/FavoriteButton';
import EmptyState from '../../components/EmptyState';
import NotLogged from '../../components/NotLogged';
import Loading from '../../components/Loading';
import { useRouter } from 'expo-router';


const Favorite = () => {
    const router = useRouter();
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [theme, setTheme] = useState('light');


    const fetchFavorites = async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true); // Apenas mostra o loading se não estiver atualizando

        try {
           
            const response = await axios.get('http://192.168.0.8:3000/favorites', {
                headers: {
                    'x-auth-token': token,
                },
            });

          
                setFavoriteItems(response.data);
                console.log('Favoritos atualizados:', response.data);
            
            
        } catch (error) {
            
            setFavoriteItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false); // Garante que refreshing seja setado para false no fim
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchToken = async () => {
                try {
                    const storedToken = await AsyncStorage.getItem('token');
                    
                    if (!storedToken) {
                        setIsLoggedIn(false); // Se o token não existir, setar como false
                       
                        console.log('Token não encontrado');
                    } else {
                        setToken(storedToken)
                        
                        setIsLoggedIn(true); // Se o token existir, setar como valor do token
                        fetchFavorites(); // Chama fetchFavorites assim que o token é encontrado
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
    
    // Sempre que a tela estiver em foco, buscar os favoritos novamente
    useFocusEffect(
        useCallback(() => {
            if (token) {
                
                fetchFavorites();
                
            }
        }, [token])
    );

    const onRefresh = () => {
        setRefreshing(true); // Inicia o estado de refresh
        fetchFavorites(true); // Chama o fetchFavorites e define o isRefreshing como true
    };
    const handleFavoriteChange = () =>{
        fetchFavorites();
    }
    if (!isLoggedIn ) {
        return <NotLogged title='Favoritos' text='Acesse sua conta para visualizar seus Favoritos' buttonStyle={{ width: '37%', alignSelf: 'flex-start' }}  containerStyle={{flex:1, padding: 50,paddingTop:140, backgroundColor: theme === 'dark' ? '#333333' : '#ffffff' }} theme={theme}/>;
    }

    if (loading ) {
        return <Loading />;
    }

    const renderItem = ({ item }) => (
        <Pressable
            style={styles.itemContainer}
            onPress={() =>
                router.push({
                    pathname: '/details',
                    params: {
                        place_id: item.itemId,
                    },
                })
            }
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.heartIconContainer}>
                    <FavoriteButton
                        itemId={item.itemId}
                        imageUrl={item.imageUrl}
                        title={item.title}
                        style={styles.heartIcon}
                        token={token}
                        onFavoriteChange={handleFavoriteChange}
                    />
                </View>
                <View style={styles.textOverlay}>
                    <Text style={styles.title }>{item.title}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme === 'dark' ? '#333333' : '#ffffff' }]}>
            <FlatList
                data={favoriteItems}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyState theme={theme} />}
                contentContainerStyle={styles.flatListContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh} // Liga o método onRefresh para atualizar favoritos
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    itemContainer: {
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
       
    },
    imageContainer: {
        position: 'relative',
        width: '90%',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 18,
    },
    heartIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    heartIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.555)',
        borderRadius: 20,
        padding: 5,
    },
    textOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.644)',
        borderRadius: 10,
        alignItems: 'center',
      
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    flatListContent: {
        paddingHorizontal: 20,
    
      
    },
});

export default Favorite;
