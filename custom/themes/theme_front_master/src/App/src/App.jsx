import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import { store } from "./stores/Store.jsx";

import './assets/styles.scss';
import SidebarLayout from "./layouts/SidebarLayout";


export default function App() {
    if (typeof drupalSettings !== undefined)
        return (
            <Provider store={store}>
                <SidebarLayout drupal={drupalSettings} />
            </Provider>
        );
    return (
        <Provider store={store}>
            <SidebarLayout drupal={null} />
        </Provider>
    );
};
