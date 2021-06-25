import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

import { navigationRef } from '../../Navigation/Navigation';
import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';

import PaymentFailure from './svg/Payment-Failure';
import Yes from './svg/Yes-Button';
import No from './svg/No-Button';
import styles from './Styles';

const WINDOW_WIDTH = Dimensions.get('window').width;

const paymentUri = 'payment/createPayment'

export default (props) => {
  const { state } = useContext(GlobalContext);

  useEffect(() => {
    const paymentBody = JSON.stringify({
      paymentDetail: {
        shopout_transaction_id: props.route.params.product.txnID,
        user_id: state.user._id,
        event_id: props.route.params.product.event,
        error_code: props.route.params.paymentParams.code,
        error_description: props.route.params.paymentParams.error.description,
        payment_date: new Date()
      }
    })

    Post(paymentUri, paymentBody, state.token)
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }, [props.route.params])

  return (
    <View style={styles.innerContainer}>
      <View style={styles.infoContainer}>
        <PaymentFailure height={Math.floor(WINDOW_WIDTH / 3)} width={WINDOW_WIDTH / 3} />
        <Text style={styles.infoTitle}>{'Payment Failed!'}</Text>
        <Text style={styles.infoMessage}>{'Your payment for this order could not be completed. If the money has been deducted from your card/bank account, it will be refunded to you withing 2-3 business days.'}</Text>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>{'Do you want to retry?'}</Text>
      </View>
      <View style={styles.options}>
        <TouchableOpacity onPress={() => navigationRef.current?.navigate('Product', { event: props.route.params.event, buyNow: true, channelName: props.route.params.channelName })}>
          <Yes height={64} width={80} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigationRef.current?.navigate('LiveStream')} >
          <No height={64} width={80} />
        </TouchableOpacity>
      </View>
    </View>
  )
}