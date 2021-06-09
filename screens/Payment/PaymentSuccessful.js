import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

import { navigationRef } from '../../Navigation/Navigation';
import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';

import styles from './Styles';
const WINDOW_WIDTH = Dimensions.get('window').width;

import PaymentSuccess from './svg/Payment-Success';
import Back from './svg/Back-Button';

const paymentUri = '/payment/createPayment'
const ordertUri = 'order/create/order';

export default (props) => {
  const { state } = useContext(GlobalContext);
  const [orderParams, setorderParams] = useState(props.route.params.orderParams);
  const [paymentParams, setPaymentParams] = useState(props.route.params.paymentParams);

  useEffect(() => {
    const paymentBody = JSON.stringify({
      cred: {
        phone: state.user.phone
      },
      paymentDetail: paymentParams
    })
    const orderBody = JSON.stringify({
      cred: {
        phone: state.user.phone
      },
      orderData: {
        product: orderParams.productID,
        user: state.user._id,
        quantity: orderParams.itemQuantity,
        address: orderParams.customerAddress,
        variant: orderParams.variant,
        amount: orderParams.amount,
        paymentId: orderParams.paymentID,
        email: orderParams.customerEmail,
        status: orderParams.payment
      }
    });

    Post(paymentUri, paymentBody, state.token)
      .then(data => {
        console.log(data)
        Post(ordertUri, orderBody, state.token)
          .then(data => console.log(data))
          .catch(err => console.log(err))

        //navigation resetting
        navigationRef.current?.reset({
          index: 1,
          routes: [
            {
              name: 'LiveStream',
              params: {
                channelName: props.route.params.channelName,
                event: props.route.params.event
              }
            },
            {
              name: 'Home',
            },
          ],
        });
      })
      .catch(err => console.log(err))
  })

  return (
    <View style={styles.innerContainer}>
      <View style={styles.infoContainer}>
        <PaymentSuccess height={WINDOW_WIDTH / 3} width={WINDOW_WIDTH / 3} />
        <Text style={styles.infoTitle}>{'Congratulations!'}</Text>
        <Text style={styles.infoMessage}>{'Your order has been confirmed. Please check your inbox for the receipt.'}</Text>
        <Text style={styles.infoMessage}>{`Your Order No: ${paymentParams.response.result.txnid}`}</Text>
      </View>
      <View style={styles.options}>
        <TouchableOpacity onPress={() => navigationRef.current?.navigate('LiveStream', { channelName: props.route.params.channelName, event: props.route.params.event })} >
          <Back height={56} width={256} style={{ alignSelf: 'center' }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}