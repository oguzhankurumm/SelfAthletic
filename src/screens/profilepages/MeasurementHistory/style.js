import { StyleSheet } from "react-native";
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20
    },
    modalContainer: {
        backgroundColor: themeColors.ultraDark,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 12
    },
    titleContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    list: {
        paddingBottom: 20,
        width: '100%',
        height: '100%'
    },
    itemContainer: {
        backgroundColor: themeColors.ultraDark,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%',
        borderRadius: 18
    },
    subContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    },
    leftContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        fontFamily: themeFonts.boldText,
        fontSize: 18,
        color: themeColors.white
    },
    text: {
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    },
    nameText: {
        textAlign: 'left',
        fontFamily: themeFonts.boldText,
        fontSize: 18,
        color: themeColors.white
    },
    meterTitle: {
        textAlign: 'left',
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    },
    closeText: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    },
    nullContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    }
})

export default styles;