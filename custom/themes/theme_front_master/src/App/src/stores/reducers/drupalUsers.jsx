const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USERS':
            return {...state, isFetching: false, data: action.payload };
        case 'FETCHING_USERS':
            return {...state, isFetching: false };
    }
    return state;
};

export default reducer;
