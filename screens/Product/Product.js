import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';

import StatusBarWhite from '../../components/StatusBar';
import LoadingContainer from './Container/LoadingContainer';

import Cart from './Cart';

import styles from './Styles';

const currentUri = 'order/fetch/product';

export default Product = (props) => {
  //need to pass a buyNow flag in props. buyNow: false when coming from 'My Orders' page, true otherwise.
  const { state } = useContext(GlobalContext);

  const _id = !props.route.params.buyNow ? props.route.params.orderData.product : props.route.params.event;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
      event: _id
    });

    Post(currentUri, body, state.token)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, [props.route.params]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />
      <ScrollView>
        {
          loading ?
            <LoadingContainer />
            :
            props.route.params.buyNow ?
              <Cart productDetail={product} buyNow={true} channelName={props.route.params.channelName} event={props.route.params.event} />
              :
              <Cart productDetail={product} buyNow={false} orderDetail={orderData} />
        }
      </ScrollView>
    </View>
  );
};