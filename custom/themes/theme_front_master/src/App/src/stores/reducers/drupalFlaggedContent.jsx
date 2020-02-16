const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_CONTENT_FLAGGED':
            return {...state, ...action.payload };
    }
    return state;
};

export default reducer;
