import { StyleSheet } from "react-native";
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 5
    },
    renderContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%'
    },
    headerContainer: {
        backgroundColor: themeColors.ultraDark,
        flexDirection: 'row',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftContainer: {
        width: '70%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontFamily: themeFonts.boldText,
        fontSize: 18,
        color: themeColors.white,
        width: '100%'
    },
    foodTitle: {
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.white
    },
    foodDescription: {
        fontFamily: themeFonts.mediumText,
        color: themeColors.lightGray,
        fontSize: 14,
        marginTop: 5
    }
})

export default styles;