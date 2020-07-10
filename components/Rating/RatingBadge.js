import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Icon from 'react-native-vector-icons/dist/MaterialIcons'

const RatingBadge = (props) => {
    return (
        <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
                {props.value}
            </Text>
            <Icon
                name="bookmark"
                color={props.color === "orange" ? "#FF9D00" : "#0062FF"}
                size={props.size || 48}
                style={styles.ratingIcon}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    ratingBadge: {
        justifyContent: "center",
        alignItems: "center"
    },
    ratingText: {
        fontSize: 12,
        position: "absolute",
        top: 14,
        zIndex: 2,
        color: "#fff",
        fontWeight: "bold",
    }
})

export default RatingBadge;