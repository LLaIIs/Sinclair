import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const MapPlaces = ({ style, setSelectCategory }) => {
  const [selectedId, setSelectedId] = useState('');

  const categories = [
    { id: '1', title: 'All', type: '', icon: 'map-location-dot' },
    { id: '2', title: 'Cultura', type: 'historical_landmark', icon: 'building-columns' },
    { id: '3', title: 'Comprar', type: 'shopping_mall', icon: 'bag-shopping' },
    { id: '4', title: 'Comer', type: 'restaurant', icon: 'bell-concierge' },
    {id:'5', title:'Bar',type:'bar', icon:'martini-glass-citrus'},
    {id:'6', title:'Aeroporto', type:'airport', icon:'plane-departure'},
    { id: '7', title: 'Dormir', type: 'hotel', icon: 'bed' },
  ];
  //Adicionar aeroporto

  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[styles.categoryContainer]}
            onPress={() => {
              setSelectedId(category.id);
              setSelectCategory(category.type); 
            }}
          >
            <View style={styles.backgroundContainer}>
             
              <View style={styles.whiteBackground} />
            
              {selectedId === category.id && (
                <View style={styles.overlayBackground} />
              )}
            </View>

            <FontAwesome6
              name={category.icon}
              size={20}
              color={selectedId === category.id ? 'green' : 'grey'}
            />
            <Text
              style={[
                styles.categoryText,
                { color: selectedId === category.id ? 'green' : 'black' },
              ]}
            >
              {category.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    justifyContent: 'space-between',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 7,
    paddingVertical: 4,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
  
  },
  whiteBackground: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    
   
  },
  overlayBackground: {
    backgroundColor: 'rgba(0, 255, 0, 0.219)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: 'rgb(3, 197, 3)', 
    borderWidth: 1, 
    borderRadius: 30, 
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 13,
  },
});

export default MapPlaces;
