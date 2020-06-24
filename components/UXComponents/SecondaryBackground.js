import React from 'react'
import { StyleSheet, Dimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg'

const DEVICE_WIDTH = Dimensions.get('window').width;

const MainBackground = () => {
    return (
        <>
            <Svg viewBox="0 0 500 500" height="80%" width="80%" style={styles.circleTop}>
                <Circle cx="250"
                    cy="250"
                    r="250"
                    fill="#0062FF" />
            </Svg>
            <Svg viewBox="0 0 500 500" height="30%" width="30%" style={styles.circleBottom}>
                <Circle cx="250"
                    cy="250"
                    r="250"
                    fill="#0062FF" />
            </Svg>
            <Svg viewBox="0 0 500 500" height="15%" width="15%" style={styles.circleSmallBottom}>
                <Circle cx="250"
                    cy="250"
                    r="250"
                    fill="#0062FF"
                />
            </Svg>
        </>
    )
}

const styles = StyleSheet.create({
    circleTop: {
        zIndex: 2,
        position: "absolute",
        right: "-30%",
        top: "-40%",
    },
    circleBottom: {
        position: "absolute",
        bottom: "-12%",
        left: "-10%",
    },
    circleSmallBottom: {
        position: "absolute",
        left: "18%",
        bottom: "5%"
    }
})

export default MainBackground;