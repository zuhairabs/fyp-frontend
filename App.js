import * as React from 'react';
import AppNavigation from './Navigation'
import { GlobalContextProvider } from './providers/GlobalContext';

const App = () => {
  console.disableYellowBox = true;
  return (
    <GlobalContextProvider>
      <AppNavigation />
    </GlobalContextProvider>
  );
};

export default App;
