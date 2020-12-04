import React, {useEffect, useContext} from 'react';
import {DeviceEventEmitter, Platform} from 'react-native';
import IncomingCall from 'react-native-incoming-call';
import {GlobalContextProvider} from './providers/GlobalContext';
import AppNavigation from './Navigation/Navigation';
import {navigationRef} from './Navigation/Navigation';

const App = () => {
   useEffect(() => {
    if (Platform.OS === "android") {
  /**
   * App open from killed state (headless mode)
   */
      const payload = IncomingCall.getExtrasFromHeadlessMode();
    //console.log('launchParameters', payload);
    if (payload) {
      // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
	  console.log(payload);
    }
 
    /**
     * App in foreground / background: listen to call events and determine what to do next
    */
      DeviceEventEmitter.addListener("endCall", payload => {
      // End call action here
	  console.log("Ended");
	  
    });
    DeviceEventEmitter.addListener("answerCall", payload => {
      // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
	  navigationRef.current?.navigate('RTCVideo', {
          channelName: payload.uuid,
        })
    });
  }
}, []);

  console.disableYellowBox = true;
  return (
    <GlobalContextProvider>
      <AppNavigation />
    </GlobalContextProvider>
  );
};

export default App;
