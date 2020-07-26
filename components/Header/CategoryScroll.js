import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Other from './svg/other'
import { COLORS, textStyles } from '../../styles/styles';

const CategoryScroll = (props) => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const formatData = async () => {
            let data = []
            props.categories.forEach(element => {
                data.push({
                    key: element._id,
                    name: element.name,
                    icon: element.icon
                })
            });
            return data
        }
        formatData().then(data => {
            setCategories(data)
        })
    }, [props.categories])

    const renderItem = (item) => {
        return (
            <View style={styles.scrollCardContainer}>
                <>
                    <TouchableOpacity style={styles.categoryScrollCard}>
                        {
                            item.icon
                                ? <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.image} />
                                : <Other height={24} width={24} />
                        }
                    </TouchableOpacity>
                    <Text style={styles.CategoryScrollText}>
                        {item.name.toLowerCase()}
                    </Text>
                </>
            </View>
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
        marginBottom: 5,
        marginTop: 5,
        padding: 10,
        flexDirection: "row",
    },
    scrollCardContainer: {
        margin: 2,
        marginHorizontal: 18,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        resizeMode: "contain",
        flex: 1,
        height: 24,
        width: 24,
        opacity: 0.6
    },
    CategoryScrollText: {
        ...textStyles.paragraphExtraSmall,
        color: COLORS.SECONDARY,
        textTransform: "capitalize",
    },
    categoryScrollCard: {
        marginBottom: 5,
        borderRadius: 12 / 2,
        height: 50,
        width: 50,
        backgroundColor: COLORS.WHITE,
        elevation: 10,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default CategoryScroll;