import React, { useContext } from 'react';
import { ToastAndroid } from 'react-native';

import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';

import StatusBarWhite from '../../components/StatusBar';
import NavBackButton from '../../components/Header/NavbarBackButton';
import MainBackground from '../../components/Backgrounds/MainBackground';
import FeedbackPage from './FeedbackPage';

const currentUri = 'feedback/callFeedback'

export default (props) => {
    // pass at least product image, event start time, name and descriptions as productDetails.
    const { state } = useContext(GlobalContext);

    const _id = props.route.params.event;
    const productDetails = props.route.params.productDetails;
    const params = ['Call was useful', 'Information was relevant', 'Interested in callback'];
    let feedbackParams = [];

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
        Post(currentUri, body, state.token)
            .then(
                (res) => {
                    if (res.status === 201) res.json().then(data => ToastAndroid.show(data.feedback, ToastAndroid.LONG))
                    else ToastAndroid.show('An error occured. Please try again later.', ToastAndroid.LONG)
                }
            )
            .catch((error) => ToastAndroid.show(error, ToastAndroid.SHORT));
    }

    return (
        <View style={styles.screenContainer}>
            <MainBackground />
            <StatusBarWhite />
            <NavBackButton />
            <ScrollView style={styles.container}>
                <FeedbackPage productDetails={productDetails} feedbackParams={params} callback={updateFeedbackParams} />
            </ScrollView>
        </View>
    )
}