const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAR_NOTIFICATIONS':
            return {...state, items: [] };
        case 'PUSH_NOTIFICATION':
            let find = false;
            state.items.forEach((item, key) => {
                if (item.text.indexOf(action.payload.text)!=-1) {
                    find = true;
                    return true;
                }
            });
            if (!find)
                return {...state, items: state.items.concat(action.payload) };
        case 'SHOW_NOTIFICATIONS':
            return {...state, show: action.payload.show};
        case 'TOGGLE_NOTIFICATION':
            return {...state, show: action.payload.show };
        case 'SHOW_NOTIFICATION':
            return {...state, show: true, title: action.payload.title , text: action.payload.text, type: action.payload.type  };
        case 'HIDE_NOTIFICATION':
            return {...state, show: false };
    }
    return state;
};

export default reducer;
