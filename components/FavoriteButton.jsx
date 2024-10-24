import React, { useState, useEffect } from 'react';
import { Pressable, View, Modal, Text, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import {useRouter } from 'expo-router';

// Componente que adiciona e remove itens dos favoritos
const FavoriteButton = ({ itemId, imageUrl, title, style, token, onFavoriteChange}) => {
    const router = useRouter();
    // Estado para armazenar se o item é um favorito
    const [isFavorite, setIsFavorite] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(()=>{
        if(!token){
            setIsFavorite(false);
        }
    }, [token]);

    // Função para alternar o estado de favorito do item
    const toggleFavorite = async () => {
        console.log('Favorite button clicked')
        if(!token){
            setShowLoginModal(true);
            return;
        }
        try {
            const response = await axios.post('http://192.168.0.8:3000/favorites/toggle', {
                 itemId,
                 imageUrl,
                 title
                
            }, {
                headers: {
                    'x-auth-token': token // Use o token JWT real aqui
                }
            });

            // Verifica o status da resposta para atualizar o estado do favorito
            if (response.status === 200) {
                setIsFavorite(false); // Removido dos favoritos
                onFavoriteChange();
            } else if (response.status === 201) {
                setIsFavorite(true); // Adicionado aos favoritos
            }
        } catch (error) {
            console.error('Erro ao alternar o estado dos favoritos', error);
        }
    };

    // Verifica o status do item nos favoritos quando o componente monta
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if(!token) return;

            try {
                const response = await axios.get('http://192.168.0.8:3000/favorites', {
                    headers: {
                        'x-auth-token': token // Use o token JWT real aqui
                    }
                });

                // Atualiza o estado levando em conta a presença do item na lista de favoritos
                setIsFavorite(response.data.some(fav => fav.itemId === itemId));
                console.log('FB-> id',itemId)
            } catch (error) {
                console.error('Erro ao verificar status de favorito:', error);
            }
        };
        checkFavoriteStatus();
    }, [itemId, token]);

    return (
        <View>
        <Pressable onPress={toggleFavorite} style={style}>
            <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={30}
                color='#0000009d'
            />
        </Pressable>
        <Modal
                transparent={true}
                animationType="slide"
                visible={showLoginModal}
                onRequestClose={() => setShowLoginModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Faça Login</Text>
                        <Text style={styles.modalMessage}>Para adicionar itens aos favoritos, você precisa estar logado.</Text>
                        <Pressable 
                            style={styles.modalButton} 
                            onPress={() => {
                                setShowLoginModal(false);
                                router.push('/login')
                            }}
                        >
                            <Text style={styles.modalButtonText} >Ir para Login</Text>
                        </Pressable>
                        <Pressable 
                            style={styles.modalButtonC} 
                            onPress={() => setShowLoginModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#097724',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    modalButtonC: {
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    modalButtonText: {
        color: 'white',
    },
});
export default FavoriteButton;
