const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_LAST_PAGES':
            return {...state, isFetching: false, data: action.payload };
        case 'FETCHING_LAST_PAGES':
            return {...state, isFetching: true };
    }
    return state;
};

export default reducer;
