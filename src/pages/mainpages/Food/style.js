import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center'
    },
    popupText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white,
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
    circleHeaderText: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.white
    },
    circleSubText: {
        marginTop: 15,
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 12,
        color: themeColors.white
    },
    targetHeader: {
        fontFamily: themeFonts.mediumText,
        fontSize: 17,
        color: themeColors.white,
        marginBottom: 5
    },
    targetText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 20,
        color: themeColors.white
    },
    targetSubText: {
        marginTop: 5,
        fontFamily: themeFonts.mediumText,
        fontSize: 13,
        color: themeColors.white
    },
    foodHeader: {
        fontFamily: themeFonts.boldText,
        fontSize: 18,
        color: themeColors.white,
        width: '100%'
    },
    foodName: {
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.white
    },
    modalStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default styles;