import React from 'react'
import { StatusBar, StyleSheet } from 'react-native'

const StatusBarWhite = () => {
    return (
        <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff00000"
            animated={true}
            translucent
            style={styles.StatusBar}
        />
    )
}

const styles = StyleSheet.create({
    statusBar: {
    }
})

export default StatusBarWhite;