import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        width: '100%',
        marginVertical: 10
    },
    title: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.white
    },
    subtitle: {
        marginTop: 15,
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 12,
        color: themeColors.white
    },
    fillContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default styles;