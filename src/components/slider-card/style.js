import { StyleSheet } from "react-native"
import themeColors from '../../styles/colors';
import themeFonts from '../../styles/fonts';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        borderRadius: 18,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 18
    },
    linear: {
        position: 'absolute',
        borderRadius: 18,
        width: '100%',
        height: 200
    },
    title: {
        fontFamily: themeFonts.boldText,
        fontSize: 20,
        color: themeColors.white,
        marginBottom: 8
    },
    subtitle: {
        fontFamily: themeFonts.mediumText,
        fontSize: 13,
        color: themeColors.white
    }
})

export default styles;