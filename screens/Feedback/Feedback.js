import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, ToastAndroid, BackHandler } from 'react-native';

import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';
import styles from './Styles';

import StatusBarWhite from '../../components/StatusBar';
import NavBackButton from '../../components/Header/NavbarBackButton';
// import MainBackground from '../../components/Backgrounds/MainBackground';
import LoadingContainer from './Container/LoadingContainer';
import FeedbackPage from './FeedbackPage';
import { navigationRef } from '../../Navigation/Navigation';

const demoBookingUri = 'demoBooking/fetch/single'
const feedbackUri = 'feedback/callFeedback'

export default (props) => {
    const { state } = useContext(GlobalContext);

    const _id = props.route.params.event;
    const [productDetails, setProductDeatils] = useState({});
    const [loading, setLoading] = useState(true);
    const params = ['Call was useful', 'Information was relevant', 'Interested in callback'];
    let feedbackParams = [];

    useEffect(() => {
        const body = JSON.stringify({
            cred: {
                phone: state.user.phone,
            },
            bookingData: { _id: _id }
        });

        Post(demoBookingUri, body, state.token)
            .then((data) => {
                console.log("Feedback ==> ", data.demobooking.demoName);
                setProductDeatils(data.demobooking);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }, [props.route.params])

    // after user gives feedback, there's a callback to below function.
    const updateFeedbackParams = (arr) => {
        feedbackParams = arr;
        postFeedack();
    }
    const postFeedack = () => {
        const body = JSON.stringify({
            cred: { phone: state.user.phone, },
            bookingData: { _id: _id },
            feedback: {
                callUseful: feedbackParams[0],
                relevantInfo: feedbackParams[1],
                callback: feedbackParams[2]
            }
        })
        Post(feedbackUri, body, state.token)
            .then(data => {
                if (data.feedback) {
                    ToastAndroid.show('Feedback given!', ToastAndroid.LONG);
                    navigationRef.current?.navigate('Home');
                }
                else ToastAndroid.show('An error occured. Please try again later.', ToastAndroid.LONG)
            })
            .catch((error) => ToastAndroid.show(error, ToastAndroid.SHORT));
    }

    return (
        <View style={styles.screenContainer}>
            {/* <MainBackground /> */}
            <StatusBarWhite />
            {/* <NavBackButton /> */}
            <ScrollView style={styles.container}>
                {
                    loading ?
                        <LoadingContainer />
                        :
                        <FeedbackPage productDetails={productDetails} feedbackParams={params} callback={updateFeedbackParams} leaveTime={props.route.params.leaveTime} />
                }
            </ScrollView>
        </View>
    )
}