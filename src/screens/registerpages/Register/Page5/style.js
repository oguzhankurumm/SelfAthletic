import { StyleSheet } from "react-native"
import themeColors from "../../../../styles/colors";
import themeFonts from "../../../../styles/fonts";

const styles = StyleSheet.create({
    bottomButton: {
        width: '49%',
        padding: 20,
        borderRadius: 8,
        backgroundColor: themeColors.yellow,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: themeFonts.boldText,
        justifyContent: 'flex-start',
        fontSize: 16,
        color: themeColors.ultraDark
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
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: themeColors.white
    },
    optionText: {
        fontFamily: 'SFProDisplay-Medium',
        textAlign: 'center',
        fontSize: 16,
        color: themeColors.white
    },
    optionButton: {
        marginTop: 20,
        width: '90%',
        backgroundColor: null,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: themeColors.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    optionButtonSelected: {
        marginTop: 20,
        width: '90%',
        backgroundColor: themeColors.yellow,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    }
})

export default styles;