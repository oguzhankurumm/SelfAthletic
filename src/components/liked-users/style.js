import { StyleSheet } from "react-native"
import themeColors from '../../styles/colors';
import themeFonts from '../../styles/fonts';

const styles = StyleSheet.create({
    CardStyle: {
        width: '100%',
        borderRadius: 18,
    },
    textStyle: {
        fontFamily: themeFonts.boldText,
        fontSize: 15,
        color: themeColors.white,
        marginLeft: 10
    },
    postText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.ultraDark,
    }
})

export default styles;