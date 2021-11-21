import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10
    },
    bottomButton: {
        width: '100%',
        padding: 20,
        borderRadius: 8,
        backgroundColor: themeColors.yellow,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: themeFonts.boldText,
        justifyContent: 'flex-start',
        fontSize: 16,
        color: themeColors.ultraDark
    },
    textInput: {
        textAlign: 'left',
        width: '100%',
        padding: 20,
        color: themeColors.white,
        fontFamily: themeFonts.boldText,
        fontSize: 16
    },
    textStyleHeader: {
        width: '100%',
        marginBottom: 5,
        color: themeColors.white,
        fontFamily: themeFonts.boldText,
        fontSize: 16,
    },
    textContainer: {
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.ultraDark,
        borderColor: themeColors.ultraDark
    }
})

export default styles;