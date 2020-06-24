import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Icon from 'react-native-vector-icons/dist/MaterialIcons'

const RatingBadge = (props) => {
    if (props.color === "orange") {
        return (
            <View style={styles.ratingBadge}>
                <Text style={{
                    fontSize: props.fontSize || 12,
                    position: "absolute",
                    zIndex: 2,
                    color: "#fff",
                    fontWeight: "bold",
                }}
                >
                    {props.value}
                </Text>
                <Icon name="bookmark" color="#FF9D00" size={props.size || 48} style={styles.ratingIcon} />
            </View>
        )
    }
    else {
        return (
            <View style={styles.ratingBadge}>
                <Text style={{
                    fontSize: props.fontSize || 12,
                    position: "absolute",
                    zIndex: 2,
                    color: "#fff",
                    fontWeight: "bold",
                }}
                >
                    {props.value}
                </Text>
                <Icon name="bookmark" color="#0062FF" size={props.size || 48} style={styles.ratingIcon} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    ratingBadge: {
        justifyContent: "center",
        alignItems: "center"
    },
    ratingText: {
        fontSize: 12,
        position: "absolute",
        zIndex: 2,
        color: "#fff",
        fontWeight: "bold",
    }
})

export default RatingBadge;