const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_CONTENT_CREATED':
            return {...state, ...action.payload };
    }
    return state;
};

export default reducer;
