import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, View, BackHandler, KeyboardAvoidingView, TouchableOpacity, Dimensions, ToastAndroid, ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import RazorpayCheckout from 'react-native-razorpay';

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
import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';

const WINDOW_WIDTH = Dimensions.get('window').width;

const verificationUri = 'payment/razorpay/verifyPayment';
const razorOrderUri = 'payment/razorpay/createOrder';

export default Cart = React.memo(props => {
  const { state } = useContext(GlobalContext);

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

  const validateEmail = (input) => {
    let regEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    regEmail.test(input) ? setEmail(input) : ToastAndroid.show("Incorrect email.", ToastAndroid.SHORT);
  }

  const checkAddressEmail = () => {
    if (!address) ToastAndroid.show("Please fill in the address.", ToastAndroid.SHORT);
    else if (!email) ToastAndroid.show("Please fill in your email.", ToastAndroid.SHORT);
    else payNow();
  }

  const payNow = () => {
    console.log('Initiating payment...')

    const orderParams = {
      productID: product._id,
      event: props.productDetail.product.event,
      name: product.name,
      amount: payTotal,
      variant: variantType,
      customerEmail: email,
      customerPhone: state.user.phone,
      customerName: `${state.user.firstName} ${state.user.lastName}`,
      customerAddress: address,
      itemQuantity: quantity,
      txnID: txnid
    }

    createOrder(orderParams)
  }

  const createOrder = async (product) => {
    console.log('createOrder...');

    const body = JSON.stringify({
      paymentDetails: {
        amount: product.amount * 100,
        currency: 'INR'
      }
    })
    Post(razorOrderUri, body, state.token)
      .then(order => {
        console.log(order);
        return razorpayProcess(order.order, product);
      })
      .catch(err => console.warn(err));
  }

  const razorpayProcess = async (order, productData) => {
    console.log('razorpayProcess...');

    var options = {
      description: `Payment for ${productData.name}`,
      notes: {
        product: `${productData.name}-${productData.variant}`,
        transactionID: productData.txnID
      },
      image: 'https://media-exp1.licdn.com/dms/image/C4E0BAQHRR-xEa_e_9A/company-logo_200_200/0/1595433439244?e=1630540800&v=beta&t=1E282UAzKahyjmdejgdA3i7afxL7DlHRcfdznmvr92Y',
      currency: order.currency,
      key: 'rzp_test_vLyTJZelJNXK3A',
      amount: order.amount,
      order_id: order.id,
      name: 'ShopOut',
      prefill: {
        email: productData.customerEmail,
        contact: productData.customerPhone,
        name: productData.customerName
        // method: 'upi'
      },
      theme: { color: '#0063ff' },
      sendsmshash: true,
      modal: {
        confirm_close: true,
        handleback: true,
        animation: true
      },
      retry: {
        enabled: true,
        max_count: 2
      }
    }
    RazorpayCheckout.open(options)
      .then((data) => {
        Post(verificationUri, JSON.stringify({ orderID: order.razorpay_order_id, transaction: data }), state.token)
          .then(verified => verified ? successStack(productData, data) : console.error("SECURITY BREACH! TRANSACTION PROCESS HACKED."))
          .catch(err => console.log(err));
      })
      .catch((error) => {
        console.warn(error);
        failureStack(error, productData)
      });
  }

  const successStack = (orderParams, paymentParams) => {
    navigationRef.current?.reset({
      index: 2,
      routes: [
        {
          name: 'Home',
        },
        {
          name: 'LiveStream',
          params: {
            channelName: props.channelName,
            event: props.event
          }
        },
        {
          name: 'PaymentSuccess',
          params: {
            orderParams: orderParams,
            paymentParams: paymentParams,
            channelName: props.channelName,
            event: props.event
          }
        },
      ],
    })
  }

  const failureStack = (error, productData) => {
    navigationRef.current?.reset({
      index: 2,
      routes: [
        {
          name: 'Home',
        },
        {
          name: 'LiveStream',
          params: {
            channelName: props.channelName,
            event: props.event
          }
        },
        {
          name: 'PaymentFailure',
          params: {
            product: productData,
            paymentParams: error,
            channelName: props.channelName,
            event: props.event
          }
        },
      ],
    })
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => navigationRef.current?.navigate('LiveStream', { channelName: props.channelName, event: props.event }));
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => navigationRef.current?.navigate('LiveStream', { channelName: props.channelName, event: props.event }));
    }
  })

  return (
    <ScrollView style={styles.container} >
      <View style={styles.cartContainer} >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled={true} keyboardVerticalOffset={0} >

          <View style={styles.innerContainer}>

            <ProductDetails prodDet={product} />

            {
              !props.buyNow ?
                (
                  <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <View style={styles.dropDownBar}>
                      <Text style={styles.dropText}>{`Qty: ${order.quantity}`}</Text>

                    </View>

                    <View style={styles.dropDownBar}>
                      <Text style={styles.dropText}>{`Variant: ${order.variant}`}</Text>

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
                        style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 140, maxWidth: Math.floor(WINDOW_WIDTH) }}
                        multiline={true}
                        placeholder={order.email}
                        placeholderTextColor={'#0E0E0E'}
                        editable={false}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', marginTop: '-10%' }}>
                    {
                      !props.productDetail.sold ?
                        <View style={styles.dropDownBar}>
                          <Text style={styles.dropText}>{'Qty:'}</Text>
                          <ModalDropdown
                            options={new Array(product.quantity).fill().map((_, i) => (i + 1).toString())}
                            defaultIndex={0}
                            defaultValue={'1'}
                            onSelect={(idx, value) => setQuantity(value)}
                            textStyle={{
                              fontSize: 16,
                              textAlign: 'center',
                              width: Math.floor(WINDOW_WIDTH / 10),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                            dropdownStyle={{
                              marginTop: -Math.floor(WINDOW_WIDTH / 12),
                            }}
                            dropdownTextStyle={{
                              fontSize: 16,
                              textAlign: 'center',
                              width: Math.floor(WINDOW_WIDTH / 10),
                            }}
                            style={{
                              borderWidth: 1,
                              borderRadius: 8,
                              borderColor: '#FAFAFA',
                              marginLeft: '1%',
                              padding: 2,
                              backgroundColor: '#E0E0E0'
                            }}
                          />
                        </View>
                        :
                        null
                    }

                    <View style={styles.dropDownBar}>
                      <Text style={styles.dropText}>{'Variant:'}</Text>
                      <ModalDropdown
                        options={product.variants}
                        defaultIndex={0}
                        defaultValue={product.variants[0]}
                        onSelect={(idx, value) => setVariantType(value)}
                        textStyle={{
                          fontSize: 16,
                          textAlign: 'center',
                          width: Math.floor(WINDOW_WIDTH / 5),
                          color: 'white',
                          fontWeight: 'bold'
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
                          borderColor: '#FAFAFA',
                          borderRadius: 8,
                          marginLeft: '1%',
                          padding: 2,
                          backgroundColor: '#E0E0E0',
                          textAlign: 'center'
                        }}
                      />
                    </View>

                    {
                      !props.productDetail.sold ?
                        <Pricing key={quantity} prodPrice={product} qty={quantity} callback={updateTotal} />
                        :
                        <Pricing key={quantity} prodPrice={product} qty={1} callback={updateTotal} />
                    }
                    {
                      props.productDetail.sold ?
                        <View>
                          <Text
                            style={{ color: 'red', fontSize: 16, fontWeight: 'bold',  }}>
                            {'Product is currently Sold Out!'}
                          </Text>
                        </View>
                        :
                        null
                    }

                    {
                      !props.productDetail.sold ?
                        <View style={styles.address}>
                          {!address.trim() ? <Add height={32} width={32} style={{ marginLeft: Math.floor(WINDOW_WIDTH / 50) }} /> : null}
                          <TextInput
                            autoCompleteType='off'
                            style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 170, maxWidth: Math.floor(WINDOW_WIDTH) }}
                            multiline={true}
                            placeholder={'Add Address'}
                            placeholderTextColor={'#0E0E0E'}
                            onChangeText={text => setAddress(text.trim())}
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
                            autoCompleteType='off'
                            style={{ color: '#000', fontSize: 16, marginLeft: 10, height: 100, maxWidth: Math.floor(WINDOW_WIDTH) }}
                            multiline={true}
                            placeholder={'Add your email'}
                            placeholderTextColor={'#0E0E0E'}
                            // onChangeText={text => validateEmail(text.trim())}
                            onEndEditing={(event) => validateEmail(event.nativeEvent.text.trim())}
                          />
                        </View>
                        :
                        null
                    }

                    {
                      !props.productDetail.sold ?
                        <TouchableOpacity onPress={() => { checkAddressEmail() }}>
                          <PayNow height={Math.floor(WINDOW_WIDTH / 5)} width={Math.floor(WINDOW_WIDTH / 1.3)} />
                        </TouchableOpacity>
                        :
                        null
                    }

                  </View>
                )
            }

          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
})