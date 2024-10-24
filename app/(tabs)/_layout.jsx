import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Função para carregar o tema do AsyncStorage
const loadTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme;
  } catch (error) {
    console.error("Erro ao carregar tema", error);
    return 'light';
  }
};

// Componente TabIcon
const TabIcon = ({ icon, name, focused, theme }) => {
  const isDarkMode = theme === 'dark';
  const iconColor = isDarkMode ? (focused ? '#b0e65bd5' : '#FFFFFF') : (focused ? '#3c7534' : '#666666');

  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={icon}
        color={iconColor}
        size={25}
      />
      <Text style={[styles.label, { color: iconColor }]}>
        {name}
      </Text>
    </View>
  );
};

// Layout das abas
const TabsLayout = () => {
  const [theme, setTheme] = useState('light'); // Estado para armazenar o tema atual

  useEffect(() => {
    // Carrega o tema ao iniciar
    const fetchTheme = async () => {
      const storedTheme = await loadTheme();
      setTheme(storedTheme);
    };
    fetchTheme();
  }, []);

  const isDarkMode = theme === 'dark';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', // Cor do fundo da aba com base no tema
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explorar",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon="search"
                name="Explorar"
                focused={focused}
                theme={theme} // Passa o tema para o ícone
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Mapa",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon="map"
                name="Mapa"
                focused={focused}
                theme={theme}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dicas"
          options={{
            title: "Dicas",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon="chatbox"
                name="Dicas"
                focused={focused}
                theme={theme}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: "Favoritos",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon="heart"
                name="Favoritos"
                focused={focused}
                theme={theme}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="userConfig"
          options={{
            title: "Perfil",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon="person"
                name="Perfil"
                focused={focused}
                theme={theme}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
});

export default TabsLayout;
