import { StyleSheet } from "react-native";
import themeFonts from '../../../styles/fonts';
import themeColors from '../../../styles/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textStyle: {
        fontFamily: themeFonts.mediumText,
        justifyContent: 'flex-start',
        textAlign: 'justify',
        fontSize: 16,
        color: themeColors.white
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    },
    name: {
        fontFamily: themeFonts.mediumText,
        fontSize: 22,
        color: themeColors.white,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    description: {
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        textAlign: 'justify',
        color: themeColors.white
    },
    input: {
        width: '100%',
        padding: 20,
        color: themeColors.white,
        backgroundColor: '#363636',
        fontFamily: themeFonts.boldText,
        fontSize: 16,
        borderRadius: 12
    },
    inputTitle:{
        fontFamily: themeFonts.mediumText,
        fontSize: 22,
        color: themeColors.white,
        textAlign: 'center',
        marginBottom: 20
    }
})

export default styles;