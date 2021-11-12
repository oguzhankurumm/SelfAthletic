import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    startButton: {
        width: '100%',
        backgroundColor: 'yellow',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 10
    },
    startButtonText: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.ultraDark,
    }
})

export default styles;