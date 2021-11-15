import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    textStyle: {
        color: themeColors.white,
        fontFamily: themeFonts.boldText,
        fontSize: 16,
    },
    textContainer: {
        width: '100%',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: themeColors.ultraDark,
        marginTop: 10,
        height: 70
    }

})

export default styles;