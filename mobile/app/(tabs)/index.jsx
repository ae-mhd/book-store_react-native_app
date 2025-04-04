import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/signup.styles'
import { useAuthStore } from '../../store/auth';

export default function Home() {
    const { logout } = useAuthStore();

    return (
        <View>
            <Text>Home</Text>
            <TouchableOpacity onPress={logout}>
                <Text style={styles.link}>Signup</Text>
            </TouchableOpacity>
        </View>
    )
}