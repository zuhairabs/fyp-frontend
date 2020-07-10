import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, Image, View } from 'react-native';

import Other from './svg/other'
import Apparels from './svg/apparels'
import Cafe from './svg/cafe'

const CategoryScroll = (props) => {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const formatData = async () => {
            let data = []
            props.categories.forEach(element => {
                data.push({ key: element._id, name: element.name })
            });
            return data
        }
        formatData().then(data => {
            setCategories(data)
        })
    }, [props.categories])

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.scrollCardContainer}>
                <View style={styles.categoryScrollCard}>
                    {/* <Image source={require(`./svg/${item.name.toLowerCase()}.svg`)} height={12} width={12} /> */}
                    <Other />
                </View>
                <Text style={styles.CategoryScrollText}>
                    {item.name.toLowerCase()}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.CategoryScroll}
            data={categories}
            renderItem={({ item }) => renderItem(item)} />
    );
};

const styles = StyleSheet.create({
    CategoryScroll: {
        marginHorizontal: 20,
        marginBottom: 5,
        marginTop: 5,
        padding: 5,
        flexDirection: "row",
    },
    scrollCardContainer: {
        margin: 2,
        marginHorizontal: 20,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    CategoryScrollText: {
        color: "#666",
        fontSize: 10,
        textTransform: "capitalize",
    },
    categoryScrollCard: {
        paddingVertical: 8,
        marginBottom: 5,
        borderRadius: 12 / 2,
        width: 48,
        backgroundColor: "#fff",
        elevation: 10,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CategoryScroll;