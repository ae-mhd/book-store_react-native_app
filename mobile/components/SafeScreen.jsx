import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../constants/colors'

export const SafeScreen = ({ children }) => {
    const insets = useSafeAreaInsets()
    return (
        <View style={[styles.container, {
            paddingTop: insets.top,
        }]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    }
})