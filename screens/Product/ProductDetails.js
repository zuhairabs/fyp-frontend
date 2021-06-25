import React from 'react';
import { Text, View, Image } from 'react-native';
import Delivery from '../../components/UXComponents/svg/delivery'

import styles from './Styles';

export default ProductDetails = React.memo(({ prodDet }) => {
  // console.log('In Details...')
  return (
    <View style={styles.productDeatilContainer}>
      <View style={styles.shadow}>
        <Image source={{ uri: `data:image/gif;base64,${prodDet.image}` }} style={styles.image} />
        {
          prodDet.deliveryCharge === 0 ?
            (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '5%' }} >
              <Delivery height={20} width={20} />
              <Text style={{ fontSize: 12, color: '#757575' }}>{'Free Delivery'}</Text>
            </View>
            )
            :
            null
        }
      </View>
      <View style={styles.description}>
        <Text style={{ fontWeight: '700' }}>{prodDet.name}</Text>
        <Text style={{ fontSize: 12, color: '#757575' }}>{prodDet.desc}</Text>
      </View>
    </View>
  )
})
