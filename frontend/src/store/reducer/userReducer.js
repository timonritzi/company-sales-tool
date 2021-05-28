import { GET_ALL_USERS } from '../actions/actionTypes';

const initialState = {
    users: [],
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_USERS: {
            // console.log("rudecer user ", action.payload)
            return { ...state, users: action.payload }
        }
    }
    return { ...state };
}
