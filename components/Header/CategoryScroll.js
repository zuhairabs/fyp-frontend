import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, Image, View } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

import Other from './svg/other'
import { COLORS, textStyles } from '../../styles/styles';

import { navigationRef } from '../../Navigation'

const CategoryScroll = ({ categories }) => {
    const [dataList, setDataList] = useState([])

    const formatData = async (arr) => {
        let data = []
        arr.forEach(element => {
            data.push({
                key: element._id,
                name: element.name.toLowerCase(),
                icon: element.icon
            })
        });
        return data
    }

    useEffect(() => {
        formatData(categories)
            .then(data => { setDataList(data) })
    }, [categories])

    const renderItem = (item) => {
        return (
            <View style={styles.scrollCardContainer}>
                <>
                    <TouchableNativeFeedback
                        style={styles.categoryScrollCard}
                        onPress={() => {
                            navigationRef.current?.navigate("Categories", { title: item.name, list: categories })
                        }}
                    >
                        {
                            item.icon
                                ? <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.image} />
                                : <Other height={24} width={24} />
                        }
                    </TouchableNativeFeedback>
                    <Text style={styles.CategoryScrollText}>
                        {item.name}
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
            data={dataList}
            renderItem={({ item }) => renderItem(item)}
        />
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