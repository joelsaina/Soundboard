import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', 
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 40,
        paddingBottom: 40,
    },
    flexRow: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'center',
        marginBottom: 20,
    },
    heading: {
        fontSize: 48, 
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(255, 0, 0, 1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    instrumentButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        borderWidth: 5,
        borderRadius: 10,
        borderBlockColor: 'black'
    },

    recordingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width: '90%', 
        marginBottom: 20,
    },

    button: {
        padding: 15, 
        marginHorizontal: 10, 
        borderRadius: 10, 
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF', 
        fontWeight: '500',
    },
});
