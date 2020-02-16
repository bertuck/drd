import {pushNotification} from "./general";

export const initDrupal = (drupal) => dispatch => {
    if (drupal && drupal.currentUser.uid && drupal.currentUser.uid !== '0' && drupal.currentUser.name) {
        dispatch({ type: 'UPDATE_USER' , payload : { uid: drupal.currentUser.uid, name: drupal.currentUser.name }});
        dispatch(pushNotification({title: 'Boujour ' +  drupal.currentUser.name + ' :', text : "Bienvenue sur le Dashboard.", type: "success"}));
    } else {
        dispatch(pushNotification({title: 'Utilisateur non connecté :', text : "Veuillez vous authentifier pour acceder à toutes les fonctionnalités du dashboard.", type: "warning"}));
    }
};

export const fetchLikes = () => (dispatch, getState) => {
    dispatch({ type: 'FETCHING_LIKES' });
    dispatch(fetchFastLikes());

};

export const fetchFastLikes = () => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/liked/nodes')
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined')
                dispatch({ type:'UPDATE_LIKES', payload: data });
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "Reading data api/likes", type: "danger"}));
        })
};

export const fetchContentCreated = () => (dispatch, getState) => {
    dispatch({ type: 'FETCHING_CONTENT_CREATED' });
    dispatch(fetchFastContentCreated());
};

export const fetchFastContentCreated = () => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/content/created')
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined')
                dispatch({ type:'UPDATE_CONTENT_CREATED', payload: Object.values(data)[0] });
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "Reading data api/content/created", type: "danger"}));
        })
};

export const fetchUsers = (limit) => (dispatch, getState) => {
    dispatch({ type: 'FETCHING_USERS' });
    dispatch(fetchFastUsers(limit));
};

export const fetchFastUsers = (limit) => (dispatch, getState) => {
    fetch('/api/users/'+limit)
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined')
                dispatch({ type:'UPDATE_USERS', payload:data });
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "Reading data users", type: "danger"}));
        })
};

export const fetchLastArticles = (limit) => (dispatch, getState) => {
    dispatch({ type: 'FETCHING_LAST_ARTICLES' });
    dispatch(fetchFastLastArticles(limit));
};

export const fetchFastLastArticles = (limit) => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/content/article/'+limit)
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined')
                dispatch({ type:'UPDATE_LAST_ARTICLES', payload:data });
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "Reading data last articles", type: "danger"}));
        })
};

export const fetchLastNews = (limit) => (dispatch, getState) => {
    dispatch({ type: 'FETCHING_LAST_NEWS' });
    dispatch(fetchFastLastNews(limit));
};

export const fetchFastLastNews = (limit) => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/content/news/'+limit)
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined')
                dispatch({ type:'UPDATE_LAST_NEWS', payload:data });
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "Reading data last News", type: "danger"}));
        })
};

export const fetchLastPages = (limit) => (dispatch, getState) => {
    dispatch({ type: 'FETCHING_LAST_DGAG' });
    dispatch(fetchFastLastPages(limit));
};

export const fetchFastLastPages = (limit) => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/content/page/'+limit)
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined')
                dispatch({ type:'UPDATE_LAST_PAGES', payload:data });
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "Reading data last Pages", type: "danger"}));
        })
};

export const setFlag = (nid) => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/flag/' + nid)
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined') {
                dispatch(fetchFastLikes());
                dispatch(fetchFastLastArticles(100));
                dispatch(fetchFastLastNews(100));
            }
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "setFlag", type: "danger"}));
        });
};

export const deleteFlag = (nid) => (dispatch, getState) => {
    fetch('/api/' + getState().drupal.user.uid + '/unflag/' + nid)
        .then(response => response.json())
        .then(data => {
            if (typeof data.error === 'undefined') {
                dispatch(fetchFastLikes());
                dispatch(fetchFastLastArticles(100));
                dispatch(fetchFastLastNews(100));
            }
        })
        .catch(err => {
            dispatch(pushNotification({title: 'Error', text : "deleteFlag", type: "danger"}));
        });
};

