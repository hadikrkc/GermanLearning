import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import Layouts from './layouts';
import './lang';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layouts />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
