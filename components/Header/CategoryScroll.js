import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';

const CategoryScroll = (props) => {
    // const data = [
    //     { id: 1, text: "Apparels" },
    //     { id: 2, text: "Electronics" },
    //     { id: 3, text: "Furniture" },
    //     { id: 4, text: "Beauty Products" },
    //     { id: 5, text: "Showrooms" }
    // ];

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
            <TouchableOpacity style={styles.categoryScrollCard}>
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
    CategoryScrollText: {
        color: "#666",
        paddingHorizontal: 5,
        marginHorizontal: 10,
        fontSize: 10,
        textTransform: "capitalize",
    },
    categoryScrollCard: {
        padding: 5,
        margin: 2,
        marginHorizontal: 10,
        borderRadius: 15,
        backgroundColor: "#fff",
        elevation: 3,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CategoryScroll;