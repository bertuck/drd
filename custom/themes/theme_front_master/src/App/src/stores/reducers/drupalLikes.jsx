const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_LIKES':
            return {...state, isFetching: false, data: action.payload };
        case 'FETCHING_LIKES':
            return {...state, isFetching: true };
    }
    return state;
};

export default reducer;
