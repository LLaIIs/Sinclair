import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('light');

  useEffect(() => {
    // Recupera o tema atual do AsyncStorage ao montar o componente
    const fetchTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      }
    };

    fetchTheme();
  }, []);

  const handleThemeChange = async (theme) => {
    setSelectedTheme(theme);
    await AsyncStorage.setItem('theme', theme); // Salva o tema no AsyncStorage
  };

  const getThemeStyles = () => {
    return selectedTheme === 'dark'
      ? { backgroundColor: '#333', color: '#fff' }
      : selectedTheme === 'light'
      ? { backgroundColor: '#fff', color: '#000' }
      : { backgroundColor: '#f0f0f0', color: '#000' }; // Essa linha não será utilizada
  };

  const themeStyles = getThemeStyles();

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Pressable
        style={({ pressed }) => [styles.iconLeft, { opacity: pressed ? 0.7 : 1 }]}
        onPress={() => router.push('/userConfig')}
      >
        <Ionicons name="chevron-back" size={34} color={themeStyles.color} />
      </Pressable>
      <Text style={[styles.header, { color: themeStyles.color }]}>Configurações</Text>
      
      <View style={styles.themeContainer}>
        <Text style={[styles.label, { color: themeStyles.color }]}>Tema</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioButtonRow}>
            <RadioButton
              value="light"
              status={selectedTheme === 'light' ? 'checked' : 'unchecked'}
              onPress={() => handleThemeChange('light')}
            />
            <Text style={[styles.radioLabel, { color: themeStyles.color }]}>Claro</Text>
          </View>
          <View style={styles.radioButtonRow}>
            <RadioButton
              value="dark"
              status={selectedTheme === 'dark' ? 'checked' : 'unchecked'}
              onPress={() => handleThemeChange('dark')}
            />
            <Text style={[styles.radioLabel, { color: themeStyles.color }]}>Escuro</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label:{
    marginBottom:10,
    fontSize:18
  },
  iconLeft: {
    borderRadius: 50,
    padding: 4,
    marginBottom: 20,
  },
  themeContainer: {
    marginBottom: 20,
    

  },
  radioContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default Settings;
