import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import OrderCardSmall from '../../components/Cards/OrderCard/OrderCardSmall';
import {COLORS, textStyles} from '../../styles/styles';
import {GlobalContext} from './../../providers/GlobalContext';
import {Post} from './../../api/http';
import StatusBarWhite from '../../components/StatusBar';

const mlist = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default ({navigation}) => {
  const {state} = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
    });
    Post('profile/fetch/orders', body, state.token).then(
      (data) => {
        setOrders(data.orders);
        // console.log(data.orders);
      },
      (e) => console.log(e),
    );
  }, []);

  // variable for title of month selectors on top of the order list
  const startMonth =
    orders && orders.length > 0 ? new Date(orders[0].date).getUTCMonth() : null;
  const endMonth =
    orders && orders.length > 0
      ? new Date(orders[orders.length - 1].date).getUTCMonth()
      : null;

  return (
    <>
      <StatusBarWhite />
      <View style={styles.monthSelectorContainer}>
        {orders && orders.length > 0 ? (
          <Text style={styles.selectedMonth}>
            {startMonth === endMonth ? (
              <Text>
                {mlist[endMonth]} {new Date().getUTCFullYear()}
              </Text>
            ) : (
              <Text>
                {mlist[startMonth]} - {mlist[endMonth]}{' '}
                {new Date().getUTCFullYear()}
              </Text>
            )}
          </Text>
        ) : (
          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height - 480,
              justifyContent: 'center',
              flex: 1,
              marginTop: 120,
            }}>
            <Image
              source={require('../../components/UXComponents/svg/EmptyPage.png')}
              style={{
                width: undefined,
                height: undefined,
                flex: 1,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                color: '#666',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                paddingHorizontal: 40,
                fontSize: 16,
              }}>
              Nothing here!
            </Text>
          </View>
        )}
      </View>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.results}>
          {orders &&
            orders.map((order, _) => {
              return (
                <OrderCardSmall
                  key={order._id}
                  order={order}
                  navigation={navigation}
                />
              );
            })}
        </View>
      </ScrollView>
    </>
  );
};

export const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 100,
  },
  monthSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedMonth: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmall,
  },
  results: {
    marginTop: 20,
  },
});
