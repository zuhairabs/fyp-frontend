import React from 'react';
import { Text, View, Image } from 'react-native';

import styles from './Styles';

export default ProductDetails = React.memo(({ prodDet }) => {
  console.log('In Details...')
  return (
    <View style={styles.productDeatilContainer}>
      <View style={styles.shadow}>
        <Image source={{ uri: `data:image/gif;base64,${prodDet.image}` }} style={styles.image} />
      </View>
      <View style={styles.description}>
        <Text style={{ fontWeight: '700' }}>{prodDet.name}</Text>
        <Text style={{ fontSize: 14 }}>{prodDet.desc}</Text>
      </View>
    </View>
  )
})
