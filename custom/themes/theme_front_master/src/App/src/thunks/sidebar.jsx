export const toggleSidebar = () => (dispatch, getState) => {
    dispatch({ type: 'TOGGLE_SIDEBAR', payload: {is_collapsed : getState().app.system.sidebar_is_collapsed} });
};

export const setActiveLinkSidebar = (url) => (dispatch) => {
    dispatch({ type: 'SET_ACTIVE_LINK_SIDEBAR', payload: {url: url} });
};
