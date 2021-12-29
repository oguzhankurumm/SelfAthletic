import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 25
    },
    tabContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 15
    },
    flatListContainer: {
        padding: 20,
        width: '100%',
    },
    itemContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginBottom: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%',
        borderRadius: 18
    },
    name: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#FFF'
    },
    description: {
        marginTop: 8,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#FFF'
    },
    statusTextCompleted: {
        marginTop: 8,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: 'lightgreen'
    },
    statusTextDefault: {
        marginTop: 8,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#f70d1a'
    }, container: {
        flex: 1,
        alignItems: 'center'
    },
    touchableText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#FFF'
    },
    touchableStyle: {
        width: '48%',
        marginHorizontal: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12
    },
    foodHeader: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF',
        width: '100%'
    },
    foodName: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    }
})

export default styles;