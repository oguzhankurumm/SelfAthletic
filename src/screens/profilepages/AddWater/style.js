import { StyleSheet } from "react-native";
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    },
    touchableText: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        color: themeColors.white
    },
    touchableTextSelected: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        color: themeColors.ultraDark
    },
    touchableStyle: {
        width: '33%',
        marginHorizontal: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12,
        backgroundColor: themeColors.ultraDark
    },
    touchableStyleSelected: {
        width: '33%',
        marginHorizontal: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12,
        backgroundColor: themeColors.yellow
    },
    input: {
        color: themeColors.white,
        backgroundColor: '#363636',
        padding: 10,
        borderRadius: 12,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        height: 70,
        width: '100%'
    },
    inputTitle: {
        marginBottom: 15,
        textAlign: 'left',
        width: '100%',
        fontWeight: '700',
        fontSize: 17,
        color: themeColors.white
    }
})

export default styles;