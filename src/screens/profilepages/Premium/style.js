import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 25
    },
    premiumContainer: {
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#202026',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    premiumContainerSelected: {
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#202026',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    premiumView: {
        width: '100%',
    },
    textInputStyle: {
        marginTop: 15,
        backgroundColor: '#202026',
        borderWidth: 3,
        borderColor: '#202026',
        padding: 10,
        color: "#FFF",
        borderRadius: 12,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        height: 70,
        width: '100%'
    },
    textContainer: {
        width: '100%',
        paddingHorizontal: 20
    },
    textHeader: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 24,
        color: '#FFF'
    },
    textHeaderSub: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF',
        marginLeft: 5
    },
    textSub: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#9A9AA6'
    },
    textSub2: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#9A9AA6'
    },
    textSubSelected: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: 'yellow'
    },
    textSub2Selected: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: 'yellow'
    },
    textBottomButton: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#000'
    },
    bottomButton: {
        marginTop: 10,
        width: '49%',
        height: 60,
        backgroundColor: 'yellow',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default styles;