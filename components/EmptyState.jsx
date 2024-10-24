import { View, Text,Image, StyleSheet} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const EmptyState = ({theme}) => {
  return (
    <SafeAreaView>
    <View>
      <Image
      source={require('../assets/images/emptyState.png')}
      style={styles.image}
      resizeMode='cover'/>
      
    </View>
    <Text  style={[styles.text, { color: theme === 'dark' ? '#ffffff' : '#333333' }]}>Nenhum favorito adicionado ainda!</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16,
  },
  image: {
    width: '100%',
    height: 500,
    marginBottom: 16, 
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign:'center', 
  },
});
export default EmptyState;