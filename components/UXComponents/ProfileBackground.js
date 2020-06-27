import React from 'react'
import { StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg'

const ProfileBackground = () => {
    return (
        <Svg viewBox="0 0 600 600" height="150%" width="150%" style={styles.circleTop}>
            <Circle cx="300"
                cy="300"
                r="300"
                fill="#0062FF" />
        </Svg>
    )
}

const styles = StyleSheet.create({
    circleTop: {
        position: "absolute",
        top: "-82%",
        left: "-25%",
    },
})

export default ProfileBackground;