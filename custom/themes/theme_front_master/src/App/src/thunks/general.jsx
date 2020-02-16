export const initApp = (drupal) => (dispatch) => {
    dispatch({ type: 'LOADING_BEGIN'});
    if (drupal && drupal.currentUser.uid && drupal.currentUser.uid !== '0' && drupal.currentUser.name) {
        dispatch({type: 'UPDATE_USER', payload: {uid: drupal.currentUser.uid, name: drupal.currentUser.name}});
    }
};

export const initPage = (page_title) => (dispatch, getState) => {
    dispatch({ type: 'LOADING_BEGIN'});
    document.title = getState().app.system.name + " - " + page_title;
    dispatch({ type: 'SET_PAGE_TITLE', payload: {page_title : page_title } });
    const user = getState().drupal.user;
    dispatch({ type: 'CLEAR_NOTIFICATIONS'});
    if (user.uid !== '0') {
        dispatch({ type: 'SET_USERNAME_SIDEBAR', payload: user.name });
        dispatch({ type: 'PUSH_NOTIFICATION', payload: {title: 'Boujour ' + user.name + ',', text : "Bienvenue sur le Dashboard.", type: "success"} });
    } else {
        dispatch({ type: 'PUSH_NOTIFICATION', payload: {title: 'Utilisateur non connecté :', text : "Veuillez vous authentifier pour acceder à toutes les fonctionnalités du dashboard.", type: "warning"} });
    }
};

export const pageReady = () => (dispatch, getState) => {
    dispatch({ type: 'LOADING_END'});
};

export const notReady = () => (dispatch, getState) => {
    dispatch({ type: 'LOADING_BEGIN'});
};

export const pushNotification = (notif) => (dispatch) => {
    dispatch({ type: 'PUSH_NOTIFICATION', payload: {title: notif.title, text : notif.text, type: notif.type} });
};

export const setCurrentRandomPage = (nid) => (dispatch) => {
    dispatch({ type: 'SET_CURRENT_RANDOM_PAGE', payload: nid});
};