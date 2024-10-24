import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SearchInputShell = ({ style, theme }) => {
  const router = useRouter();

  const handleFocus = () => {
    router.push('/search'); 
  };

  return (
    <View
      style={[styles.container, style, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}
    >
      <Ionicons name="search" size={24} color={theme === 'dark' ? '#ffffff' : 'black'} />
      <TextInput 
        placeholder="Qual o seu destino" 
        placeholderTextColor={theme === 'dark' ? '#ffffff' : '#949494'} // Set placeholder color based on theme
        style={[styles.placeholder, { color: theme === 'dark' ? '#ffffff' : '#949494' }]} 
        onFocus={handleFocus} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    height: 52,
  },
  darkContainer: {
    borderColor: '#666',
    backgroundColor: '#333',
  },
  lightContainer: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  placeholder: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
});

export default SearchInputShell;
