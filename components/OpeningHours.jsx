import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OpeningHours = ({ openingHours, theme }) => {
    const [showAllHours, setShowAllHours] = useState(false);

    const formatTime = (hour, minute) => {
        if (hour === undefined || minute === undefined) return '';
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    if (!openingHours || !openingHours.periods || openingHours.periods.length === 0) {
        return <Text style={[styles.closedText, theme === 'dark' ? styles.darkClosedText : styles.lightClosedText]}>Fechado</Text>;
    }

    const { periods, weekdayDescriptions } = openingHours;
    const dayOfWeek = new Date().getDay();

    const todayHours = periods.find(period => period.open.day === dayOfWeek);
    const todayOpening = todayHours
        ? `Aberto hoje às ${formatTime(todayHours.open.hour, todayHours.open.minute)} até ${formatTime(todayHours.close.hour, todayHours.close.minute)}`
        : 'Fechado';

    const formattedHours = weekdayDescriptions.map((description, index) => {
        const isClosed = !periods.find(period => period.open.day === index);
        return (
            <Text key={index} style={[styles.openingHoursText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                {description}
            </Text>
        );
    });

    return (
        <View>
            <View style={styles.headerContainer}>
                <Ionicons name="time-sharp" size={24} style={styles.icon} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                <Text style={[styles.headerText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                    Horário de funcionamento:
                </Text>
            </View>
            <Text style={[todayOpening === 'Fechado' ? styles.closedText : styles.openingHoursText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                {todayOpening}
            </Text>
            {showAllHours && (
                <View style={styles.openingHoursContainer}>
                    {formattedHours}
                </View>
            )}
            <Pressable
                onPress={() => setShowAllHours(!showAllHours)}
                style={styles.toggleButton}
            >
                <Text style={styles.toggleButtonText}>
                    {showAllHours ? 'Mostrar menos' : 'Mostrar todos os horários'}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 2,
    },
    openingHoursText: {
        fontSize: 14,
        marginVertical: 3,
        marginLeft: 30,
    },
    closedText: {
        fontSize: 14,
        marginVertical: 3,
        marginLeft: 30,
        color: '#dd0303',
    },
    darkClosedText: {
        color: '#ff4c4c', // Adjust the closed text color for dark theme
    },
    lightClosedText: {
        color: '#dd0303', // Light theme closed text color
    },
    openingHoursContainer: {
        marginVertical: 10,
    },
    toggleButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
    },
    toggleButtonText: {
        fontSize: 14,
    },
    darkText: {
        color: '#ffffff', // Dark theme text color
    },
    lightText: {
        color: '#000000', // Light theme text color
    },
});

export default OpeningHours;
