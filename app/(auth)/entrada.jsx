import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const EntradaScreen = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/login');
    }, 6000); // Redireciona para a tela de login após 6 segundos
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/sinclair.png")} style={styles.logo} />
      <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  loader: {
    marginTop: 20,
  },
});

export default EntradaScreen;
