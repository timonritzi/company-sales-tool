import { GET_SELLERS } from '../actions/actionTypes'

const initialState = {
    sellers: [],
}

export const sellerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SELLERS: {
            return { ...state, sellers: [...action.payload] }
        }
    }
    return { ...state };
}