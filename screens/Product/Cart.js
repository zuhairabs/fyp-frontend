import React from 'react';
import { Text, TextInput, View, StatusBar, KeyboardAvoidingView, ScrollView, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import PayuMoney, { HashGenerator } from 'react-native-payumoney';
import { useState } from 'react';
import { useEffect } from 'react';
import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';
const charset = "0123456789";
const nanoid = customAlphabet(charset, 10);

import ProductDetails from './ProductDetails';
import Pricing from './Pricing';

import PayNow from './svg/Pay-Now';
import Add from './svg/Add';

import styles from './Styles';
import { navigationRef } from '../../Navigation/Navigation';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default Cart = React.memo(props => {
  const [product, setProduct] = useState(props.productDetail.product);
  const [order, setOrder] = useState(props.orderDetail);
  const [payTotal, setPayTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [variantType, setVariantType] = useState(product.variants[0]);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const txnid = props.buyNow ? `SHOT${nanoid()}` : null;

  const updateTotal = (priceTotal) => {
    useEffect(() => {
      setPayTotal(priceTotal);
    })
  }

  // const validateEmail = (input) => {
  //   let regEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  //   regEmail.test(input) ? setEmail(input) : ToastAndroid.show("Incorrect email.", ToastAndroid.SHORT);
  // }

  // const checkAddressEmail = () => {
  //   if (!address) ToastAndroid.show("Please fill in the address.", ToastAndroid.SHORT);
  //   else if (!email) ToastAndroid.show("Please fill in your email.", ToastAndroid.SHORT);
  //   else pay();
  // }

  // const successStack = (orderParams, paymentParams) => {
  //   navigationRef.current?.reset({
  //     index: 2,
  //     routes: [
  //       {
  //         name: 'Home',
  //       },
  //       {
  //         name: 'LiveStream',
  //         params: {
  //           channelName: props.channelName,
  //           event: props.event
  //         }
  //       },
  //       {
  //         name: 'PaymentSuccess',
  //         params: {
  //           orderParams: orderParams,
  //           paymentParams: paymentParams,
  //           channelName: props.channelName,
  //           event: props.event
  //         }
  //       },
  //     ],
  //   })
  // }

  // const FailureStack = () => {
  //   navigationRef.current?.reset({
  //     index: 2,
  //     routes: [
  //       {
  //         name: 'Home',
  //       },
  //       {
  //         name: 'LiveStream',
  //         params: {
  //           channelName: props.channelName,
  //           event: props.event
  //         }
  //       },
  //       {
  //         name: 'PaymentFailure',
  //         params: {
  //           channelName: props.channelName,
  //           event: props.event,

  //         }
  //       },
  //     ],
  //   })
  // }

  // const pay = () => {


  //   // const hash = HashGenerator({
  //   //   key: "GKTsy6",
  //   //   amount: payTotal.toString(),
  //   //   email: email,
  //   //   txnId: txnid.toString(),
  //   //   productName: `${product.name}-${variantType}`,
  //   //   firstName: "John",
  //   //   salt: "f23CXnEh",
  //   //   udf1: product._id,
  //   //   udf2: props.user
  //   // });

  //   // const payData = {
  //   //   amount: payTotal.toString(),
  //   //   txnId: txnid.toString(),
  //   //   productName: `${product.name}-${variantType}`,
  //   //   firstName: 'John',
  //   //   email: email,
  //   //   phone: '9876543211',
  //   //   merchantId: '8138429',
  //   //   key: 'GKTsy6',
  //   //   successUrl: 'https://www.payumoney.com/mobileapp/payumoney/success.php',
  //   //   failedUrl: 'https://www.payumoney.com/mobileapp/payumoney/failure.php',
  //   //   isDebug: true,
  //   //   hash: hash,
  //   //   udf1: product._id,
  //   //   udf2: props.user
  //   // };

  //   const hash = HashGenerator({
  //     key: "QylhKRVd", //rjQUPktU
  //     amount: payTotal.toString(),
  //     email: email,
  //     txnId: txnid.toString(),
  //     productName: `${product.name}-${variantType}`,
  //     firstName: "Purnima",
  //     salt: "seVTUgzrgE", //e5iIg1jwi8
  //     udf1: product._id,
  //     udf2: props.user
  //   });

  //   const payData = {
  //     amount: payTotal.toString(),
  //     txnId: txnid.toString(),
  //     productName: `${product.name}-${variantType}`,
  //     firstName: 'Purnima',
  //     email: email,
  //     phone: '8901298677',
  //     merchantId: '5960507', //4934580 
  //     key: 'QylhKRVd', //rjQUPktU
  //     successUrl: 'https://www.payumoney.com/mobileapp/payumoney/success.php',
  //     failedUrl: 'https://www.payumoney.com/mobileapp/payumoney/failure.php',
  //     isDebug: true,
  //     hash: hash,
  //     udf1: product._id,
  //     udf2: props.user
  //   };

  //   PayuMoney(payData)
  //     .then((data) => {
  //       var success = false;
  //       success = data.success;
  //       console.log("data for payu ===> ", data)

  //       const orderParams = {
  //         paymentID: data.response.result.paymentId,
  //         productID: product._id,
  //         amount: payTotal,
  //         variant: variantType,
  //         customerEmail: email,
  //         customerAddress: address,
  //         itemQuantity: quantity,
  //         paymment: 'success'
  //       }

  //       success ? successStack(orderParams, data) : FailureStack();
  //     })
  //     .catch((error) => {
  //       console.log('error: ', error);
  //       FailureStack();
  //     })
  // };

  return (
    <View style={styles.cartContainer} >

      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        animated={true}
        translucent
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled={true} >

        <ScrollView>

          <View style={styles.innerContainer}>

            <ProductDetails prodDet={product} />

            {
              !props.buyNow ?
                (
                  <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <View style={styles.dropDownBar}>
                      <Text style={styles.dropText}>{`Quantity ${order.quantity}`}</Text>

                    </View>

                    <View style={styles.dropDownBar}>
                      <Text style={styles.dropText}>{`Variant ${order.variant}`}</Text>

                    </View>

                    <Pricing key={order.quantity} prodPrice={product} qty={order.quantity} />


                    <View style={styles.address}>
                      <TextInput
                        style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 60, maxWidth: Math.floor(WINDOW_WIDTH) }}
                        multiline={true}
                        placeholder={order.address}
                        placeholderTextColor={'#0E0E0E'}
                        editable={false}
                      />
                    </View>

                    <View style={styles.email}>
                      <TextInput
                        style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 140, maxWidth: Math.floor(WINDOW_WIDTH / 1.85) }}
                        multiline={true}
                        placeholder={order.email}
                        placeholderTextColor={'#0E0E0E'}
                        editable={false}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    {
                      !props.productDetail.sold ?
                        <View style={styles.dropDownBar}>
                          <Text style={styles.dropText}>Quantity</Text>
                          <ModalDropdown
                            options={new Array(product.quantity).fill().map((_, i) => (i + 1).toString())}
                            defaultIndex={0}
                            defaultValue={'1'}
                            onSelect={(idx, value) => setQuantity(value)}
                            textStyle={{
                              fontSize: 16,
                              textAlign: 'center',
                              width: Math.floor(WINDOW_WIDTH / 5),
                            }}
                            dropdownStyle={{
                              marginTop: -Math.floor(WINDOW_WIDTH / 12),
                            }}
                            dropdownTextStyle={{
                              fontSize: 16,
                              textAlign: 'center',
                              width: Math.floor(WINDOW_WIDTH / 5),
                            }}
                            style={{
                              borderWidth: 0.7,
                              borderColor: 'FAFAFA',
                              marginLeft: Math.floor(WINDOW_WIDTH / 35),
                              padding: 2
                            }}
                          />
                        </View>
                        :
                        <View style={styles.dropDownBar}>
                          <Text style={{ color: 'red', fontSize: 14, fontWeight: 'bold', width: Math.floor(WINDOW_WIDTH / 1.9) }}>{'Product is currently Sold Out!'}</Text>
                        </View>
                    }

                    <View style={styles.dropDownBar}>
                      <Text style={styles.dropText}>Variant</Text>
                      <ModalDropdown
                        options={product.variants}
                        defaultIndex={0}
                        defaultValue={product.variants[0]}
                        onSelect={(idx, value) => setVariantType(value)}
                        textStyle={{
                          fontSize: 16,
                          textAlign: 'center',
                          width: Math.floor(WINDOW_WIDTH / 3.5),
                        }}
                        dropdownStyle={{
                          marginTop: -Math.floor(WINDOW_WIDTH / 12),
                        }}
                        dropdownTextStyle={{
                          fontSize: 16,
                          textAlign: 'center',
                          width: Math.floor(WINDOW_WIDTH / 3.5),
                        }}
                        style={{
                          borderWidth: 0.7,
                          borderColor: 'FAFAFA',
                          marginLeft: Math.floor(WINDOW_WIDTH / 35),
                          padding: 2
                        }}
                      />
                    </View>

                    {!props.productDetail.sold ?
                      <Pricing key={quantity} prodPrice={product} qty={quantity} callback={updateTotal} /> : <Pricing key={quantity} prodPrice={product} qty={1} callback={updateTotal} />
                    }

                    {/* {
                      !props.productDetail.sold ?
                        <View style={styles.address}>
                          {!address.trim() ? <Add height={32} width={32} style={{ marginLeft: Math.floor(WINDOW_WIDTH / 50) }} /> : null}
                          <TextInput
                            autoCompleteType='street-address'
                            style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 170, maxWidth: Math.floor(WINDOW_WIDTH) }}
                            multiline={true}
                            placeholder={'Add Address'}
                            placeholderTextColor={'#0E0E0E'}
                            onEndEditing={(event) => setAddress(event.nativeEvent.text.trim())}
                          />
                        </View>
                        :
                        null
                    }

                    {
                      !props.productDetail.sold ?
                        <View style={styles.email}>
                          {!email.trim() ? <Add height={32} width={32} style={{ marginLeft: Math.floor(WINDOW_WIDTH / 50) }} /> : null}
                          <TextInput
                            autoCompleteType='email'
                            style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 100, maxWidth: Math.floor(WINDOW_WIDTH / 1.85) }}
                            multiline={true}
                            placeholder={'Add your email'}
                            placeholderTextColor={'#0E0E0E'}
                            onEndEditing={(event) => validateEmail(event.nativeEvent.text.trim())}
                          />
                        </View>
                        :
                        null
                    } */}

                    {/* {
                      !props.productDetail.sold ?
                        <TouchableOpacity onPress={() => { checkAddressEmail() }}>
                          <PayNow height={Math.floor(WINDOW_WIDTH / 5)} width={Math.floor(WINDOW_WIDTH / 1.3)} />
                        </TouchableOpacity>
                        :
                        null
                    } */}

                  </View>
                )
            }

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
})