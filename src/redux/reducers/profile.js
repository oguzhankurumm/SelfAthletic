import { FETCH_USERDATA } from '../actions/profile';

const initialState = {
    users: [],
    loading: false
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERDATA:
            return {
                ...state,
                users: action.users
            };
        default:
            return state;
    }
};

export default userReducer;