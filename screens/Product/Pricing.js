import React from 'react';
import { Text, View } from 'react-native';
import styles from './Styles';

export default (props) => {

  const productPrice = props.prodPrice;

  const price = (productPrice.price * props.qty)
  const sgst = (productPrice.sgst * 0.01 * productPrice.price * props.qty);
  const cgst = (productPrice.cgst * 0.01 * productPrice.price * props.qty);
  const discount = (productPrice.discount * 0.01 * productPrice.price * props.qty);
  const total = (price - discount);
  const priceTotal = (total + productPrice.deliveryCharge + sgst + cgst);

  const updates = (price) => {
    props.callback(price);
  }

  const commaFormatPrice = (price, update) => {
    if (update === 1 && props.callback !== undefined) updates(price);

    var x = price.toString();
    var afterDecimal = '';
    if (x.indexOf('.') > 0) afterDecimal = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    const commaPrice = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterDecimal;

    return commaPrice;
  }

  return (
    <View style={styles.pricingContainer} >
      <View style={styles.pricing}>
        <Text style={styles.label}>Actual Price</Text>
        <Text style={styles.value}>{commaFormatPrice(price.toFixed(2), 0)}</Text>
      </View>
      <View style={styles.pricing}>
        <Text style={styles.label}>Discount</Text>
        <Text style={[styles.value, { color: '#ff0000' }]}>{commaFormatPrice(discount.toFixed(2), 0)}</Text>
      </View>
      <View style={styles.pricing}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{commaFormatPrice(total.toFixed(2), 0)}</Text>
      </View>
      <View style={styles.pricing}>
        <Text style={styles.label}>SGST</Text>
        <Text style={styles.value}>{commaFormatPrice(sgst.toFixed(2), 0)}</Text>
      </View>
      <View style={styles.pricing}>
        <Text style={styles.label}>CGST</Text>
        <Text style={styles.value}>{commaFormatPrice(cgst.toFixed(2), 0)}</Text>
      </View>
      <View style={styles.pricing}>
        <Text style={styles.label}>Delivery Charges</Text>
        <Text style={styles.value}>{commaFormatPrice(productPrice.deliveryCharge, 0)}</Text>
      </View>
      <View style={styles.pricing}>
        <Text style={styles.label}>Pay Total</Text>
        <Text style={[styles.value, { fontWeight: '700' }]}>{commaFormatPrice(priceTotal.toFixed(2), 1)}</Text>
      </View>
    </View>
  )
}