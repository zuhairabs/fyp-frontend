import React from 'react'
import { Text, View, StyleSheet } from 'react-native'



const BookButton = (props) => {
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.bookButton}>
                {
                    props.title ? 
                    <Text style={styles.bookButtonText}>
                        {props.title}
                    </Text>
                    :
                    <Text style={styles.bookButtonText}>BOOK SLOT</Text>    
                }
                <View style={styles.bookButtonUnderline}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "flex-start",
    },
    bookButton: {
        backgroundColor: '#fff',
        paddingVertical: 5,
    },
    bookButtonText: {
        fontFamily: 'notoserif',
        textTransform: 'uppercase',
        fontSize: 10,
        marginBottom: 5,
    },
    bookButtonUnderline: {
        borderBottomWidth: 2,
        marginHorizontal: "10%",
        borderColor: "#1162FB",
    },
})

export default BookButton;