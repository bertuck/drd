const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USERNAME_SIDEBAR':
            Object.values(state).forEach((item, index) => item.badge = index === 0 ? {variant: 'secondary', text: action.payload}: {});
            return {...state};
        case 'UPDATE_NAV_SIDEBAR':
            return {...state, ...action.payload};
        case 'SET_ACTIVE_LINK_SIDEBAR':
            let result = Object.keys(state).map(function(key) {
                return state[key];
            });
            result.forEach((item, index) => item.active = item.url === action.payload.url);
            return [...result];
    }
    return state;
};

export default reducer;