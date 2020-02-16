import React from 'react';

import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/404.jsx';
import DataPage from './pages/DataPage.jsx';
import RandomPage from "./pages/RandomPage";

const pageList = [
  {
    name: 'Home',
    path: '/home',
    component: () => <HomePage />,
  },
  {
    name: 'Blank',
    path: '/random',
    component: () => <RandomPage />,
  },
  {
    name: 'Page',
    path: '/data',
    component: () => <DataPage />,
  },
  {
    name: '404',
    path: '/404',
    component: () => <ErrorPage />,
  },
];

if(module.hot){
  module.hot.accept()
}

export default pageList;
