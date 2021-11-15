import { StyleSheet } from "react-native";
import themeFonts from '../../styles/fonts';
import themeColors from '../../styles/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: themeColors.ultraDark,
        borderRadius: 10,
        marginHorizontal: 30,
        marginBottom: 5,
        overflow: 'hidden',
        height: 80
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 50,
        paddingHorizontal: 20
    },
    textStyle: {
        fontSize: 16,
        color: themeColors.white,
        fontFamily: themeFonts.boldText,
        marginBottom: 5
    },
    textStyle2: {
        fontSize: 14,
        color: '#9D9D9D',
        fontFamily: themeFonts.mediumText
    }
})

export default styles;