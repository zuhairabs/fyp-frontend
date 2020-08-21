import * as React from 'react';
import {GlobalContextProvider} from './providers/GlobalContext';
import AppNavigation from './Navigation/Navigation';

const App = () => {
  console.disableYellowBox = true;
  return (
    <GlobalContextProvider>
      <AppNavigation />
    </GlobalContextProvider>
  );
};

export default App;
