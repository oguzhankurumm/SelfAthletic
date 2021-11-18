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
    },
    emptyContainer: {
        width: '100%',
        height: 250,
        marginTop: 10,
        padding: 20,
        backgroundColor: themeColors.ultraDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    emptyText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 15,
        color: themeColors.white,
        textAlign: 'center'
    },
})

export default styles;