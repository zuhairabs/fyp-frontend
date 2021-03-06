import React, {useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GlobalContext} from '../providers/GlobalContext';
import NotificationListener from '../controllers/Notifications/NotificationListener';
import RootStack from './Stacks/RootStack';

export const navigationRef = React.createRef();
const AppNavigation = () => {
  const {authActions, state} = useContext(GlobalContext);
  useEffect(() => {
    authActions.retrieveToken();
    // subscribe to firebase notifications on stack init
    NotificationListener(authActions.setNotifications);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack state={state} />
    </NavigationContainer>
  );
};

export default AppNavigation;
