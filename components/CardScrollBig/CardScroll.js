import React from 'react';
import { StyleSheet, Alert, ScrollView, View, FlatList } from 'react-native';

import BigCard from './BigCard'

const CardScroll = () => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                <BigCard />
                <BigCard />
                <BigCard />
                <BigCard />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 400,
        width: "100%",
        marginVertical: 5,
    }
});

export default CardScroll;