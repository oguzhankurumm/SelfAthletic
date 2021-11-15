import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20
    },
    levelContainer: {
        width: '100%',
        marginBottom: 8
    },
    levelTextContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 8,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bar: {
        width: '100%'
    },
    text: {
        fontFamily: themeFonts.mediumText,
        fontSize: 12,
        color: themeColors.yellow
    },

})

export default styles;