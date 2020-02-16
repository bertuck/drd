const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_WEATHER':
            return {...state, ...action.payload };
    }
    return state;
};

export default reducer;
