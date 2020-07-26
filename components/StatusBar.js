import React from 'react'
import { StatusBar } from 'react-native'

const StatusBarWhite = () => {
    return (
        <StatusBar
            barStyle="dark-content"
            backgroundColor='transparent'
            animated={true}
            translucent
        />
    )
}

export default StatusBarWhite;