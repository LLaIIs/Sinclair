import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

const NotLogged = ({ title, text, containerStyle, buttonStyle, theme }) => {
    const router = useRouter();
    const isDarkTheme = theme === 'dark'; // Verifica se o tema é escuro

    return (
        <View style={[styles.center, containerStyle]}>
            <Text style={[styles.title, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>{title}</Text>
            <Text style={[styles.message, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>{text}</Text>
            <Pressable style={[styles.button, buttonStyle]} onPress={() => router.push('/login')}>
                <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    center: { 
        backgroundColor: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 20,
    },
    message: { 
        fontSize: 18, 
        marginBottom: 20,
        fontWeight: '600',
    },
    button: { 
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: '#1c7c09c7', 
        borderRadius: 10,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 18,
    },
    container: {
        padding: 20,
    },
});

export default NotLogged;
