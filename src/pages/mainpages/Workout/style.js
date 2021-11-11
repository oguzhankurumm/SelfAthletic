import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    addButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.yellow,
        padding: 10,
        marginVertical: 10,
        borderRadius: 8
    },
    addButtonText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 15,
        color: themeColors.ultraDark,
        marginLeft: 5
    }
})

export default styles;