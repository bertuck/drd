import { createStore, combineReducers, compose, applyMiddleware } from "redux";

import appSystemReducer from "./reducers/appSystem.jsx";
import weatherReducer from "./reducers/weather.jsx";
import notificationsReducer from "./reducers/appNotifications.jsx";
import drupalContentCreatedReducer from "./reducers/drupalContentCreated.jsx";
import drupalLikesReducer from "./reducers/drupalLikes.jsx";
import drupalLastArticlesReducer from "./reducers/drupalLastArticles.jsx";
import drupalLastNewsReducer from "./reducers/drupalLastNews.jsx";
import drupalLastPagesReducer from "./reducers/drupalLastPages.jsx";
import drupalUsersReducer from "./reducers/drupalUsers.jsx";
import appNavigationTopReducer from "./reducers/appNavigationTop.jsx";
import appNavigationSidebarReducer from "./reducers/appNavigationSidebar.jsx";
import drupalUserReducer from "./reducers/drupalUserReducer.jsx";

import thunk from "redux-thunk";

const defaultStore = {
    app: {
        system : {
            name: 'PROJECT DRD',
            logo: '',
            ready: false,
            page_title: 'Home',
            sidebar_is_collapsed: false,
            current_random_page: 1
        },
        notifications : {
            show: false,
            items : []
        },
        navigation_top : [
            { id: "1", title: 'Home', path: "/home" },
        ],
        navigation_sidebar : [
            { name: 'Home', url: '/home', icon: 'Home', external: false, target: '', active: false},
            { name: 'Data', url: '/data', icon: 'Database', external: false, target: '', active: false},
            { name: 'Node', url: '/random', icon: 'Trello', external: false, target: '', active: false}
        ]
    },
    drupal : {
        user: { uid: '0', name: 'Not logged in' },
        content_created : {},
        likes: {
            isFetching: false,
            data: []
        },
        users: {
            isFetching: false,
            data: []
        },
        last_news: {
            isFetching: false,
            data: []
        },
        last_pages: {
            isFetching: false,
            data: []
        },
        last_articles: {
            isFetching: false,
            data: []
        },
    },
    weather : {
        api_key: "9e714bf7319a727d0ee5a195c96d8234",
        city: "Paris",
        type: "city",
        forecast: "today",
        unit: "metric",
        lat: "",
        lon: "",
        lang : "fr"
    }
};


const appReducer = combineReducers({
    system : appSystemReducer,
    notifications: notificationsReducer,
    navigation_top: appNavigationTopReducer,
    navigation_sidebar: appNavigationSidebarReducer
});

const drupalReducer = combineReducers({
    user: drupalUserReducer,
    content_created : drupalContentCreatedReducer,
    likes: drupalLikesReducer,
    users: drupalUsersReducer,
    last_news: drupalLastNewsReducer,
    last_pages: drupalLastPagesReducer,
    last_articles: drupalLastArticlesReducer
});


const rootReducer = combineReducers({
    app: appReducer,
    drupal: drupalReducer,
    weather: weatherReducer
});

let composeEnhancers = compose;

export const store = createStore(
    rootReducer,
    defaultStore,
    composeEnhancers(applyMiddleware(thunk))
);
