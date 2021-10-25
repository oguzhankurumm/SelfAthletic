import { StyleSheet } from "react-native";
import themeFonts from '../../styles/fonts';
import themeColors from '../../styles/colors';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerText: {
        fontFamily: themeFonts.boldText,
        fontSize: 18,
        color: themeColors.white
    }
})

export default styles;