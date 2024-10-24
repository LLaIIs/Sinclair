import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotLogged from '../../components/NotLogged';
import axios from 'axios';

const UserConfig = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setToken(token);
      console.log('Token recuperado', token);
      if (!token) {
        setIsLoggedIn(false);
      } else {
        fetchUserName(token);
      }
    };

    const fetchUserName = async (token) => {
      try {
        const response = await axios.get('http://192.168.0.8:3000/profile/user', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        setUserName(response.data.name || 'Nome não disponível');
      } catch (error) {
        console.error('Erro ao buscar o nome do usuário:', error.response ? error.response.data.message : error.message);
      }
    };

    const fetchTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };

    checkLoginStatus();
    fetchTheme();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    setModalVisible(false); // Fecha o modal após o logout
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getThemeStyles = () => {
    return theme === 'dark'
      ? { backgroundColor: '#333', color: '#fff' }
      : { backgroundColor: '#fff', color: '#000' };
  };

  const themeStyles = getThemeStyles();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.container}>
        {isLoggedIn ? (
          <View>
            <Text style={[styles.headerText, { color: themeStyles.color }]}>Perfil e configurações</Text>

            <TouchableOpacity style={styles.profileContainer} onPress={() => router.push({ pathname: '/profile', params: { token: token } })}>
              <Ionicons name="person-circle" size={60} color={themeStyles.color} style={styles.icon} />
              <View style={styles.profileTextContainer}>
                <Text style={[styles.profileName, { color: themeStyles.color }]}>{userName}</Text>
                <Text style={[styles.profileLink, { color: themeStyles.color }]}>Mostrar perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={themeStyles.color} style={styles.icon} />
            </TouchableOpacity>
          </View>
        ) : (
          <NotLogged title="Seu perfil" text="Acesse sua conta" buttonStyle={{ width: '100%', alignSelf: 'flex-start' }} containerStyle={{ padding: 20 , backgroundColor: theme === 'dark' ? '#333333' : '#ffffff' }} theme={theme}/>
          
        )}

        <Text style={[styles.moreInfoText, { color: themeStyles.color }]}>Mais informações</Text>

        <TouchableOpacity style={styles.optionContainer} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-sharp" size={24} color={themeStyles.color} style={styles.icon} />
          <Text style={[styles.optionText, { color: themeStyles.color }]}>Configurações</Text>
          <Ionicons name="chevron-forward" size={24} color={themeStyles.color} style={styles.icon} />
        </TouchableOpacity>

       
        <TouchableOpacity style={styles.optionContainer} onPress={() => Linking.openURL('https://forms.gle/fFAyXXx84hSxczSt9')}>
        <Ionicons name="star-outline" size={24} color={themeStyles.color} style={styles.icon} />
        <Text style={[styles.optionText, { color: themeStyles.color }]}>Avalie o aplicativo</Text>
        <Ionicons name="chevron-forward" size={24} color={themeStyles.color} style={styles.icon} />
    </TouchableOpacity>

        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutContainer} onPress={openModal}>
            <Text style={[styles.logoutText, { color: themeStyles.color }]}>Sair da conta</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.versionText, { color: themeStyles.color }]}>Versão 1.0.0(0000)</Text>

        {/* Modal de confirmação */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Deseja realmente sair da conta?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
                  <Text style={styles.modalButtonText}>Sair da conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileLink: {
    fontSize: 14,
    color: '#888',
  },
  moreInfoText: {
    marginTop: 30,
    marginLeft: 16,
    fontSize: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 20,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
  },
  versionText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalButton: {
    flex: 0.7,
    padding: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default UserConfig;
