import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native'

import StatusBarWhite from '../UXComponents/StatusBar'
import Search from '../Header/Search'
import StoreCard from '../StoreCard/StoreCard'


const SearchFull = (props) => {
    const [results, setResults] = useState([])
    const [query, setQuery] = useState()

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />
            <Search type="full" setResults={setResults} setQuery={setQuery} />

            <ScrollView
                style={styles.container}
            >
                <View style={styles.searchHeader}>
                    {
                        query
                            ? <Text style={styles.searchHeaderText}>Search results for '{query}'</Text>
                            :
                            <Text style={styles.searchHeaderText}>
                                Your recent searches
                            </Text>
                    }

                </View>
                <View style={styles.searchResult}>
                    {
                        results ?
                            results.map(item => {
                                return <StoreCard key={item._id} store={item} navigation={props.navigation} />
                            })
                            : null
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#fff",
        height: "100%",
    },
    searchHeader: {
        paddingHorizontal: 20,
    },
    searchHeaderText: {
        fontSize: 12,
        color: "#666"
    },
    searchResult: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 50,
    }
})

export default SearchFull