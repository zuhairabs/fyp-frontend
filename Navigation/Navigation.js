import React, {useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GlobalContext} from '../providers/GlobalContext';
import notificationListener from '../NotificationHandler';
import RootStack from './Stacks/RootStack';

export const navigationRef = React.createRef();

export default AppNavigation = () => {
  const {authActions, state} = useContext(GlobalContext);
  useEffect(() => {
    authActions.retrieveToken();
    notificationListener(authActions.setNotifications);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack state={state} />
    </NavigationContainer>
  );
};
