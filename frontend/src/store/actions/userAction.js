import { GET_ALL_USERS } from '../actions/actionTypes'
import baseUrl from "../../components/url";

export const getUserAction = data => async (dispatch) => {
    const headers = new Headers({
        "Content-type": "application/json",
    })
    const config = {
        method: "GET",
        headers: headers,
    }

    // const urlUsername = data['username'].toLowerCase()


    fetch(`${baseUrl}/backend/api/users/${data['username']}`, config)
        .then(res => res.json())
        .then(users => {
            // console.log("in all users ", users)
            dispatch({
                type: GET_ALL_USERS,
                payload: users,
            })
        }).catch((e) => console.error(e))
}

// `https://autograf.propulsion-learn.ch/backend/api/users/${data['username']}`