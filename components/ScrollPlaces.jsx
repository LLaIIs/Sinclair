import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

const ScrollPlaces = ({ setSelectedCategory, theme }) => {
  const [selectedId, setSelectedId] = useState('1');

  const categories = [
    { id: '1', title: 'Todos', type: 'tourist_attraction', icon: { name: 'grid', library: 'Ionicons' } },
    { id: '2', title: 'Restaurante', type: 'restaurant', icon: { name: 'restaurant', library: 'MaterialIcons' } },
    { id: '3', title: 'Shopping', type: 'shopping_mall', icon: { name: 'bag-shopping', library: 'FontAwesome6' } },
    { id: '4', title: 'Parque', type: 'park', icon: { name: 'leaf', library: 'Ionicons' } },
    { id: '5', title: 'Teatro', type: 'performing_arts_theater', icon: { name: 'theater-masks', library: 'FontAwesome5' } },
    { id: '6', title: 'Museu', type: 'museum', icon: { name: 'building-columns', library: 'FontAwesome6' } },
    { id: '7', title: 'Monumento', type: 'historical_landmark', icon: { name: 'monument', library: 'FontAwesome5' } }
  ];

  const renderIcon = (icon, color) => {
    switch (icon.library) {
      case 'Ionicons':
        return <Ionicons name={icon.name} size={30} color={color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon.name} size={30} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon.name} size={30} color={color} />;
      case 'FontAwesome6':
        return <FontAwesome6 name={icon.name} size={30} color={color} />;
      default:
        return null;
    }
  };

  const defaultIconColor = theme === 'dark' ? 'white' : 'black';
  const selectedItemBackground = theme === 'dark' ? '#95e99568' : '#79c27083';
  const selectedColor = theme === 'dark' ? '#64e068' : '#4caf50'; 

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        const iconColor = isSelected ? selectedColor : defaultIconColor;

        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.itemContainer,
              isSelected && { backgroundColor: selectedItemBackground },
            ]}
            onPress={() => {
              setSelectedId(category.id);
              setSelectedCategory(category.type); 
            }}
          >
            {renderIcon(category.icon, iconColor)}
            <Text
              style={[
                styles.itemText,
                { color: iconColor }
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    height: 100,
    marginBottom: 30,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemText: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default ScrollPlaces;
