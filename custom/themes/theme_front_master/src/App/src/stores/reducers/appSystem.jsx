const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOADING_BEGIN':
            return {...state, ready: false };
        case 'LOADING_END':
            return {...state, ready: true };
        case 'SET_PAGE_TITLE':
            return {...state, ...action.payload, page_title: action.payload.page_title };
        case 'TOGGLE_SIDEBAR':
            return {...state, sidebar_is_collapsed: !action.payload.is_collapsed };
        case 'GOTO' :
            return state;
        case 'SYNC_START':
            return state;
        case 'SYNC_END':
            return state;
        case 'SET_CURRENT_RANDOM_PAGE':
            return {...state, current_random_page: action.payload };
    }
    return state;
};

export default reducer;

